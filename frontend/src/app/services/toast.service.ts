import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
    message: string;
    type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
    toast$ = this.toastSubject.asObservable();

    show(message: string, type: 'success' | 'error' = 'success') {
        this.toastSubject.next({ message, type });
        setTimeout(() => this.hide(), 7000);
    }

    hide() {
        this.toastSubject.next(null);
    }
}
