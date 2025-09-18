import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
    toast$ = this.toastSubject.asObservable();
    private timeoutId: any;

    show(
        message: string,
        type: 'success' | 'error' | 'info' = 'success',
        duration: number = 7000
    ) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.toastSubject.next({ message, type });

        this.timeoutId = setTimeout(() => this.hide(), duration);
    }

    hide() {
        this.toastSubject.next(null);
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}
