import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonFooter, IonItem, IonInput, IonButton, IonIcon, IonList, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
import { MessagingService, Message } from '../../services/messaging.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonFooter, IonItem, IonInput, IonButton, IonIcon, IonList, IonSpinner]
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  
  messages: Message[] = [];
  newMessage = '';
  otherUserId!: number;
  otherUserName = '';
  currentUserId!: number;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService,
    private authService: AuthService
  ) {
    addIcons({ send });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.otherUserId = +params['userId'];
      this.otherUserName = params['userName'];
    });

    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id;
    
    this.loadMessages();
  }

  loadMessages() {
    this.messagingService.getMessages(this.currentUserId, this.otherUserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.messages = response.messages;
          setTimeout(() => this.scrollToBottom(), 100);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const messageText = this.newMessage.trim();
    this.newMessage = '';

    this.messagingService.sendMessage(this.currentUserId, this.otherUserId, messageText).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadMessages();
        }
      },
      error: (error) => {
        console.error('Failed to send message:', error);
      }
    });
  }

  scrollToBottom() {
    this.content.scrollToBottom(300);
  }

  isMyMessage(message: Message): boolean {
    return message.sender_id === this.currentUserId;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  showMessageOptions(message: any) {
    if (this.isMyMessage(message)) {
      // Single tap to edit
      message.editing = true;
      message.editText = message.message;
    }
  }

  showDeleteOption(message: any, event: Event) {
    event.preventDefault();
    if (this.isMyMessage(message)) {
      if (confirm('Delete this message?')) {
        this.deleteMessage(message);
      }
    }
  }

  saveEdit(message: any) {
    if (message.editText.trim()) {
      this.messagingService.editMessage(message.id, message.editText.trim(), this.currentUserId).subscribe({
        next: (response) => {
          if (response.success) {
            message.message = message.editText.trim();
            message.editing = false;
          }
        },
        error: (error) => {
          console.error('Failed to edit message:', error);
        }
      });
    }
  }

  cancelEdit(message: any) {
    message.editing = false;
    message.editText = '';
  }

  deleteMessage(message: any) {
    this.messagingService.deleteMessage(message.id, this.currentUserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.messages = this.messages.filter(m => m.id !== message.id);
        }
      },
      error: (error) => {
        console.error('Failed to delete message:', error);
      }
    });
  }
}