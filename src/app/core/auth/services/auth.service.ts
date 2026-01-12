import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Auth, LoginRequest } from '../models/in/auth.in';
import { ReponseLogin } from '../models/out/auth.out';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentAuthSubject = new BehaviorSubject<Auth | null>(null);
  public currentAuth = this.currentAuthSubject.asObservable().pipe(distinctUntilChanged());
  public isAuthenticated = this.currentAuth.pipe(map((auth) => !!auth));

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router
  ) {}

  login(credentials: LoginRequest): Observable<ReponseLogin> {
    return this.http
      .get<ReponseLogin>(`/auth/user/${credentials.dni}/${credentials.password}`)
      .pipe(tap((response) => this.setAuth({ token: response.data.access_token })));
  }

  logout(): Promise<boolean> {
    this.purgeAuth();
    return this.router.navigate(['/']);
  }

  setAuth(auth: Auth): void {
    this.jwtService.saveToken(auth.token);
    this.currentAuthSubject.next(auth);
  }

  verifyAuth(): Observable<any> {
    const token = this.jwtService.getToken();

    return this.http.get(`/auth/verify/${token}`).pipe(
      tap({
        next: () => this.setAuth({ token }),
        error: () => this.logout(),
      }),
      shareReplay(1)
    );
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentAuthSubject.next(null);
  }
}
