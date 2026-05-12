import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';

interface AdminStats {
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  total: number;
  newVendors: number;
  pendingEmails: number;
  approvalRate: string;
  pendingReview: number;
}

@Component({
  selector: 'app-buyer-dashboard.page',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './buyer-dashboard.page.html',
  styleUrl: './buyer-dashboard.page.css',
})
export class BuyerDashboardPage implements OnInit {
  private readonly http = inject(HttpClient);

  stats = signal<AdminStats | null>(null);

  ngOnInit() {
    this.http.get<{ success: boolean; stats: AdminStats }>('/admin/stats').subscribe({
      next: (res) => this.stats.set(res.stats),
      error: () => {},
    });
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

    colors: ['#1F7FB2'],
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
      '#145576',
      '#1F7FB2',
      '#4FA3D1', // soft accent blue instead of gray
      '#e5e7eb',
    ],
  };

  // Chart 1: Donut Chart (Payment Status)
  paymentStatusSeries = [5, 2]; // Paid: 5, Pending: 2
  paymentStatusLabels = ['Paid', 'Pending'];
  paymentStatusColors = ['#1F7FB2', '#145576']; // primary blue, dark blue

  // Chart 2: Pie Chart (Orders by Category)
  orderCategorySeries = [44, 33, 23]; // Example: 44% Metal, 33% Plastic, 23% Electronic
  orderCategoryLabels = ['Metal', 'Plastic', 'Electronic'];
  orderCategoryColors = ['#1F7FB2', '#145576', '#9ca3af']; // blue shades + gray

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
