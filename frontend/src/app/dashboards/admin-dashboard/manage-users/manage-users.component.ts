import { Component } from '@angular/core';
import { UserService, User } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  filter: 'all' | 'pending' | 'active' = 'all';
  users: User[] = [];
  currentPage = 1;
  perPageOptions = [5, 10, 20, 50];
  searchQuery = '';
  private searchSubject = new Subject<string>();
  loading = false;

  constructor(private userService: UserService, private toast: ToastService) { }

  ngOnInit(): void {
    const saved = localStorage.getItem('usersPerPage');
    if (saved) this.usersPerPage = +saved;
    this.fetchUsers();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1;
    });
  }

  set usersPerPage(value: number) {
    this._usersPerPage = value;
    localStorage.setItem('usersPerPage', value.toString());
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }
  get usersPerPage(): number {
    return this._usersPerPage;
  }
  private _usersPerPage = 5;

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.usersPerPage) || 1;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.usersPerPage;
    const end = start + this.usersPerPage;
    return this.filteredUsers.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  fetchUsers(): void {
    this.loading = true;
    const token = localStorage.getItem('token') || '';
    this.userService.getAllUsers(token).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toast.show('Failed to fetch users', 'error');
        console.error('Fetch error:', err);
      }
    });
  }

  setFilter(value: 'all' | 'pending' | 'active') {
    this.filter = value;
    this.currentPage = 1;
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  get filteredUsers(): User[] {
    const filterValue = this.filter.toUpperCase();
    const query = this.searchQuery.toLowerCase();
    return this.users.filter(user =>
      (this.filter === 'all' || user.status.toUpperCase() === filterValue) &&
      (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
    );
  }

  approve(user: User): void {
    this.userService.approveUser(user.id).subscribe({
      next: () => {
        this.toast.show('User approved', 'success');
        this.fetchUsers();
      },
      error: err => {
        this.toast.show('Failed to approve user', 'error');
        console.error(err);
      }
    });
  }

  reject(user: User): void {
    this.userService.rejectUser(user.id).subscribe({
      next: () => {
        this.toast.show('User rejected', 'success');
        this.fetchUsers();
      },
      error: err => {
        this.toast.show('Failed to reject user', 'error');
        console.error(err);
      }
    });
  }

  suspend(user: User): void {
    this.userService.suspendUser(user.id).subscribe({
      next: () => {
        this.toast.show('User suspended', 'success');
        this.fetchUsers();
      },
      error: err => {
        this.toast.show('Failed to suspend user', 'error');
        console.error(err);
      }
    });
  }

  unsuspend(user: User): void {
    this.userService.unsuspendUser(user.id).subscribe({
      next: () => {
        this.toast.show('User unsuspended', 'success');
        this.fetchUsers();
      },
      error: err => {
        this.toast.show('Failed to unsuspend user', 'error');
        console.error(err);
      }
    });
  }
}
