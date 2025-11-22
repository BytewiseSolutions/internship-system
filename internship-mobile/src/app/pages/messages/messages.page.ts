import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonAvatar, IonNote, IonSearchbar, IonRefresher, IonRefresherContent, IonSpinner, IonButtons, IonButton, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { MessagingService, Conversation } from '../../services/messaging.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonAvatar, IonNote, IonSearchbar, IonRefresher, IonRefresherContent, IonSpinner, IonButtons, IonButton, IonIcon, IonBackButton]
})
export class MessagesPage implements OnInit {
  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  loading = true;

  constructor(
    private messagingService: MessagingService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ addOutline });
  }

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.messagingService.getConversations(user.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.conversations = response.conversations;
            this.filteredConversations = [...this.conversations];
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  openChat(conversation: Conversation) {
    this.router.navigate(['/chat'], {
      queryParams: {
        userId: conversation.other_user_id,
        userName: conversation.other_user_name
      }
    });
  }

  filterConversations(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredConversations = this.conversations.filter(conv =>
      conv.other_user_name.toLowerCase().includes(query)
    );
  }

  doRefresh(event: any) {
    this.loadConversations();
    event.target.complete();
  }

  startNewChat() {
    this.router.navigate(['/start-chat']);
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }
}