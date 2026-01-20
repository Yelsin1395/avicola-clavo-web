import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductService } from '@features/products/services/product.service';
import { SectionComponent } from '@core/layout/section.component';
import { Product } from '@features/products/models/entity/product.entity';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssTrash, cssPen } from '@ng-icons/css.gg';
import { SearchProductRequest } from '@features/products/models/in/product.in';

@Component({
  selector: 'app-product-grid.component',
  templateUrl: './product-grid.component.html',
  imports: [SectionComponent, RouterLink, NgIcon],
  viewProviders: [provideIcons({ cssTrash, cssPen })],
})
export class ProductGridComponent {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  dataGrid = signal<Product[]>([]);
  totalItems = signal(0);
  totalPages = signal(0);

  searchName = signal('');
  currentPage = signal(1);
  pageSize = signal(30);

  constructor() {
    effect(() => {
      this.loadProducts();
    });
  }

  loadProducts(): void {
    const filters: SearchProductRequest = {
      skip: this.currentPage(),
      take: this.pageSize(),
      name: this.searchName(),
    };

    this.productService
      .search(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.dataGrid.set(response.data.items);
        this.totalItems.set(response.data.count);
        this.totalPages.set(response.data.totalPages);
      });
  }

  onSearch(term: string): void {
    this.searchName.set(term);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onClear(inputElement: HTMLInputElement): void {
    inputElement.value = '';

    this.searchName.set('');
    this.currentPage.set(1);
  }

  onDeleteProduct(id: string): void {
    this.productService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const updatedData = this.dataGrid().filter((product) => product.id !== id);
        this.dataGrid.set(updatedData);
      });
  }
}
