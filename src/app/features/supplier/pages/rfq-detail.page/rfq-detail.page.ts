import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rfq, RfqService } from '../../../buyer/services/rfq/rfq.service';

@Component({
  selector: 'app-supplier-rfq-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rfq-detail.page.html',
  styleUrl: './rfq-detail.page.css',
})
export class SupplierRfqDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rfqService = inject(RfqService);
  private fb = inject(FormBuilder);

  rfq = signal<Rfq | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  submitted = signal(false);
  submitError = signal<string | null>(null);

  quoteForm: FormGroup = this.fb.group({
    items: this.fb.array([]),
    leadTimeDays: [''],
    validUntil: [''],
    notes: [''],
  });

  private rfqId = '';

  get quoteItems(): FormArray {
    return this.quoteForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.rfqId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadRfq();
  }

  loadRfq(): void {
    this.loading.set(true);
    this.rfqService.getById(this.rfqId, 'vendor').subscribe({
      next: (res) => {
        this.rfq.set(res.data);
        this.loading.set(false);
        if (res.data.status === 'OPEN') {
          this.buildQuoteForm(res.data);
          this.rfqService.markViewed(this.rfqId).subscribe();
        }
      },
      error: () => {
        this.error.set('Failed to load RFQ details.');
        this.loading.set(false);
      },
    });
  }

  buildQuoteForm(rfq: Rfq): void {
    this.quoteItems.clear();
    rfq.items.forEach((item) => {
      this.quoteItems.push(
        this.fb.group({
          rfqItemId: [item.id],
          materialName: [item.materialName ?? item.materialId],
          quantity: [item.quantity],
          unit: [item.unit ?? ''],
          unitPrice: ['', [Validators.required, Validators.min(0.01)]],
          notes: [''],
        }),
      );
    });
  }

  submitQuote(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const value = this.quoteForm.getRawValue();
    const payload = {
      items: value.items.map((item: { rfqItemId: string; unitPrice: number; notes: string }) => ({
        rfqItemId: item.rfqItemId,
        unitPrice: Number(item.unitPrice),
        ...(item.notes && { notes: item.notes }),
      })),
      ...(value.leadTimeDays && { leadTimeDays: Number(value.leadTimeDays) }),
      ...(value.validUntil && { validUntil: value.validUntil }),
      ...(value.notes && { notes: value.notes }),
    };

    this.rfqService.submitQuote(this.rfqId, payload).subscribe({
      next: () => {
        this.submitted.set(true);
        this.submitting.set(false);
      },
      error: () => {
        this.submitError.set('Failed to submit quote. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/supplier/rfqs']);
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      OPEN: 'bg-blue-100 text-blue-700',
      CLOSED: 'bg-yellow-100 text-yellow-700',
      AWARDED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return `px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`;
  }

  itemHasError(index: number): boolean {
    const control = this.quoteItems.at(index)?.get('unitPrice');
    return !!(control?.invalid && control?.touched);
  }
}
