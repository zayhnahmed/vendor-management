import { Component, inject, OnInit } from '@angular/core';
import { Mdatatable, TableConfig } from '../../../../shared/tables/mdatatable/mdatatable';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { selectSupplierRegRequests } from '../../stores/supplier-requests/supplier-requests.selector';
import { loadSupplierRegRequests } from '../../stores/supplier-requests/supplier-requests.actions';
import { SupplierRegRequestItem } from '../../../request/models/supplier-request-item.model';

@Component({
  selector: 'app-supplier-reg-request.page',
  imports: [Mdatatable, CommonModule],
  templateUrl: './supplier-reg-request.page.html',
  styleUrl: './supplier-reg-request.page.css',
})
export class SupplierRegRequestPage implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  requests$ = this.store.select(selectSupplierRegRequests).pipe(
    map((requests) =>
      requests.map((data) => ({
        ...data,
        status:
          data.step1Completed && data.step2Completed && data.step3Completed
            ? 'Completed'
            : 'Pending',
      })),
    ),
  );

  ngOnInit() {
    this.loadPage(1);
  }

  tableConfig: TableConfig = {
    columns: [
      { field: 'vendorUid', header: 'Vendor #', type: 'text' },
      { field: 'onboardingCompletedAt', header: 'Completed At', type: 'date' },
      { field: 'companyName', header: 'Company Name', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      {
        field: 'status',
        header: 'Status',
        type: 'status',
      },
      // {
      //   field: 'edit',
      //   header: 'Action',
      //   type: 'action',
      //   actionTemplate: (item: any) => 'Edit',
      // },
    ],
    itemsPerPage: 5,
    showPagination: true,
    showPageSize: true,
    pageSizeOptions: [5, 10, 25, 50],
    showSearch: true,
    searchPlaceholder: 'Search orders...',
  };

  loadPage(page: number) {
    this.store.dispatch(loadSupplierRegRequests({ page, limit: 5 }));
  }

  handleRowClick(item: SupplierRegRequestItem) {
    console.log('Row clicked:', item);
    // Navigate to order details or open modal
    this.router.navigate([item.id], { relativeTo: this.route });
  }

  handleActionClick(event: { action: string; item: any }) {
    console.log('Action clicked:', event);
    // Handle edit, delete, etc.
  }

  onPageChange(page: number) {
    console.log('Page changed to:', page);
    // Fetch data for new page if using server-side pagination
  }
}
