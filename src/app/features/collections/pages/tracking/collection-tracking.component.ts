import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { Collection } from '@features/collections/models/entity/collection.entity';
import { CollectionService } from '@features/collections/services/collection.service';
import { Order } from '@features/orders/models/entity/order.entity';
import { PaymentMethod } from '@features/orders/models/interfaces/paymentMethod.interface';
import {
  PAYMENT_STATUS_CONFIG,
  PaymentStatus,
} from '@features/orders/models/interfaces/paymentStatus.interface';
import { OrderService } from '@features/orders/services/order.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssCreditCard } from '@ng-icons/css.gg';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-collection-tracking.component',
  templateUrl: './collection-tracking.component.html',
  imports: [SectionComponent, RouterLink, ReactiveFormsModule, NgIcon, DatePipe],
  viewProviders: [provideIcons({ cssCreditCard })],
})
export class CollectionTrackingComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  clientId = signal<string | null>(null);
  currentOrderId = signal<string | null>(null);

  dataGrid = signal<Order[]>([]);
  isLoading = signal(false);

  dataGridCollection = signal<Collection[]>([]);
  isLoadingCollectionModal = signal(false);

  isLoadinCollectionTracking = signal(false);

  currentOrderPaymentStatus = signal<PaymentStatus>(PaymentStatus.PENDING);

  configStatusPayment = PAYMENT_STATUS_CONFIG;

  private initialFormValues = {
    paymentType: '',
    paymentMethod: '',
    clientPaymentAmount: null,
  };

  public paymentForm: FormGroup = this.fb.group({
    paymentType: [this.initialFormValues.paymentType, Validators.required],
    paymentMethod: [this.initialFormValues.paymentMethod, Validators.required],
    clientPaymentAmount: [this.initialFormValues.clientPaymentAmount],
  });

  public PaymentStatus = PaymentStatus;
  public paymentMethods = Object.values(PaymentMethod);

  ngOnInit(): void {
    this.clientId.set(this.route.snapshot.paramMap.get('clientId'));
  }

  constructor() {
    effect(() => {
      this.loadGrid();
    });
  }

  get paymentType() {
    return this.paymentForm.get('paymentType');
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

  showTrackingModal(orderId: string): void {
    this.currentOrderId.set(orderId);
    this.paymentForm.reset(this.initialFormValues);
    const modal = document.getElementById('tracking_payment_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeTrackinModal(): void {
    this.currentOrderId.set(null);
    const modal = document.getElementById('tracking_payment_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  onSubmitPayment() {
    this.isLoadinCollectionTracking.set(true);

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const payload = this.paymentForm.value;

    const request$: Observable<any> =
      payload.paymentType === 'COMPLETE'
        ? this.collectionService.fullPayment({
            orderId: this.currentOrderId()!,
            paymentMethod: payload.paymentMethod,
          })
        : this.collectionService.paymentOnAccount({
            orderId: this.currentOrderId()!,
            paymentMethod: payload.paymentMethod,
            clientPaymentAmount: payload.clientPaymentAmount,
          });

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoadinCollectionTracking.set(false)),
      )
      .subscribe(() => this.closeTrackinModal());
  }
}
