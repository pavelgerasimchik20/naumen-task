import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [
    { id: 1, name: 'Иван Петров', email: 'ivan@example.com', active: true },
    { id: 2, name: 'Мария Сидорова', email: 'maria@example.com', active: true },
    { id: 3, name: 'Алексей Иванов', email: 'alexey@example.com', active: false },
    { id: 4, name: 'Екатерина Смирнова', email: 'ekaterina@example.com', active: true },
    { id: 5, name: 'Дмитрий Кузнецов', email: 'dmitry@example.com', active: false },
    { id: 6, name: 'Ольга Васильева', email: 'olga@example.com', active: true },
    { id: 7, name: 'Сергей Попов', email: 'sergey@example.com', active: false },
    { id: 8, name: 'Анна Новикова', email: 'anna@example.com', active: true }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  filterUsers(searchTerm: string, statusFilter: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
                             (statusFilter === 'active' && user.active) ||
                             (statusFilter === 'inactive' && !user.active);
        return matchesSearch && matchesStatus;
      }))
    );
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
