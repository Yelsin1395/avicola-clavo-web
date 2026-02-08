import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { Collection } from '@features/collections/models/entity/collection.entity';
import { CollectionService } from '@features/collections/services/collection.service';
import { Order } from '@features/orders/models/entity/order.entity';
import {
  PAYMENT_STATUS_CONFIG,
  PaymentStatus,
} from '@features/orders/models/interfaces/paymentStatus.interface';
import { OrderService } from '@features/orders/services/order.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-collection-tracking.component',
  templateUrl: './collection-tracking.component.html',
  imports: [SectionComponent, RouterLink, DatePipe],
})
export class CollectionTrackingComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  clientId = signal<string | null>(null);

  dataGrid = signal<Order[]>([]);
  isLoading = signal(false);

  dataGridCollection = signal<Collection[]>([]);
  isLoadingCollectionModal = signal(false);

  currentOrderPaymentStatus = signal<PaymentStatus>(PaymentStatus.PENDING);

  configStatusPayment = PAYMENT_STATUS_CONFIG;

  public PaymentStatus = PaymentStatus;

  ngOnInit(): void {
    this.clientId.set(this.route.snapshot.paramMap.get('clientId'));
  }

  constructor() {
    effect(() => {
      this.loadGrid();
    });
  }

  loadGrid() {
    this.isLoading.set(true);

    this.orderService
      .findAllByClient(String(this.clientId()), this.currentOrderPaymentStatus())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe((response) => {
        this.dataGrid.set(response.data);
      });
  }

  changeTabPaymentStatus(paymentStatus: PaymentStatus) {
    this.currentOrderPaymentStatus.set(paymentStatus);
  }

  showModal(): void {
    const modal = document.getElementById('collection_details_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeModal(): void {
    const modal = document.getElementById('collection_details_modal') as HTMLDialogElement;
    if (modal) modal.close();
    this.dataGridCollection.set([]);
  }

  loadCollections(orderId: string) {
    this.isLoadingCollectionModal.set(true);
    this.showModal();

    this.collectionService
      .getPaymentOnAccountOrder(orderId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoadingCollectionModal.set(false);
        }),
      )
      .subscribe((response) => {
        this.dataGridCollection.set(response.data);
      });
  }
}
