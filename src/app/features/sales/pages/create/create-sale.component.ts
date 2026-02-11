import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { ErrorResponse } from '@core/models/errorResponse.model';
import { PaymentMethod } from '@features/orders/models/interfaces/paymentMethod.interface';
import { Product } from '@features/products/models/entity/product.entity';
import { ProductService } from '@features/products/services/product.service';
import { CreateSaleRequest, SaleItemRequest } from '@features/sales/models/in/sale.in';
import { SaleService } from '@features/sales/services/sale.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssTrash } from '@ng-icons/css.gg';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';

@Component({
  selector: 'app-create-sale.component',
  templateUrl: './create-sale.component.html',
  imports: [SectionComponent, FormsModule, ReactiveFormsModule, NgIcon, RouterLink],
  viewProviders: [provideIcons({ cssTrash })],
})
export class CreateSaleComponent {
  private readonly productService = inject(ProductService);
  private readonly saleService = inject(SaleService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  searchResults = signal<Product[]>([]);
  selectedItems = signal<SaleItemRequest[]>([]);
  isLoading = signal<boolean>(false);

  searchControl = new FormControl('');
  paymentMethodControl = new FormControl('');
  isLoadingCreateSale = signal<boolean>(false);

  paymentMethodsList = Object.values(PaymentMethod);

  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  constructor() {
    effect(() => {
      const term = this.searchTerm();

      if (term) {
        this.performSearch(term);
      } else if (!term) {
        this.searchResults.set([]);
      }
    });
  }

  totalPriceItems = computed(() => {
    const total = this.selectedItems().reduce((acc, item) => acc + (item.subTotal || 0), 0);
    return Math.round(total * 100) / 100;
  });

  performSearch(term: string): void {
    this.isLoading.set(true);

    this.productService
      .search({
        name: term,
        skip: 1,
        take: 5,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.searchResults.set(res.data.items);
          this.isLoading.set(false);
        },
        error: () => {
          this.searchResults.set([]);
          this.isLoading.set(false);
        },
      });
  }

  addItem(item: Product) {
    const existingItem = this.selectedItems().find((i) => i.productId === item.id);

    if (!existingItem) {
      const saleItem = {
        productId: item.id,
        productName: item.name,
        productUnitsMeasurementCode: item.unitsMeasurementCode,
        productUnitsMeasurementName: item.unitsMeasurementName,
        priceAtPurchase: item.price,
        quantity: 1,
        subTotal: Math.round(item.price * 100) / 100,
      } as SaleItemRequest;

      this.selectedItems.update((items) => [...items, saleItem]);
    }

    this.searchControl.setValue('');
    this.searchResults.set([]);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;

    this.selectedItems.update((items) =>
      items.map((item) => {
        if (item.productId === productId) {
          const newSubTotal = item.priceAtPurchase * quantity;
          return { ...item, quantity, subTotal: Math.round(newSubTotal * 100) / 100 };
        }
        return item;
      }),
    );
  }

  removeItem(id: string) {
    this.selectedItems.update((items) => items.filter((i) => i.productId !== id));
  }

  submitForm(): void {
    this.isLoadingCreateSale.set(true);

    const payload = {
      paymentMethod: this.paymentMethodControl.value || null,
      items: this.selectedItems(),
      totalAmount: this.totalPriceItems(),
    } as CreateSaleRequest;

    this.saleService
      .create(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoadingCreateSale.set(false)),
      )
      .subscribe({
        next: () => void this.router.navigate(['/console/sales']),
        error: (error: ErrorResponse) => console.error(error),
      });
  }
}
