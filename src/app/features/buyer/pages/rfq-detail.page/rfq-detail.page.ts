import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rfq, Quote, RfqService } from '../../services/rfq/rfq.service';

@Component({
  selector: 'app-rfq-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rfq-detail.page.html',
  styleUrl: './rfq-detail.page.css',
})
export class RfqDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rfqService = inject(RfqService);
  private fb = inject(FormBuilder);

  rfq = signal<Rfq | null>(null);
  quotes = signal<Quote[]>([]);
  loading = signal(true);
  quotesLoading = signal(false);
  error = signal<string | null>(null);

  showDistributeModal = signal(false);
  showCancelConfirm = signal(false);
  distributing = signal(false);
  cancelling = signal(false);
  awarding = signal<string | null>(null);
  distributeError = signal<string | null>(null);

  distributeForm: FormGroup = this.fb.group({
    vendorOrgIds: ['', Validators.required],
  });

  private rfqId = '';

  ngOnInit(): void {
    this.rfqId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadRfq();
  }

  loadRfq(): void {
    this.loading.set(true);
    this.rfqService.getById(this.rfqId, 'buyer').subscribe({
      next: (res) => {
        this.rfq.set(res.data);
        this.loading.set(false);
        if (res.data.status === 'OPEN' || res.data.status === 'CLOSED') {
          this.loadQuotes();
        }
      },
      error: () => {
        this.error.set('Failed to load RFQ details.');
        this.loading.set(false);
      },
    });
  }

  loadQuotes(): void {
    this.quotesLoading.set(true);
    this.rfqService.getQuotes(this.rfqId).subscribe({
      next: (res) => {
        this.quotes.set(res.data ?? []);
        this.quotesLoading.set(false);
      },
      error: () => this.quotesLoading.set(false),
    });
  }

  openDistribute(): void {
    this.distributeForm.reset();
    this.distributeError.set(null);
    this.showDistributeModal.set(true);
  }

  closeDistribute(): void {
    this.showDistributeModal.set(false);
  }

  submitDistribute(): void {
    if (this.distributeForm.invalid) {
      this.distributeForm.markAllAsTouched();
      return;
    }
    const raw: string = this.distributeForm.get('vendorOrgIds')?.value ?? '';
    const vendorOrgIds = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (vendorOrgIds.length === 0) {
      this.distributeError.set('Please enter at least one vendor organization ID.');
      return;
    }

    this.distributing.set(true);
    this.distributeError.set(null);

    this.rfqService.distribute(this.rfqId, vendorOrgIds).subscribe({
      next: () => {
        this.distributing.set(false);
        this.showDistributeModal.set(false);
        this.loadRfq();
      },
      error: () => {
        this.distributeError.set('Failed to distribute RFQ. Please try again.');
        this.distributing.set(false);
      },
    });
  }

  awardQuote(quoteId: string): void {
    this.awarding.set(quoteId);
    this.rfqService.award(this.rfqId, quoteId).subscribe({
      next: () => {
        this.awarding.set(null);
        this.loadRfq();
      },
      error: () => this.awarding.set(null),
    });
  }

  confirmCancel(): void {
    this.showCancelConfirm.set(true);
  }

  cancelRfq(): void {
    this.cancelling.set(true);
    this.rfqService.cancel(this.rfqId).subscribe({
      next: () => {
        this.cancelling.set(false);
        this.showCancelConfirm.set(false);
        this.loadRfq();
      },
      error: () => {
        this.cancelling.set(false);
        this.showCancelConfirm.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/buyer/rfqs']);
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

  canDistribute(): boolean {
    return this.rfq()?.status === 'DRAFT';
  }

  canCancel(): boolean {
    const s = this.rfq()?.status;
    return s === 'DRAFT' || s === 'OPEN';
  }

  canAward(): boolean {
    return this.rfq()?.status === 'OPEN' || this.rfq()?.status === 'CLOSED';
  }
}
