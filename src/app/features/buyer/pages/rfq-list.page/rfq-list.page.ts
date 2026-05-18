import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Rfq, RfqService, RfqStatus } from '../../services/rfq/rfq.service';

@Component({
  selector: 'app-rfq-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './rfq-list.page.html',
  styleUrl: './rfq-list.page.css',
})
export class RfqListPage implements OnInit {
  private rfqService = inject(RfqService);
  private router = inject(Router);

  rfqs = signal<Rfq[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFilter = signal<string>('ALL');
  searchTerm = signal('');

  readonly filters: { label: string; value: string }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Open', value: 'OPEN' },
    { label: 'Closed', value: 'CLOSED' },
    { label: 'Awarded', value: 'AWARDED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  filtered = computed(() => {
    let data = this.rfqs();
    const filter = this.activeFilter();
    const search = this.searchTerm().toLowerCase();

    if (filter !== 'ALL') {
      data = data.filter((r) => r.status === filter);
    }

    if (search) {
      data = data.filter(
        (r) => r.title.toLowerCase().includes(search) || r.id.toLowerCase().includes(search),
      );
    }

    return data;
  });

  counts = computed((): Record<string, number> => ({
    ALL: this.rfqs().length,
    DRAFT: this.rfqs().filter((r) => r.status === 'DRAFT').length,
    OPEN: this.rfqs().filter((r) => r.status === 'OPEN').length,
    CLOSED: this.rfqs().filter((r) => r.status === 'CLOSED').length,
    AWARDED: this.rfqs().filter((r) => r.status === 'AWARDED').length,
    CANCELLED: this.rfqs().filter((r) => r.status === 'CANCELLED').length,
  }));

  ngOnInit(): void {
    this.rfqService.listBuyer().subscribe({
      next: (res) => {
        this.rfqs.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load RFQs. Please try again.');
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

  createRfq(): void {
    this.router.navigate(['/buyer/rfqs/create']);
  }

  viewRfq(id: string): void {
    this.router.navigate(['/buyer/rfqs', id]);
  }

  getStatusBadgeClass(status: RfqStatus): string {
    const map: Record<RfqStatus, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      OPEN: 'bg-blue-100 text-blue-700',
      CLOSED: 'bg-yellow-100 text-yellow-700',
      AWARDED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return `px-2.5 py-0.5 text-xs font-medium rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`;
  }

  getFilterButtonClass(value: string): string {
    const isActive = this.activeFilter() === value;
    return `px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
      isActive ? 'bg-[#940000] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  }
}
