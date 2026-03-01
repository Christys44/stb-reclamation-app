import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReclamationService } from '../../shared/services/reclamation';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.sass'
})
export class Dashboard implements OnInit {
  reclamations: any[] = [];
  stats = { total: 0, nouvelles: 0, en_cours: 0, resolues: 0 };
  role = '';
  loading = true;

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
        this.stats.total = data.length;
        this.stats.nouvelles = data.filter((r: any) => r.statut === 'nouvelle').length;
        this.stats.en_cours = data.filter((r: any) => r.statut === 'en_cours').length;
        this.stats.resolues = data.filter((r: any) => r.statut === 'resolue').length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Erreur dashboard:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}