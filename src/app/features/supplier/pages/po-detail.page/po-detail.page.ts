import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PoService, PurchaseOrder, PoStatus } from '../../../buyer/services/po/po.service';

@Component({
  selector: 'app-supplier-po-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './po-detail.page.html',
  styleUrl: './po-detail.page.css',
})
export class SupplierPoDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private poService = inject(PoService);

  po = signal<PurchaseOrder | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  actionLoading = signal<string | null>(null);
  showCancelConfirm = signal(false);

  private poId = '';

  ngOnInit(): void {
    this.poId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.poService.getById(this.poId, 'vendor').subscribe({
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

  acknowledge(): void {
    this.actionLoading.set('acknowledge');
    this.poService.acknowledge(this.poId).subscribe({
      next: () => { this.actionLoading.set(null); this.load(); },
      error: () => this.actionLoading.set(null),
    });
  }

  cancelPo(): void {
    this.actionLoading.set('cancel');
    this.poService.cancel(this.poId, 'vendor').subscribe({
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

  goBack(): void {
    this.router.navigate(['/supplier/purchase-orders']);
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

  canAcknowledge(): boolean { return this.po()?.status === 'ISSUED'; }
  canCancel(): boolean {
    const s = this.po()?.status;
    return s === 'ISSUED' || s === 'ACKNOWLEDGED';
  }
}
