import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.sass'
})
export class LoginComponent {
  email = '';
  mot_de_passe = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
  this.loading = true;
  this.errorMessage = '';
  this.authService.login(this.email, this.mot_de_passe).subscribe({
    next: (res) => {
      this.loading = false;
      this.router.navigate(['/dashboard']);
    },
    error: () => {
      this.loading = false;
      this.errorMessage = 'Email ou mot de passe incorrect';
    }
  });
}
}