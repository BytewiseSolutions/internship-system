import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddCompanyPayload, Company, CompanyService } from '../../../../services/company.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../services/toast.service';

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

    step: number = 1;

    constructor(private companyService: CompanyService, private toast: ToastService) { }

    onSubmit() {
        if (!this.company) return;

        if (this.step === 1) {
            if (!this.company.user?.name || !this.company.user?.email || !this.company.user?.password) {
                this.toast.show('Please fill all user fields', 'error');
                return;
            }
            this.nextStep();
            return;
        }

        if (this.step === 2) {
            if (!this.company.name || !this.company.email || !this.company.industry || !this.company.createdAt) {
                this.toast.show('Please fill all company fields', 'error');
                return;
            }

            const payload: AddCompanyPayload = {
                user: this.company.user!,
                company: {
                    name: this.company.name,
                    email: this.company.email,
                    industry: this.company.industry,
                    status: this.company.status,
                    createdAt: this.company.createdAt
                }
            };

            this.companyService.addCompany(payload).subscribe({
                next: added => {
                    this.toast.show('Company added successfully', 'success');
                    this.save.emit(added);
                    this.onClose();
                },
                error: err => {
                    console.error(err);
                    this.toast.show('Failed to add company', 'error');
                }
            });
        }
    }

    nextStep() {
        if (this.step === 1) this.step = 2;
    }
    previousStep() {
        if (this.step === 2) this.step = 1;
    }

    onClose() {
        this.company = null;
        this.step = 1;
        this.close.emit();
    }
}
