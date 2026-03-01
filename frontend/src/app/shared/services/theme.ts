import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') !== 'light'
  );
  isDark$ = this.isDark.asObservable();

  toggleTheme(): void {
    const newValue = !this.isDark.value;
    this.isDark.next(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    document.body.classList.toggle('light-mode', !newValue);
  }

  initTheme(): void {
    const isLight = localStorage.getItem('theme') === 'light';
    this.isDark.next(!isLight);
    document.body.classList.toggle('light-mode', isLight);
  }
}