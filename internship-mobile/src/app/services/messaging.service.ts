import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_name: string;
  editing?: boolean;
  editText?: string;
}

export interface Conversation {
  conversation_id: number;
  other_user_id: number;
  other_user_name: string;
  last_message: string;
  last_message_time: string;
  last_activity: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = 'http://127.0.0.1:8001/messages';
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendMessage(senderId: number, receiverId: number, messageText: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send_message.php`, {
      sender_id: senderId,
      receiver_id: receiverId,
      message_text: messageText,
      message_type: 'text'
    });
  }

  getMessages(user1Id: number, user2Id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_messages.php?user1_id=${user1Id}&user2_id=${user2Id}`);
  }

  getConversations(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_conversations.php?user_id=${userId}`);
  }

  editMessage(messageId: number, newMessage: string, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit_message.php`, {
      message_id: messageId,
      message: newMessage,
      user_id: userId
    });
  }

  deleteMessage(messageId: number, userId: number): Observable<any> {
    return this.http.request('DELETE', `${this.apiUrl}/delete_message.php`, {
      body: {
        message_id: messageId,
        user_id: userId
      }
    });
  }

  updateMessages(messages: Message[]) {
    this.messagesSubject.next(messages);
  }
}