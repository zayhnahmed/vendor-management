import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  VendorConnection,
  VendorOnboardingService,
} from '../../services/vendor-onboarding/vendor-onboarding.service';

type ConnectionStatus = 'ALL' | 'PENDING' | 'ACTIVE' | 'REJECTED' | 'REVOKED';

@Component({
  selector: 'app-vendor-onboarding-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './vendor-onboarding-list.page.html',
})
export class VendorOnboardingListPage implements OnInit {
  private readonly service = inject(VendorOnboardingService);
  private readonly router = inject(Router);

  connections = signal<VendorConnection[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFilter = signal<string>('ALL');
  searchTerm = signal('');

  readonly filters: { label: string; value: string }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  filtered = computed(() => {
    let data = this.connections();
    const filter = this.activeFilter();
    const search = this.searchTerm().toLowerCase();

    if (filter !== 'ALL') {
      data = data.filter((c) => c.status === filter);
    }

    if (search) {
      data = data.filter((c) => {
        const name = (c.vendorName ?? c.targetOrgName ?? '').toLowerCase();
        return name.includes(search) || c.id.toLowerCase().includes(search);
      });
    }

    return data;
  });

  counts = computed((): Record<string, number> => ({
    ALL: this.connections().length,
    ACTIVE: this.connections().filter((c) => c.status === 'ACTIVE').length,
    PENDING: this.connections().filter((c) => c.status === 'PENDING').length,
    REJECTED: this.connections().filter((c) => c.status === 'REJECTED').length,
  }));

  ngOnInit(): void {
    this.service.listVendorConnections().subscribe({
      next: (res) => {
        this.connections.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load vendor connections. Please try again.');
        this.loading.set(false);
      },
    });
  }

  setFilter(value: string): void {
    this.activeFilter.set(value);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  viewOnboarding(relationshipId: string): void {
    this.router.navigate(['/buyer/vendor-onboarding', relationshipId]);
  }

  getVendorName(c: VendorConnection): string {
    return c.vendorName ?? c.targetOrgName ?? c.targetOrgId ?? '—';
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      REJECTED: 'bg-red-100 text-red-700',
      REVOKED: 'bg-gray-100 text-gray-600',
    };
    return `px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`;
  }

  getFilterButtonClass(value: string): string {
    const isActive = this.activeFilter() === value;
    return `px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
      isActive
        ? 'bg-[#940000] text-white shadow-sm'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  }
}
