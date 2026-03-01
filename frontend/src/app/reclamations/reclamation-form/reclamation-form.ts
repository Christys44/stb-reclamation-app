import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../shared/services/reclamation';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-reclamation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamation-form.html',
  styleUrl: './reclamation-form.sass'
})
export class ReclamationForm {
  titre = '';
  description = '';
  categorie = '';
  priorite = 'moyenne';
  errorMessage = '';
  loading = false;

  categories = ['Réseau', 'Matériel', 'Logiciel', 'Messagerie', 'Sécurité', 'Autre'];
  priorites = ['basse', 'moyenne', 'haute', 'critique'];

  constructor(
    private reclamationService: ReclamationService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.titre || !this.description || !this.categorie) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }
    this.loading = true;
    this.reclamationService.create({
      titre: this.titre,
      description: this.description,
      categorie: this.categorie,
      priorite: this.priorite
    }).subscribe({
      next: () => this.router.navigate(['/reclamations']),
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la création';
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
  }
}