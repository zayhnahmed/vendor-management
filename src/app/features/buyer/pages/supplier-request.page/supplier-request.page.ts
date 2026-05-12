import { Component, inject, OnInit } from '@angular/core';
import { Mdatatable, TableConfig } from '../../../../shared/tables/mdatatable/mdatatable';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { selectSupplierRequests } from '../../stores/supplier-requests/supplier-requests.selector';
import { loadSupplierRequests } from '../../stores/supplier-requests/supplier-requests.actions';
import { SupplierRequestItem } from '../../../request/models/supplier-request-item.model';

@Component({
  selector: 'app-supplier-request.page',
  imports: [Mdatatable, CommonModule],
  templateUrl: './supplier-request.page.html',
  styleUrl: './supplier-request.page.css',
})
export class SupplierRequestPage implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router)
  private route: ActivatedRoute = inject(ActivatedRoute);

  requests$ = this.store.select(selectSupplierRequests);

  ngOnInit() {
    this.loadPage(1)
  }

  tableConfig: TableConfig = {
    columns: [
      { field: 'applicationId', header: 'Request #', type: 'text' },
      { field: 'submittedAt', header: 'Request Date', type: 'date' },
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
      //   actionTemplate: (_) => 'View',
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
    this.store.dispatch(loadSupplierRequests({ page, limit: 5 }));
  }

  handleRowClick(item: SupplierRequestItem) {
    console.log('Row clicked:', item);
    this.router.navigate([item.applicationId], { relativeTo: this.route });
    // Navigate to order details or open modal
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
