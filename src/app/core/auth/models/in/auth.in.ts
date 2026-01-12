import { FormControl } from '@angular/forms';

export interface Auth {
  token: string;
}

export interface LoginForm {
  dni: FormControl<string>;
  password: FormControl<string>;
}

export interface LoginRequest {
  dni: string;
  password: string;
}
