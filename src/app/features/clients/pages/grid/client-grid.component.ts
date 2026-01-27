import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { Client } from '@features/clients/models/entity/client.entity';
import { SearchClientRequest } from '@features/clients/models/in/client.in';
import { CONFIG_STATUS_PAYMENT } from '@features/clients/models/interfaces/paymentStatusClient.interface';
import { ClientService } from '@features/clients/services/client.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssTrash, cssPen } from '@ng-icons/css.gg';

@Component({
  selector: 'app-client-grid.component',
  templateUrl: './client-grid.component.html',
  imports: [SectionComponent, RouterLink, NgIcon],
  viewProviders: [provideIcons({ cssTrash, cssPen })],
})
export class ClientGridComponent {
  private readonly clientService = inject(ClientService);
  private readonly destroyRef = inject(DestroyRef);

  dataGrid = signal<Client[]>([]);
  totalItems = signal(0);
  totalPages = signal(0);

  searchFullName = signal('');
  currentPage = signal(1);
  pageSize = signal(30);

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.dataGrid.set(response.data.items);
        this.totalItems.set(response.data.count);
        this.totalPages.set(response.data.totalPages);
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

  onDelete(id: string): void {
    this.clientService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const updatedData = this.dataGrid().filter((client) => client.id !== id);
        this.dataGrid.set(updatedData);
      });
  }
}
