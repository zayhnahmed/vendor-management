import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexDataLabels, ApexPlotOptions, ApexStroke, NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart } from 'ng-apexcharts';

interface SupplierRequestItem {
  applicationId: string;
  // submittedAt: Date;
  companyName: string;
  email: string;
  category: string;
  // purchasingDept: string;
  status: 'New' | 'InProgress' | 'Approved' | 'Rejected';
  requestedBy: string;
}

@Component({
  selector: 'app-buyer-requests.page',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './buyer-requests.page.html',
  styleUrl: './buyer-requests.page.css',
})
export class BuyerRequestsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Expose Math for template
  Math = Math;

  // Data
  requests: SupplierRequestItem[] = [];
  filteredRequests: SupplierRequestItem[] = [];

  // UI State
  searchTerm = '';
  activeFilter = 'New';
  currentPage = 1;
  itemsPerPage = 10;
  activeMenu: string | null = null;

  // Configuration
  readonly pageSizeOptions = [5, 10, 25, 50];
  readonly filters = [
    { label: 'New', value: 'New' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'All', value: 'All' },
  ];

  readonly tableColumns = [
    { field: 'applicationId', header: 'Request ID' },
    // { field: 'submittedAt', header: 'Submission Date' },
    { field: 'companyName', header: 'Vendor Name' },
    { field: 'category', header: 'Category' },
    // { field: 'purchasingDept', header: 'Purchasing Dept' },
    { field: 'status', header: 'Status' },
  ];

  stats = {
    new: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  get totalPages(): number {
    return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
  }

  get paginatedData(): SupplierRequestItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredRequests.slice(start, end);
  }

  ngOnInit(): void {
    this.loadMockData();
    this.updateStats();
    this.filterRequests();
  }

  private loadMockData(): void {
    this.requests = [
      {
        applicationId: 'AR-2024-019',

        companyName: 'Zaman Trading',
        email: 'contact@zamantrading.com',
        category: 'IT Equipment',
        status: 'New',
        requestedBy: 'John Smith',
      },
      {
        applicationId: 'AR-2024-018',

        companyName: 'Zaman Trading',
        email: 'contact@zamantrading.com',
        category: 'Construction',
        status: 'New',
        requestedBy: 'Sarah Johnson',
      },
      {
        applicationId: 'AR-2024-017',

        companyName: 'BizHub Solutions',
        email: 'info@bizhubsolutions.com',
        category: 'IT Equipment',
        status: 'New',
        requestedBy: 'Michael Brown',
      },
      {
        applicationId: 'AR-2024-016',

        companyName: 'Zaman Trading',
        email: 'contact@zamantrading.com',
        category: 'Construction',
        status: 'InProgress',
        requestedBy: 'Emily Davis',
      },
      {
        applicationId: 'AR-2024-013',

        companyName: 'Faisal Ahmed',
        email: 'faisal.ahmed@email.com',
        category: 'Heavy Equipment',
        status: 'Rejected',
        requestedBy: 'David Wilson',
      },
      {
        applicationId: 'AR-2024-012',

        companyName: 'Bayat Rebbit',
        email: 'info@bayatrebbit.com',
        category: 'IAM/yiopete',
        status: 'InProgress',
        requestedBy: 'Lisa Anderson',
      },
      {
        applicationId: 'AR-2024-011',

        companyName: 'Faisal Ahmed',
        email: 'faisal.ahmed@email.com',
        category: 'IT Equipment',
        status: 'Approved',
        requestedBy: 'Robert Taylor',
      },
      {
        applicationId: 'AR-2024-010',

        companyName: 'Tech Solutions Ltd',
        email: 'contact@techsolutions.com',
        category: 'IT Equipment',
        status: 'New',
        requestedBy: 'Jennifer Martinez',
      },
    ];
  }

  private updateStats(): void {
    this.stats = {
      new: this.requests.filter((r) => r.status === 'New').length,
      pending: this.requests.filter((r) => r.status === 'InProgress').length,
      approved: this.requests.filter((r) => r.status === 'Approved').length,
      rejected: this.requests.filter((r) => r.status === 'Rejected').length,
    };
  }

  filterRequests(): void {
    let filtered = [...this.requests];

    // Apply status filter
    if (this.activeFilter && this.activeFilter !== 'All') {
      const statusMap: Record<string, string> = {
        'In Progress': 'InProgress',
        New: 'New',
        Approved: 'Approved',
        Rejected: 'Rejected',
      };
      filtered = filtered.filter(
        (r) => r.status === (statusMap[this.activeFilter] || this.activeFilter),
      );
    }

    // Apply search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.applicationId.toLowerCase().includes(term) ||
          r.companyName.toLowerCase().includes(term) ||
          r.category.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term),
      );
    }

    this.filteredRequests = filtered;
    this.currentPage = 1;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Event Handlers
  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterRequests();
  }

  onFilterClick(filter: string): void {
    this.activeFilter = filter;
    this.filterRequests();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'New';
    this.filterRequests();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(event: Event): void {
    this.itemsPerPage = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
  }

  handleRowClick(item: SupplierRequestItem): void {
    this.router.navigate([item.applicationId], { relativeTo: this.route });
  }

  toggleMenu(item: SupplierRequestItem): void {
    this.activeMenu = this.activeMenu === item.applicationId ? null : item.applicationId;
  }

  handleAction(event: { action: string; item: SupplierRequestItem }): void {
    this.activeMenu = null;

    switch (event.action) {
      case 'view':
        this.viewRequest(event.item);
        break;
      case 'edit':
        this.editRequest(event.item);
        break;
      case 'delete':
        this.deleteRequest(event.item);
        break;
      case 'approve':
        this.approveRequest(event.item);
        break;
      case 'reject':
        this.rejectRequest(event.item);
        break;
    }
  }

  // CRUD Operations
  createNewApplication(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  viewRequest(item: SupplierRequestItem): void {
    this.router.navigate([item.applicationId], { relativeTo: this.route });
  }

  editRequest(item: SupplierRequestItem): void {
    this.router.navigate([item.applicationId, 'edit'], { relativeTo: this.route });
  }

  deleteRequest(item: SupplierRequestItem): void {
    if (confirm(`Delete request ${item.applicationId}?`)) {
      const index = this.requests.findIndex((r) => r.applicationId === item.applicationId);
      if (index > -1) {
        this.requests.splice(index, 1);
        this.updateStats();
        this.filterRequests();
      }
    }
  }

  approveRequest(item: SupplierRequestItem): void {
    const request = this.requests.find((r) => r.applicationId === item.applicationId);
    if (request) {
      request.status = 'Approved';
      this.updateStats();
      this.filterRequests();
    }
  }

  rejectRequest(item: SupplierRequestItem): void {
    const request = this.requests.find((r) => r.applicationId === item.applicationId);
    if (request) {
      request.status = 'Rejected';
      this.updateStats();
      this.filterRequests();
    }
  }

  // Quick Actions
  reviewPendingApplications(): void {
    this.activeFilter = 'In Progress';
    this.filterRequests();
  }

  viewApplicationReports(): void {
    this.router.navigate(['reports'], { relativeTo: this.route });
  }

  viewAllVendors(): void {
    this.router.navigate(['vendors'], { relativeTo: this.route });
  }

  viewVendorCategorySummary(): void {
    this.router.navigate(['vendor-summary'], { relativeTo: this.route });
  }

  // Helper Methods
  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      New: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#FF6B35]/10 text-[#FF6B35]',
      InProgress: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800',
      Approved: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800',
      Rejected: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800',
    };
    return (
      classes[status] || 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800'
    );
  }

  getCategoryBadgeClass(category: string): string {
    if (category.includes('IT'))
      return 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800';
    if (category.includes('Construction'))
      return 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800';
    if (category.includes('Heavy'))
      return 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
    return 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800';
  }

  getFilterButtonClass(filter: string): string {
    const isActive = this.activeFilter === filter;
    return `px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
      isActive ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  }

  formatDate(date: Date): string {
    return date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase();
  }
  //  series: ApexAxisChartSeries = [
  //     {
  //       name: "Sales",
  //       data: [10, 41, 35, 51, 49, 62]
  //     }
  //   ];

  chart: ApexChart = {
    type: 'area',
    height: 300,
    toolbar: { show: false },
  };

  stroke: ApexStroke = {
    curve: 'straight',
    width: 3,
  };

  dataLabels: ApexDataLabels = {
    enabled: false,
  };

  chartOptions = {
    series: [
      {
        name: 'Monthly Spend (SAR)',
        data: [580, 1400, 900, 2100, 1600, 2000, 1900, 2200, 2100, 2800, 2400],
      },
    ],

    markers: {
      size: 5,
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },

    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },

    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    },

    colors: ['#c94b4b'],
  };

  barChart: ApexChart = {
    type: 'bar',
    height: 250,
    stacked: true,
    toolbar: { show: false },
  };

  barChartOptions = {
    series: [
      {
        name: 'Completed',
        data: [0, 0, 13, 0, 20, 0, 25, 20],
      },
      {
        name: 'Processing',
        data: [0, 0, 0, 0, 10, 20, 25, 40],
      },
      {
        name: 'Pending',
        data: [10, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Cancelled',
        data: [0, 11, 0, 12, 0, 36, 0, 0],
      },
    ],

    chart: {
      type: 'bar',
      height: 250,
      stacked: true,
      toolbar: { show: false },
    },

    plotOptions: {
      bar: {
        columnWidth: '75%',
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: { show: false },
    },

    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },

    colors: [
      '#940000', // dark red
      '#ce2e2e', // red
      '#9ca3af', // gray
      '#e5e7eb', // light gray
    ],
  };

  // Chart 1: Donut Chart (Payment Status)
  paymentStatusSeries = [5, 2]; // Paid: 5, Pending: 2
  paymentStatusLabels = ['Paid', 'Pending'];
  paymentStatusColors = ['#940000', '#ce2e2e']; // emerald-500, amber-500

  // Chart 2: Pie Chart (Orders by Category)
  orderCategorySeries = [44, 33, 23]; // Example: 44% Metal, 33% Plastic, 23% Electronic
  orderCategoryLabels = ['Metal', 'Plastic', 'Electronic'];
  orderCategoryColors = ['#940000', '#ce2e2e', '#9ca3af']; // gray-500, emerald-500, red-500

  // Shared chart configurations
  paymentStatusChart: ApexChart = {
    type: 'donut',
    height: 220,
    toolbar: { show: false },
  };

  orderCategoryChart: ApexChart = {
    type: 'pie',
    height: 220,
    toolbar: { show: false },
  };

  donutOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: { show: true, label: 'Total', fontSize: '12px' },
        },
      },
    },
  };

  pieOptions = {};

  chartResponsive = [
    {
      breakpoint: 480,
      options: {
        chart: { height: 180 },
        legend: { position: 'bottom' },
      },
    },
  ];

  // Subtle border option - barely visible white border
  chartStroke = {
    show: true,
    width: 3, // Width of 3px
    colors: ['#F2940000'], // Fully transparent
  };
}
