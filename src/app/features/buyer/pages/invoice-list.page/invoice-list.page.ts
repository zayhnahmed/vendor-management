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
import { Invoice, InvoiceService, InvoiceStatus } from '../../services/invoice/invoice.service';

@Component({
  selector: 'app-buyer-invoice-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './invoice-list.page.html',
})
export class BuyerInvoiceListPage implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly router = inject(Router);

  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFilter = signal<string>('ALL');
  searchTerm = signal('');

  readonly filters: { label: string; value: string }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  filtered = computed(() => {
    let data = this.invoices();
    const f = this.activeFilter();
    const s = this.searchTerm().toLowerCase();
    if (f !== 'ALL') data = data.filter((i) => i.status === f);
    if (s) data = data.filter((i) =>
      (i.vendorName ?? '').toLowerCase().includes(s) ||
      i.id.toLowerCase().includes(s) ||
      i.purchaseOrderId.toLowerCase().includes(s),
    );
    return data;
  });

  counts = computed((): Record<string, number> => ({
    ALL: this.invoices().length,
    PENDING: this.invoices().filter((i) => i.status === 'PENDING').length,
    PAID: this.invoices().filter((i) => i.status === 'PAID').length,
    OVERDUE: this.invoices().filter((i) => i.status === 'OVERDUE').length,
    CANCELLED: this.invoices().filter((i) => i.status === 'CANCELLED').length,
  }));

  ngOnInit(): void {
    this.invoiceService.list('buyer').subscribe({
      next: (res) => { this.invoices.set(res.data ?? []); this.loading.set(false); },
      error: () => { this.error.set('Failed to load invoices.'); this.loading.set(false); },
    });
  }

  setFilter(value: string): void { this.activeFilter.set(value); }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  viewInvoice(id: string): void {
    this.router.navigate(['/buyer/invoices', id]);
  }

  getStatusClass(status: InvoiceStatus): string {
    const map: Record<InvoiceStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PAID: 'bg-green-100 text-green-700',
      OVERDUE: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-500',
    };
    return `px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`;
  }

  getFilterClass(value: string): string {
    const active = this.activeFilter() === value;
    return `px-3 py-1.5 text-sm font-medium rounded-full transition-all ${active ? 'bg-[#940000] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
  }

  isOverdue(invoice: Invoice): boolean {
    if (!invoice.dueDate || invoice.status !== 'PENDING') return false;
    return new Date(invoice.dueDate) < new Date();
  }
}
