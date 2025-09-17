import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../../../../services/company.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-company-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './company-modal.component.html',
    styleUrls: ['./company-modal.component.scss']
})
export class CompanyModalComponent {
    @Input() mode: 'add' | 'edit' | 'view' = 'view';
    @Input() company: Company | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<Company>();

    onSubmit() {
        if ((this.mode === 'add' || this.mode === 'edit') && this.company) {
            this.save.emit(this.company);
        }
    }

    onClose() {
        this.close.emit();
    }
}
