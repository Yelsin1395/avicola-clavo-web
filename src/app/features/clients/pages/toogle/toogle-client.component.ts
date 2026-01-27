import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectionComponent } from '@core/layout/section.component';
import { ErrorResponse } from '@core/models/errorResponse.model';
import { CreateClientForm, CreateClientRequest } from '@features/clients/models/in/client.in';
import { ClientService } from '@features/clients/services/client.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toogle-client.component',
  templateUrl: './toogle-client.component.html',
  imports: [SectionComponent, FormsModule, ReactiveFormsModule, RouterLink],
})
export class ToogleClientComponent implements OnInit {
  clientId: string | null = null;
  isEditMode = false;
  createClientForm: FormGroup<CreateClientForm>;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly clientService: ClientService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.createClientForm = new FormGroup<CreateClientForm>({
      name: new FormControl('', { nonNullable: true }),
      surname: new FormControl('', { nonNullable: true }),
      label: new FormControl('', { nonNullable: false }),
    });
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');

    if (this.clientId) {
      this.isEditMode = true;
      this.loadClient();
    }
  }

  loadClient(): void {
    this.clientService
      .getById(this.clientId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.createClientForm.patchValue(value.data);
      });
  }

  submitForm(): void {
    if (this.createClientForm.invalid) return;

    const entry = this.createClientForm.getRawValue();

    const payload = {
      name: entry.name,
      surname: entry.surname,
      label: entry.label,
    } as CreateClientRequest;

    const request$: Observable<any> = this.isEditMode
      ? this.clientService.update(this.clientId!, payload)
      : this.clientService.create(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(['/console/clients']),
      error: (error: ErrorResponse) => console.error(error),
    });
  }
}
