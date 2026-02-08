import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { Client } from '@features/clients/models/entity/client.entity';
import { SearchClientRequest } from '@features/clients/models/in/client.in';
import { CONFIG_STATUS_PAYMENT } from '@features/clients/models/interfaces/paymentStatusClient.interface';
import { ClientService } from '@features/clients/services/client.service';
import { Order } from '@features/orders/models/entity/order.entity';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssList, cssPen, cssEye } from '@ng-icons/css.gg';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-collection-grid.component',
  templateUrl: './collection-grid.component.html',
  imports: [SectionComponent, RouterLink, NgIcon, DatePipe],
  viewProviders: [provideIcons({ cssPen, cssList, cssEye })],
})
export class CollectionGridComponent {
  private readonly clientService = inject(ClientService);
  private readonly destroyRef = inject(DestroyRef);

  dataGrid = signal<Client[]>([]);
  isLoading = signal(true);
  totalItems = signal(0);
  totalPages = signal(0);

  searchFullName = signal('');
  currentPage = signal(1);
  pageSize = signal(30);

  clientNameHead = signal<string>('');
  dataGridOrders = signal<Order[]>([]);
  isLoadingModal = signal(false);

  configStatusPayment = CONFIG_STATUS_PAYMENT;

  constructor() {
    effect(() => {
      this.loadGrid();
    });
  }

  loadGrid(): void {
    const filters: SearchClientRequest = {
      skip: this.currentPage(),
      take: this.pageSize(),
      fullName: this.searchFullName(),
    };

    this.clientService
      .search(filters)
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
          this.isLoading.set(false);
        },
      });
  }

  onSearch(term: string): void {
    this.searchFullName.set(term);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onClear(inputElement: HTMLInputElement): void {
    inputElement.value = '';

    this.searchFullName.set('');
    this.currentPage.set(1);
  }
}
