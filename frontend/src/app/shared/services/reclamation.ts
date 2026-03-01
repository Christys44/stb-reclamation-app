import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  getAll(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.statut) params = params.set('statut', filters.statut);
    if (filters?.priorite) params = params.set('priorite', filters.priorite);
    if (filters?.categorie) params = params.set('categorie', filters.categorie);
    return this.http.get<any[]>(`${this.apiUrl}/reclamations`, {
      headers: this.getHeaders(), params
    });
  }

  getMesReclamations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reclamations/mes-reclamations`, {
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reclamations/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reclamations`, data, {
      headers: this.getHeaders()
    });
  }

  updateStatut(id: number, statut: string, commentaire: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reclamations/${id}/statut`, { statut, commentaire }, {
      headers: this.getHeaders()
    });
  }

  assign(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reclamations/${id}/assign`, {}, {
      headers: this.getHeaders()
    });
  }

  getHistorique(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historique/${id}`, {
      headers: this.getHeaders()
    });
  }
}