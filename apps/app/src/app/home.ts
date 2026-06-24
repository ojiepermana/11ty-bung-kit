import { Component, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  private readonly api = inject(ApiService);

  /** Backend health, probed once on load. */
  readonly health = signal<string>('checking…');
  /** Latest greeting fetched from /api/hello. */
  readonly message = signal<string | null>(null);
  readonly loading = signal(false);

  constructor() {
    this.api.health().subscribe({
      next: (r) => this.health.set(r.status),
      error: () => this.health.set('unreachable'),
    });
  }

  greet(): void {
    this.loading.set(true);
    this.api.hello().subscribe({
      next: (r) => {
        this.message.set(r.message);
        this.loading.set(false);
      },
      error: () => {
        this.message.set('Failed to reach the API.');
        this.loading.set(false);
      },
    });
  }
}
