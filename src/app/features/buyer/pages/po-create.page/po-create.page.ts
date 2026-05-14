import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoService } from '../../services/po/po.service';

@Component({
  selector: 'app-po-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './po-create.page.html',
  styleUrl: './po-create.page.css',
})
export class PoCreatePage {
  private fb = inject(FormBuilder);
  private poService = inject(PoService);
  private router = inject(Router);

  submitting = signal(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    vendorOrgId: ['', Validators.required],
    deliveryDeadline: [''],
    shippingAddress: [''],
    billingAddress: [''],
    notes: [''],
    items: this.fb.array([]),
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.addItem();
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        materialId: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: ['', [Validators.required, Validators.min(0.01)]],
        unit: [''],
      }),
    );
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  lineTotal(index: number): number {
    const item = this.items.at(index);
    const qty = Number(item.get('quantity')?.value) || 0;
    const price = Number(item.get('unitPrice')?.value) || 0;
    return qty * price;
  }

  get grandTotal(): number {
    return this.items.controls.reduce((sum, _, i) => sum + this.lineTotal(i), 0);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const value = this.form.getRawValue();
    const payload = {
      vendorOrgId: value.vendorOrgId,
      items: value.items.map((item: { materialId: string; quantity: number; unitPrice: number; unit: string }) => ({
        materialId: item.materialId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        ...(item.unit && { unit: item.unit }),
      })),
      ...(value.deliveryDeadline && { deliveryDeadline: value.deliveryDeadline }),
      ...(value.shippingAddress && { shippingAddress: value.shippingAddress }),
      ...(value.billingAddress && { billingAddress: value.billingAddress }),
      ...(value.notes && { notes: value.notes }),
    };

    this.poService.createManual(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/buyer/purchase-orders', res.data.id]);
      },
      error: () => {
        this.error.set('Failed to create purchase order. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/buyer/purchase-orders']);
  }

  hasError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  itemHasError(index: number, field: string): boolean {
    const c = this.items.at(index)?.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
