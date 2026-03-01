import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../shared/services/reclamation';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamation-list.html',
  styleUrl: './reclamation-list.sass'
})
export class ReclamationList implements OnInit {
  reclamations: any[] = [];
  reclamationsFiltrees: any[] = [];
  role = '';
  loading = true;

  filtreStatut = '';
  filtrePriorite = '';
  filtreCategorie = '';
  filtreRecherche = '';

  statuts = ['', 'nouvelle', 'en_cours', 'en_attente', 'resolue', 'cloturee'];
  priorites = ['', 'basse', 'moyenne', 'haute', 'critique'];
  categories = ['', 'Réseau', 'Matériel', 'Logiciel', 'Messagerie', 'Sécurité', 'Autre'];

  // Pagination
  pageCourante = 1;
  elementsParPage = 5;

  constructor(
    private reclamationService: ReclamationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole() || '';
    this.loadReclamations();
  }

  loadReclamations() {
    this.loading = true;
    const obs = this.role === 'personnel_stb'
      ? this.reclamationService.getMesReclamations()
      : this.reclamationService.getAll();

    obs.subscribe({
      next: (data) => {
        this.reclamations = data;
        this.appliquerFiltres();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Erreur:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  appliquerFiltres() {
    this.pageCourante = 1;
    this.reclamationsFiltrees = [...this.reclamations.filter(r => {
      const matchStatut = this.filtreStatut ? r.statut === this.filtreStatut : true;
      const matchPriorite = this.filtrePriorite ? r.priorite === this.filtrePriorite : true;
      const matchCategorie = this.filtreCategorie ? r.categorie === this.filtreCategorie : true;
      const matchRecherche = this.filtreRecherche
        ? r.titre.toLowerCase().includes(this.filtreRecherche.toLowerCase())
        : true;
      return matchStatut && matchPriorite && matchCategorie && matchRecherche;
    })];
    this.cdr.detectChanges();
  }

  reinitialiserFiltres() {
    this.filtreStatut = '';
    this.filtrePriorite = '';
    this.filtreCategorie = '';
    this.filtreRecherche = '';
    this.appliquerFiltres();
  }

  get reclamationsPaginees(): any[] {
    const debut = (this.pageCourante - 1) * this.elementsParPage;
    const fin = debut + this.elementsParPage;
    return this.reclamationsFiltrees.slice(debut, fin);
  }

  get totalPages(): number {
    return Math.ceil(this.reclamationsFiltrees.length / this.elementsParPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changerPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageCourante = page;
      this.cdr.detectChanges();
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
  }
}