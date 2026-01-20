import { Component, DestroyRef, inject, Input, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { SectionComponent } from '@core/layout/section.component';
import { ErrorResponse } from '@core/models/errorResponse.model';
import { CreateProductForm, CreateProductRequest } from '@features/products/models/in/product.in';
import { UnitsMeasurementMap } from '@features/products/models/interfaces/unitsMeasurement.interface';
import { ProductService } from '@features/products/services/product.service';

@Component({
  selector: 'app-toogle-product.component',
  templateUrl: './toogle-product.component.html',
  imports: [SectionComponent, FormsModule, ReactiveFormsModule, RouterLink],
})
export class ToogleProductComponent implements OnInit {
  productId: string | null = null;
  isEditMode = false;
  createProductForm: FormGroup<CreateProductForm>;
  destroyRef = inject(DestroyRef);
  unitsMeasurements = Object.entries(UnitsMeasurementMap).map(([name, code]) => ({ name, code }));

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.createProductForm = new FormGroup<CreateProductForm>({
      name: new FormControl('', { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      unitsMeasurementName: new FormControl('default', { nonNullable: true }),
      price: new FormControl(0, { nonNullable: true }),
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.productService
      .getById(this.productId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.createProductForm.patchValue(value.data);
      });
  }

  submitForm(): void {
    if (this.createProductForm.invalid) return;

    const entry = this.createProductForm.getRawValue();

    const payload = {
      ...entry,
      unitsMeasurementCode:
        UnitsMeasurementMap[entry.unitsMeasurementName as keyof typeof UnitsMeasurementMap],
    } as CreateProductRequest;

    const request$: Observable<any> = this.isEditMode
      ? this.productService.update(this.productId!, payload)
      : this.productService.create(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(['/console/products']),
      error: (error: ErrorResponse) => console.error(error),
    });
  }
}
