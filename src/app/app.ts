import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { User, UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.less']
})
export class App {
  userService = inject(UserService)
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  selectedUser = signal<User | null>(null);

  filterForm = new FormGroup({
    search: new FormControl(''),
    status: new FormControl('all')
  });

  ngOnInit() {
    this.loadUsers();
    this.setupFilters();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
      this.applyFilters();
    });
  }

  private setupFilters() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private applyFilters() {
    const searchTerm = this.filterForm.get('search')?.value || '';
    const statusFilter = this.filterForm.get('status')?.value || 'all';

    const filtered = this.users().filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && user.active) ||
                           (statusFilter === 'inactive' && !user.active);
      return matchesSearch && matchesStatus;
    });

    this.filteredUsers.set(filtered);
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
  }

  getStatusText(active: boolean): string {
    return active ? 'Активный' : 'Неактивный';
  }

  getStatusClass(active: boolean): string {
    return active ? 'status-active' : 'status-inactive';
  }
}
