import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '@features/products/services/product.service';
import { SectionComponent } from '@core/layout/section.component';
import { Product } from '@features/products/models/entity/product.entity';

@Component({
  selector: 'app-product-grid.component',
  templateUrl: './product-grid.component.html',
  imports: [SectionComponent, RouterLink],
})
export class ProductGridComponent implements OnInit {
  constructor(private readonly productService: ProductService) {}

  dataGrid = signal<Product[]>([]);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.productService
      .search({ skip: 1, take: 30 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        console.log({ response });
        this.dataGrid.set(response.data.items);
      });
  }
}
