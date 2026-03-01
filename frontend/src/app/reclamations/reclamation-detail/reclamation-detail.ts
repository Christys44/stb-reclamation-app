import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../shared/services/reclamation';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-reclamation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamation-detail.html',
  styleUrl: './reclamation-detail.sass'
})
export class ReclamationDetail implements OnInit {
  reclamation: any = null;
  historique: any[] = [];
  role = '';
  loading = true;
  nouveauStatut = '';
  commentaire = '';
  errorMessage = '';
  successMessage = '';

  statuts = ['nouvelle', 'en_cours', 'en_attente', 'resolue', 'cloturee'];

  constructor(
    private route: ActivatedRoute,
    private reclamationService: ReclamationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole() || '';
    console.log('Role détecté:', this.role);
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID récupéré:', id);
    if (id) {
      this.loadReclamation(+id);
      this.loadHistorique(+id);
    }
  }

  loadReclamation(id: number) {
    console.log('Chargement réclamation ID:', id);
    this.loading = true;
    this.reclamationService.getById(id).subscribe({
      next: (data) => {
        console.log('Réclamation reçue:', data);
        this.reclamation = data;
        this.nouveauStatut = data.statut;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading après:', this.loading);
        console.log('Reclamation après:', this.reclamation);
      },
      error: (err) => {
        console.log('Erreur détail:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadHistorique(id: number) {
    console.log('Chargement historique ID:', id);
    this.reclamationService.getHistorique(id).subscribe({
      next: (data) => {
        console.log('Historique reçu:', data);
        this.historique = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log('Erreur historique:', err)
    });
  }

  updateStatut() {
    if (!this.nouveauStatut) return;
    this.reclamationService.updateStatut(
      this.reclamation.id,
      this.nouveauStatut,
      this.commentaire
    ).subscribe({
      next: () => {
        this.successMessage = 'Statut mis à jour avec succès !';
        this.loadReclamation(this.reclamation.id);
        this.loadHistorique(this.reclamation.id);
        this.commentaire = '';
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour';
        this.cdr.detectChanges();
      }
    });
  }

  assignerReclamation() {
    this.reclamationService.assign(this.reclamation.id).subscribe({
      next: () => {
        this.successMessage = 'Réclamation prise en charge !';
        this.loadReclamation(this.reclamation.id);
        this.loadHistorique(this.reclamation.id);
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la prise en charge';
        this.cdr.detectChanges();
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