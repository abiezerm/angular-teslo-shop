import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { AuthResponse, User } from "../types";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, map, Observable, of, tap } from "rxjs";

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

@Injectable({providedIn: "root"})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = environment.baseUrl;
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private handleAuthSuccess(response: AuthResponse): true {
    this._user.set(response.user);
    this._token.set(response.token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', response.token);
    return true;
  }

  private handleAuthError(error : any): Observable<boolean> {
    this.logout();
    return of(false);
  }


  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if( this._user() ) {
      return 'authenticated';
    }

    return 'unauthenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  })

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password })
    .pipe(
      map( response => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error))
    );
  }


  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${this.baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    })
    .pipe(
      map( response => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('unauthenticated');

    // TODO: revert
    //localStorage.removeItem('token');
  }
}
