import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice, InvoiceService } from '../../services/invoice/invoice.service';

@Component({
  selector: 'app-buyer-invoice-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './invoice-detail.page.html',
})
export class BuyerInvoiceDetailPage implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly invoiceId = this.route.snapshot.paramMap.get('id') ?? '';

  invoice = signal<Invoice | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  actionLoading = signal(false);
  actionError = signal<string | null>(null);
  actionSuccess = signal<string | null>(null);
  showCancelConfirm = signal(false);

  canPay = computed(() => {
    const s = this.invoice()?.status;
    return s === 'PENDING' || s === 'OVERDUE';
  });

  canCancel = computed(() => {
    const s = this.invoice()?.status;
    return s === 'PENDING' || s === 'OVERDUE';
  });

  isOverdue = computed(() => {
    const inv = this.invoice();
    if (!inv?.dueDate || inv.status !== 'PENDING') return false;
    return new Date(inv.dueDate) < new Date();
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.invoiceService.getById(this.invoiceId, 'buyer').subscribe({
      next: (res) => { this.invoice.set(res.data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load invoice.'); this.loading.set(false); },
    });
  }

  pay(): void {
    this.actionLoading.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);
    this.invoiceService.pay(this.invoiceId).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.actionSuccess.set('Invoice marked as paid successfully.');
        this.load();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.actionError.set(err.error?.message ?? 'Failed to mark as paid.');
      },
    });
  }

  cancel(): void {
    this.showCancelConfirm.set(false);
    this.actionLoading.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);
    this.invoiceService.cancel(this.invoiceId).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.actionSuccess.set('Invoice cancelled.');
        this.load();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.actionError.set(err.error?.message ?? 'Failed to cancel invoice.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/buyer/invoices']);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      PAID: 'bg-green-100 text-green-700 border border-green-200',
      OVERDUE: 'bg-red-100 text-red-700 border border-red-200',
      CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200',
    };
    return `px-3 py-1 text-sm font-semibold rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`;
  }
}
