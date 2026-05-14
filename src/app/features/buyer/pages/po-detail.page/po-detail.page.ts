import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PoService, PurchaseOrder, PoStatus, Shipment } from '../../services/po/po.service';

@Component({
  selector: 'app-po-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './po-detail.page.html',
  styleUrl: './po-detail.page.css',
})
export class PoDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private poService = inject(PoService);
  private fb = inject(FormBuilder);

  po = signal<PurchaseOrder | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  actionLoading = signal<string | null>(null);
  showShipmentModal = signal(false);
  showCancelConfirm = signal(false);
  shipmentError = signal<string | null>(null);

  shipmentForm: FormGroup = this.fb.group({
    trackingNumber: [''],
    carrier: [''],
    estimatedDelivery: [''],
    notes: [''],
  });

  private poId = '';

  ngOnInit(): void {
    this.poId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.poService.getById(this.poId, 'buyer').subscribe({
      next: (res) => {
        this.po.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load purchase order.');
        this.loading.set(false);
      },
    });
  }

  issue(): void {
    this.actionLoading.set('issue');
    this.poService.issue(this.poId).subscribe({
      next: () => { this.actionLoading.set(null); this.load(); },
      error: () => this.actionLoading.set(null),
    });
  }

  deliver(): void {
    this.actionLoading.set('deliver');
    this.poService.deliver(this.poId).subscribe({
      next: () => { this.actionLoading.set(null); this.load(); },
      error: () => this.actionLoading.set(null),
    });
  }

  cancelPo(): void {
    this.actionLoading.set('cancel');
    this.poService.cancel(this.poId, 'buyer').subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.showCancelConfirm.set(false);
        this.load();
      },
      error: () => {
        this.actionLoading.set(null);
        this.showCancelConfirm.set(false);
      },
    });
  }

  openShipment(): void {
    this.shipmentForm.reset();
    this.shipmentError.set(null);
    this.showShipmentModal.set(true);
  }

  submitShipment(): void {
    this.actionLoading.set('shipment');
    this.shipmentError.set(null);
    const value = this.shipmentForm.getRawValue();
    const payload = {
      ...(value.trackingNumber && { trackingNumber: value.trackingNumber }),
      ...(value.carrier && { carrier: value.carrier }),
      ...(value.estimatedDelivery && { estimatedDelivery: value.estimatedDelivery }),
      ...(value.notes && { notes: value.notes }),
    };

    this.poService.addShipment(this.poId, payload).subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.showShipmentModal.set(false);
        this.load();
      },
      error: () => {
        this.shipmentError.set('Failed to add shipment. Please try again.');
        this.actionLoading.set(null);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/buyer/purchase-orders']);
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
    return `px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`;
  }

  canIssue(): boolean { return this.po()?.status === 'DRAFT'; }
  canAddShipment(): boolean { return this.po()?.status === 'ACKNOWLEDGED'; }
  canDeliver(): boolean { return this.po()?.status === 'SHIPPED'; }
  canCancel(): boolean {
    const s = this.po()?.status;
    return s === 'DRAFT' || s === 'ISSUED' || s === 'ACKNOWLEDGED';
  }
}
