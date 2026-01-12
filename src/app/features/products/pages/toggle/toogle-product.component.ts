import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SectionComponent } from '@core/layout/section.component';
import { ErrorResponse } from '@core/models/errorResponse.model';
import { CreateProductForm, CreateProductRequest } from '@features/products/models/in/product.in';
import { ProductService } from '@features/products/services/product.service';

@Component({
  selector: 'app-toogle-product.component',
  templateUrl: './toogle-product.component.html',
  imports: [SectionComponent, FormsModule, ReactiveFormsModule],
})
export class ToogleProductComponent {
  createProductForm: FormGroup<CreateProductForm>;
  destroyRef = inject(DestroyRef);

  constructor(private readonly productService: ProductService) {
    this.createProductForm = new FormGroup<CreateProductForm>({
      name: new FormControl('', { nonNullable: true }),
      type: new FormControl('default', { nonNullable: true }),
      brandOrProvider: new FormControl('', { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      currencyCode: new FormControl('default', { nonNullable: true }),
      basePrice: new FormControl(0, { nonNullable: true }),
    });
  }

  submitForm(): void {
    const entry = this.createProductForm.value;

    const payload = {
      ...entry,
      currencySymbol: 'S/',
    } as CreateProductRequest;

    console.log(payload);
    this.productService
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => console.log(value),
        error: (error: ErrorResponse) => console.error(error),
      });
  }
}
