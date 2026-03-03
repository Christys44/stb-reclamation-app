import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.sass'
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';

  email = '';
  mot_de_passe = '';

  nom = '';
  emailRegister = '';
  mot_de_passeRegister = '';
  mot_de_passeConfirm = '';

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  switchMode(mode: 'login' | 'register') {
    this.mode = mode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.email, this.mot_de_passe).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
        this.cdr.detectChanges();
      }
    });
  }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.nom || !this.emailRegister || !this.mot_de_passeRegister) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      this.cdr.detectChanges();
      return;
    }

    if (this.mot_de_passeRegister !== this.mot_de_passeConfirm) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.http.post(`${environment.apiUrl}/auth/register`, {
      nom: this.nom,
      email: this.emailRegister,
      mot_de_passe: this.mot_de_passeRegister
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Inscription réussie ! Votre compte est en attente de validation.';
        this.nom = '';
        this.emailRegister = '';
        this.mot_de_passeRegister = '';
        this.mot_de_passeConfirm = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription.';
        this.cdr.detectChanges();
      }
    });
  }
}