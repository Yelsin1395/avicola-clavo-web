import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SectionComponent } from '@core/layout/section.component';
import { ErrorResponse } from '@core/models/errorResponse.model';
import { SearchOrderRequest } from '@features/orders/models/in/order.in';
import {
  ORDER_STATUS_CONFIG,
  OrderStatus,
} from '@features/orders/models/interfaces/orderStatus.interface';
import { PAYMENT_STATUS_CONFIG } from '@features/orders/models/interfaces/paymentStatus.interface';
import { OrderItems } from '@features/orders/models/out/order.out';
import { OrderService } from '@features/orders/services/order.service';
import { PrinterService } from '@features/printer/services/printer.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssPrinter } from '@ng-icons/css.gg';
import { HotToastService } from '@ngxpert/hot-toast';
import { getErrorDescription } from '@shared/utils/catalogException.utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-order-grid.component',
  imports: [SectionComponent, NgIcon, DatePipe],
  templateUrl: './order-grid.component.html',
  viewProviders: [provideIcons({ cssPrinter })],
})
export class OrderGridComponent {
  private readonly orderService = inject(OrderService);
  private readonly printerService = inject(PrinterService);
  private readonly destroyRef = inject(DestroyRef);

  private toast = inject(HotToastService);

  dataGrid = signal<OrderItems[]>([]);
  isLoading = signal(false);
  loadingOrderId = signal<string | null>(null);
  totalItems = signal(0);
  totalPages = signal(0);

  currentPage = signal(1);
  pageSize = signal(30);

  currentStatus = signal<OrderStatus>(OrderStatus.PENDING);
  selectedOrder = signal<OrderItems | null>(null);

  isLoadingPrinter = signal<boolean>(false);

  configStatusOrder = ORDER_STATUS_CONFIG;
  configStatusPayment = PAYMENT_STATUS_CONFIG;

  public OrderStatus = OrderStatus;

  constructor() {
    effect(() => {
      this.loadOrders();
    });
  }

  loadOrders(): void {
    this.isLoading.set(true);

    const filters: SearchOrderRequest = {
      skip: this.currentPage(),
      take: this.pageSize(),
      status: this.currentStatus(),
    };

    this.orderService
      .search(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.dataGrid.set(response.data.items);
          this.totalItems.set(response.data.count);
          this.totalPages.set(response.data.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.dataGrid.set([]);
        },
      });
  }

  changeTabStatus(status: OrderStatus): void {
    this.currentStatus.set(status);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openOrderDetails(order: OrderItems): void {
    this.selectedOrder.set(order);
    const modal = document.getElementById('order_details_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeModal(): void {
    const modal = document.getElementById('order_details_modal') as HTMLDialogElement;
    if (modal) modal.close();
    this.selectedOrder.set(null);
  }

  changeStatusOrder(id: string, status: OrderStatus): void {
    this.loadingOrderId.set(id);

    this.orderService
      .updateStatus(id, status)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingOrderId.set(null)),
      )
      .subscribe(() => {
        const updatedData = this.dataGrid().filter((order) => order.id !== id);
        this.dataGrid.set(updatedData);

        if (status === OrderStatus.CANCELLED) {
          this.closeModal();
        }

        this.isLoading.set(false);
      });
  }

  isOrderLoading(orderId: string): boolean {
    return this.loadingOrderId() === orderId;
  }

  onPrinter(orderId: string): void {
    this.isLoadingPrinter.set(true);

    this.printerService
      .generateTicketOrder(orderId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoadingPrinter.set(false)),
      )
      .subscribe({
        next: (value) => {
          console.log({ value });
        },
        error: (error: ErrorResponse) => {
          this.toast.error(getErrorDescription(error?.errorCode));
        },
      });
  }
}
