import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthDecode } from '../models/out/auth.out';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  getContentToken(): AuthDecode {
    return jwtDecode<AuthDecode>(this.getToken());
  }

  saveToken(token: string): void {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken(): void {
    window.localStorage.removeItem('jwtToken');
  }
}
