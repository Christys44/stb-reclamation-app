import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.sass'
})
export class UserList implements OnInit {
  users: any[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';
  editingUser: any = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Erreur users:', err);
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  startEdit(user: any) {
    this.editingUser = { ...user };
  }

  cancelEdit() {
    this.editingUser = null;
  }

  saveEdit() {
    this.userService.update(this.editingUser.id, this.editingUser).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur mis à jour !';
        this.editingUser = null;
        this.loadUsers();
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

  toggleActif(user: any) {
    this.userService.update(user.id, { ...user, actif: !user.actif }).subscribe({
      next: () => {
        this.successMessage = user.actif ? 'Utilisateur désactivé' : 'Utilisateur activé';
        this.loadUsers();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la modification';
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