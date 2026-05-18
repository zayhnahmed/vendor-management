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
import { FormsModule } from '@angular/forms';
import {
  VendorOnboardingService,
  VendorOnboardingStatus,
} from '../../services/vendor-onboarding/vendor-onboarding.service';

@Component({
  selector: 'app-vendor-onboarding-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-onboarding-detail.page.html',
})
export class VendorOnboardingDetailPage implements OnInit {
  private readonly service = inject(VendorOnboardingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly relationshipId = this.route.snapshot.paramMap.get('id') ?? '';

  onboarding = signal<VendorOnboardingStatus | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  actionLoading = signal(false);
  actionError = signal<string | null>(null);
  actionSuccess = signal<string | null>(null);

  showRejectModal = signal(false);
  rejectReason = signal('');

  canApprove = computed(() => {
    const ob = this.onboarding();
    if (!ob) return false;
    return (
      ob.allStepsCompleted &&
      (ob.vendorStatus === 'SUBMITTED' || ob.vendorStatus === 'PENDING_APPROVAL')
    );
  });

  canReject = computed(() => this.canApprove());

  steps = computed(() => {
    const ob = this.onboarding();
    if (!ob) return [];
    return [
      { num: 1, label: 'General Information', completed: ob.step1Completed, data: ob.generalInfo },
      { num: 2, label: 'Financial Information', completed: ob.step2Completed, data: ob.financialInfo },
      {
        num: 3,
        label: 'Compliance & Certifications',
        completed: ob.step3Completed,
        data: ob.complianceInfo,
      },
    ];
  });

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getStatus(this.relationshipId).subscribe({
      next: (res) => {
        this.onboarding.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load onboarding details. Please try again.');
        this.loading.set(false);
      },
    });
  }

  approve(): void {
    this.actionLoading.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    this.service.approve(this.relationshipId).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.actionSuccess.set('Vendor onboarding approved successfully.');
        this.loadStatus();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.actionError.set(err.error?.message ?? 'Approval failed. Please try again.');
      },
    });
  }

  openRejectModal(): void {
    this.rejectReason.set('');
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
  }

  confirmReject(): void {
    const reason = this.rejectReason().trim();
    if (!reason) return;

    this.actionLoading.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);
    this.showRejectModal.set(false);

    this.service.reject(this.relationshipId, reason).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.actionSuccess.set('Vendor onboarding rejected.');
        this.loadStatus();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.actionError.set(err.error?.message ?? 'Rejection failed. Please try again.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/buyer/vendor-onboarding']);
  }

  getVendorStatusClass(status: string): string {
    const map: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-700',
      SUBMITTED: 'bg-blue-100 text-blue-700',
      PENDING_APPROVAL: 'bg-blue-100 text-blue-700',
      REJECTED: 'bg-red-100 text-red-700',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
      NOT_STARTED: 'bg-gray-100 text-gray-600',
    };
    return `px-3 py-1 text-sm font-semibold rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`;
  }

  getDataEntries(data: Record<string, unknown> | undefined): { key: string; value: string }[] {
    if (!data) return [];
    return Object.entries(data)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => ({
        key: k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
        value: Array.isArray(v) ? v.join(', ') : String(v),
      }));
  }
}
