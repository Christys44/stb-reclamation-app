import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromStorage(): any {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return token && user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  login(email: string, mot_de_passe: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, mot_de_passe }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify({
          email,
          role: res.role,
          nom: res.nom
        }));
        this.currentUserSubject.next({ email, role: res.role });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const user = this.getUserFromStorage();
    return user ? user.role : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}