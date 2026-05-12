import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-supplier-waiting-review.page',
  imports: [CommonModule],
  templateUrl: './supplier-waiting-review.page.html',
  styleUrl: './supplier-waiting-review.page.css',
})
export class SupplierWaitingReviewPage {
  generateReferenceNumber(): string {
    // Generate a random reference number
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp}${random}`;
  }

  goToDashboard(): void {
    // Navigate to dashboard
    // this.router.navigate(['/dashboard']);
    console.log('Navigate to dashboard');
  }

  trackStatus(): void {
    // Navigate to status tracking page
    // this.router.navigate(['/track-status']);
    console.log('Navigate to status tracking');
  }
}
