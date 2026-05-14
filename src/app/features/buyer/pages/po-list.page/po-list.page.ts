import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PoService, PurchaseOrder, PoStatus } from '../../services/po/po.service';

@Component({
  selector: 'app-po-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './po-list.page.html',
  styleUrl: './po-list.page.css',
})
export class PoListPage implements OnInit {
  private poService = inject(PoService);
  private router = inject(Router);

  pos = signal<PurchaseOrder[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFilter = signal<string>('ALL');
  searchTerm = signal('');

  readonly filters: { label: string; value: string }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Issued', value: 'ISSUED' },
    { label: 'Acknowledged', value: 'ACKNOWLEDGED' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Invoiced', value: 'INVOICED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  filtered = computed(() => {
    let data = this.pos();
    const filter = this.activeFilter();
    const search = this.searchTerm().toLowerCase();

    if (filter !== 'ALL') {
      data = data.filter((p) => p.status === filter);
    }
    if (search) {
      data = data.filter(
        (p) =>
          p.id.toLowerCase().includes(search) ||
          (p.vendorName ?? '').toLowerCase().includes(search),
      );
    }
    return data;
  });

  counts = computed(() => {
    const all = this.pos();
    const byStatus = (s: string) => all.filter((p) => p.status === s).length;
    return {
      ALL: all.length,
      DRAFT: byStatus('DRAFT'),
      ISSUED: byStatus('ISSUED'),
      ACKNOWLEDGED: byStatus('ACKNOWLEDGED'),
      SHIPPED: byStatus('SHIPPED'),
      DELIVERED: byStatus('DELIVERED'),
      INVOICED: byStatus('INVOICED'),
      CANCELLED: byStatus('CANCELLED'),
    };
  });

  ngOnInit(): void {
    this.poService.list('buyer').subscribe({
      next: (res) => {
        this.pos.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load purchase orders.');
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

  createManual(): void {
    this.router.navigate(['/buyer/purchase-orders/create']);
  }

  viewPo(id: string): void {
    this.router.navigate(['/buyer/purchase-orders', id]);
  }

  getStatusBadgeClass(status: PoStatus): string {
    const map: Record<PoStatus, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      ISSUED: 'bg-blue-100 text-blue-700',
      ACKNOWLEDGED: 'bg-purple-100 text-purple-700',
      SHIPPED: 'bg-orange-100 text-orange-700',
      DELIVERED: 'bg-green-100 text-green-700',
      INVOICED: 'bg-teal-100 text-teal-700',
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
