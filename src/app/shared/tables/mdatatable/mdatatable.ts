import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'currency' | 'status' | 'action';
  format?: string;
  actionTemplate?: (item: any) => string;
  statusColors?: { [key: string]: string };
}

export interface TableConfig {
  columns: TableColumn[];
  itemsPerPage?: number;
  showPagination?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  showActions?: boolean;
}

@Component({
  selector: 'app-mdatatable',
  imports: [CommonModule],
  templateUrl: './mdatatable.html',
  styleUrl: './mdatatable.css',
})
export class Mdatatable implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() config: TableConfig = {
    columns: [],
    itemsPerPage: 10,
    showPagination: true,
    showPageSize: true,
    pageSizeOptions: [5, 10, 25, 50],
    showSearch: true,
    searchPlaceholder: 'Search...',
    showActions: false
  };
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{action: string, item: any}>();

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  paginatedData: any[] = [];
  searchTerm: string = '';
  filteredData: any[] = [];

  ngOnInit() {
    this.pageSize = this.config.itemsPerPage || 10;
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.filteredData = [...this.data];
      this.currentPage = 1;
      this.updatePagination();
    }
    
    if (changes['config']) {
      this.pageSize = this.config.itemsPerPage || 10;
      this.updatePagination();
    }
  }

  updatePagination() {
    // Apply search filter
    if (this.searchTerm) {
      this.filteredData = this.data.filter(item => {
        return this.config.columns.some(column => {
          const value = this.getNestedValue(item, column.field);
          return value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
        });
      });
    } else {
      this.filteredData = [...this.data];
    }

    // Calculate pagination
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    // Get current page data
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  formatValue(item: any, column: TableColumn): any {
    const value = this.getNestedValue(item, column.field);
    
    if (value === null || value === undefined) return '-';

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'SAR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      
      case 'date':
        const date = new Date(value);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      
      case 'status':
        const statusClass = column.statusColors?.[value] || 'bg-gray-100 text-gray-800';
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${value}</span>`;
      
      case 'action':
        return column.actionTemplate ? column.actionTemplate(item) : value;
      
      default:
        return value;
    }
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.updatePagination();
    this.pageSizeChange.emit(this.pageSize);
  }

  onRowClick(item: any) {
    this.rowClick.emit(item);
  }

  onActionClick(action: string, item: any, event: Event) {
    event.stopPropagation();
    this.actionClick.emit({ action, item });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
  }
}