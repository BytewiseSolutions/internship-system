import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InternshipService } from '../../services/internship.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-apply',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './apply-page.component.html',
    styleUrls: ['./apply-page.component.scss']
})
export class ApplyComponent {
    internshipId!: number;
    cvFile: File | null = null;
    transcriptFile: File | null = null;
    applicationLetterFile: File | null = null;
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private internshipService: InternshipService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.internshipId = Number(this.route.snapshot.params['id']);
    }

    onFileChange(event: any, type: string) {
        const file = event.target.files[0];
        if (!file) return;
        if (type === 'cv') this.cvFile = file;
        else if (type === 'transcript') this.transcriptFile = file;
        else if (type === 'letter') this.applicationLetterFile = file;
    }

    submitApplication() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id || user.role !== 'STUDENT') {
            this.toast.show('You must be logged in as a student to apply.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('student_id', user.id.toString());
        formData.append('internship_id', this.internshipId.toString());
        if (this.cvFile) formData.append('cv', this.cvFile);
        if (this.transcriptFile) formData.append('transcript', this.transcriptFile);
        if (this.applicationLetterFile) formData.append('letter', this.applicationLetterFile);

        this.loading = true;
        this.internshipService.apply(formData).subscribe({
            next: (res) => {
                this.toast.show('Application submitted successfully!', 'success');
                this.router.navigate(['/student-dashboard']);
            },
            error: (err: any) => {
                const msg = err.error?.message || 'Failed to submit application';
                this.toast.show(msg, 'error');
                if (msg.includes('already applied')) {
                    this.router.navigate(['/student-dashboard']);
                }
                this.loading = false;
            }
        });
    }
}
