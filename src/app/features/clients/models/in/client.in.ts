import { FormControl } from '@angular/forms';

export interface SearchClientRequest {
  fullName?: string;
  take: number;
  skip: number;
}

export interface FindClientRequest {
  id: string;
}

export interface CreateClientRequest {
  name: string;
  surname: string;
  label?: string;
}

export interface CreateClientForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  label?: FormControl<string | null>;
}
