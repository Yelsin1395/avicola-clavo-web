import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { CreateOrderRequest, OrderItemRequest } from '@features/orders/models/in/order.in';
import { Product } from '@features/products/models/entity/product.entity';
import { ProductService } from '@features/products/services/product.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { cssTrash } from '@ng-icons/css.gg';
import { PaymentMethod } from '@features/orders/models/interfaces/paymentMethod.interface';
import { OrderService } from '@features/orders/services/order.service';
import { ErrorResponse } from '@core/models/errorResponse.model';

@Component({
  selector: 'app-create-order.component',
  templateUrl: './create-order.component.html',
  imports: [SectionComponent, NgIcon, FormsModule, ReactiveFormsModule, RouterLink],
  viewProviders: [provideIcons({ cssTrash })],
})
export class CreateOrderComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  clientId = signal<string | null>(null);
  searchResults = signal<Product[]>([]);
  selectedItems = signal<OrderItemRequest[]>([]);
  isLoading = signal<boolean>(false);

  searchControl = new FormControl('');
  isEarlyPayment = new FormControl(false, { nonNullable: true });
  paymentMethodControl = new FormControl('');

  paymentMethodsList = Object.values(PaymentMethod);

  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  constructor(private readonly orderService: OrderService) {
    effect(() => {
      const term = this.searchTerm();

      if (term) {
        this.performSearch(term);
      } else if (!term) {
        this.searchResults.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.clientId.set(this.route.snapshot.paramMap.get('id'));
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
      const orderItem = {
        productId: item.id,
        productName: item.name,
        productUnitsMeasurementCode: item.unitsMeasurementCode,
        productUnitsMeasurementName: item.unitsMeasurementName,
        priceAtPurchase: item.price,
        quantity: 1,
        subTotal: Math.round(item.price * 100) / 100,
      } as OrderItemRequest;

      this.selectedItems.update((items) => [...items, orderItem]);
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
    const payload = {
      clientId: this.clientId(),
      isPendingPayment: !this.isEarlyPayment.value,
      paymentMethod: this.paymentMethodControl.value || null,
      items: this.selectedItems(),
      totalAmount: this.totalPriceItems(),
    } as CreateOrderRequest;

    this.orderService
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/console/clients']),
        error: (error: ErrorResponse) => console.error(error),
      });
  }
}
