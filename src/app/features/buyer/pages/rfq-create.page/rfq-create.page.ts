import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RfqService } from '../../services/rfq/rfq.service';

@Component({
  selector: 'app-rfq-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rfq-create.page.html',
  styleUrl: './rfq-create.page.css',
})
export class RfqCreatePage {
  private fb = inject(FormBuilder);
  private rfqService = inject(RfqService);
  private router = inject(Router);

  submitting = signal(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    currency: ['SAR'],
    deliveryDeadline: [''],
    submissionDeadline: [''],
    termsAndConditions: [''],
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
        unit: [''],
        specifications: [''],
      }),
    );
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
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
      title: value.title,
      ...(value.description && { description: value.description }),
      ...(value.currency && { currency: value.currency }),
      ...(value.deliveryDeadline && { deliveryDeadline: value.deliveryDeadline }),
      ...(value.submissionDeadline && { submissionDeadline: value.submissionDeadline }),
      ...(value.termsAndConditions && { termsAndConditions: value.termsAndConditions }),
      items: value.items.map((item: { materialId: string; quantity: number; unit: string; specifications: string }) => ({
        materialId: item.materialId,
        quantity: item.quantity,
        ...(item.unit && { unit: item.unit }),
        ...(item.specifications && { specifications: item.specifications }),
      })),
    };

    this.rfqService.create(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/buyer/rfqs', res.data.id]);
      },
      error: () => {
        this.error.set('Failed to create RFQ. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/buyer/rfqs']);
  }

  hasError(controlPath: string): boolean {
    const control = this.form.get(controlPath);
    return !!(control?.invalid && control?.touched);
  }

  itemHasError(index: number, field: string): boolean {
    const control = this.items.at(index)?.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
