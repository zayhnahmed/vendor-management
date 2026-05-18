import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../buyer/services/invoice/invoice.service';
import { PoService, PurchaseOrder } from '../../../buyer/services/po/po.service';

@Component({
  selector: 'app-supplier-invoice-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-create.page.html',
})
export class SupplierInvoiceCreatePage implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly poService = inject(PoService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  deliveredPos = signal<PurchaseOrder[]>([]);
  loadingPos = signal(true);
  submitting = signal(false);
  submitError = signal<string | null>(null);

  form = this.fb.group({
    purchaseOrderId: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    currency: ['SAR'],
    dueDate: ['', Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    // Only delivered POs can be invoiced
    this.poService.list('vendor', 'DELIVERED').subscribe({
      next: (res) => { this.deliveredPos.set(res.data ?? []); this.loadingPos.set(false); },
      error: () => { this.loadingPos.set(false); },
    });
  }

  onPoSelect(event: Event): void {
    const poId = (event.target as HTMLSelectElement).value;
    const po = this.deliveredPos().find((p) => p.id === poId);
    if (po?.totalAmount) {
      this.form.patchValue({ amount: po.totalAmount });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.submitError.set(null);

    const v = this.form.value;
    this.invoiceService.create({
      purchaseOrderId: v.purchaseOrderId!,
      amount: v.amount!,
      currency: v.currency || 'SAR',
      dueDate: v.dueDate || undefined,
      notes: v.notes || undefined,
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.router.navigate(['/supplier/invoices', res.data.id]);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(err.error?.message ?? 'Failed to create invoice. Please try again.');
      },
    });
  }

  goBack(): void { this.router.navigate(['/supplier/invoices']); }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && (c.touched || c.dirty));
  }
}
