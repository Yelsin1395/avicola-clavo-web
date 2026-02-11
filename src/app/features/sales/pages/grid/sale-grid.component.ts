import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { ErrorResponse } from '@core/models/errorResponse.model';
import { PAYMENT_STATUS_CONFIG } from '@features/orders/models/interfaces/paymentStatus.interface';
import { PrinterService } from '@features/printer/services/printer.service';
import { Sale } from '@features/sales/models/entity/sale.entity';
import { SearchSaleRequest } from '@features/sales/models/in/sale.in';
import { RangeDaysEnum } from '@features/sales/models/interfaces/rangeDays.interface';
import { SALE_STATUS_CONFIG } from '@features/sales/models/interfaces/saleStatus.interface';
import { SaleService } from '@features/sales/services/sale.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssPrinter } from '@ng-icons/css.gg';
import { HotToastService } from '@ngxpert/hot-toast';
import { getErrorDescription } from '@shared/utils/catalogException.utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sale-grid.component',
  templateUrl: './sale-grid.component.html',
  imports: [SectionComponent, RouterLink, NgIcon, DatePipe],
  viewProviders: [provideIcons({ cssPrinter })],
})
export class SaleGridComponent {
  private readonly saleService = inject(SaleService);
  private readonly printerService = inject(PrinterService);
  private readonly destroyRef = inject(DestroyRef);

  private toast = inject(HotToastService);

  dataGrid = signal<Sale[]>([]);
  isLoading = signal(false);
  totalItems = signal(0);
  totalPages = signal(0);

  currentPage = signal(1);
  pageSize = signal(30);

  selectedSale = signal<Sale | null>(null);

  isLoadingPrinter = signal<boolean>(false);

  currentRangeDays = signal<RangeDaysEnum>(RangeDaysEnum.TODAY);
  configSaleStatus = SALE_STATUS_CONFIG;
  configStatusPayment = PAYMENT_STATUS_CONFIG;

  public RangeDays = RangeDaysEnum;

  constructor() {
    effect(() => {
      this.loadGrid();
    });
  }

  loadGrid(): void {
    this.isLoading.set(true);

    const filter: SearchSaleRequest = {
      rangeDays: this.currentRangeDays(),
      skip: this.currentPage(),
      take: this.pageSize(),
    };

    this.saleService
      .search(filter)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.dataGrid.set(response.data.items);
          this.totalItems.set(response.data.count);
          this.totalPages.set(response.data.totalPages);
        },
        error: () => {
          this.dataGrid.set([]);
        },
      });
  }

  changeTabRangeDays(rangeDays: RangeDaysEnum): void {
    this.currentRangeDays.set(rangeDays);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openModalSaleDetails(sale: Sale): void {
    this.selectedSale.set(sale);
    const modal = document.getElementById('sale_details_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeModal(): void {
    const modal = document.getElementById('sale_details_modal') as HTMLDialogElement;
    if (modal) modal.close();
    this.selectedSale.set(null);
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
