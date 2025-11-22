import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonList, IonItem, IonLabel, IonAvatar, IonSearchbar, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-start-chat',
  templateUrl: './start-chat.page.html',
  styleUrls: ['./start-chat.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonList, IonItem, IonLabel, IonAvatar, IonSearchbar, IonSpinner]
})
export class StartChatPage implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  currentUserId!: number;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id;
    this.loadUsers();
  }

  loadUsers() {
    // Simple fetch to get all users except current user
    fetch('http://127.0.0.1:8001/users/get_users.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.users = data.users.filter((user: User) => user.id !== this.currentUserId);
        this.filteredUsers = [...this.users];
      }
      this.loading = false;
    })
    .catch(() => {
      this.loading = false;
    });
  }

  filterUsers(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  startChat(user: User) {
    this.router.navigate(['/chat'], {
      queryParams: {
        userId: user.id,
        userName: user.name
      }
    });
  }

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}