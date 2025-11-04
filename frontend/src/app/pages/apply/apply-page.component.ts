import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InternshipService } from '../../services/internship.service';
import { ToastService } from '../../services/toast.service';
import { StudentHeaderComponent } from '../../components/student/student-header/student-header.component';
import { StudentSidebarComponent } from '../../components/student/student-sidebar/student-sidebar.component';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-apply',
    standalone: true,
    imports: [CommonModule, FormsModule, StudentHeaderComponent, StudentSidebarComponent],
    templateUrl: './apply-page.component.html',
    styleUrls: ['./apply-page.component.scss']
})
export class ApplyComponent implements OnInit {
    isSidebarCollapsed = false;
    internshipId!: number;
    internship: any = null;
    cvFile: File | null = null;
    transcriptFile: File | null = null;
    applicationLetterFile: File | null = null;
    loading = false;
    loadingInternship = true;

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private http: HttpClient,
        private internshipService: InternshipService,
        private toast: ToastService
    ) {}

    ngOnInit() {
        this.internshipId = Number(this.route.snapshot.params['id']);
        this.loadInternship();
    }

    loadInternship() {
        this.http.get(`${environment.apiUrl}/internships/get_available_internships.php`).subscribe({
            next: (response: any) => {
                const internships = Array.isArray(response) ? response : [];
                this.internship = internships.find(i => i.id == this.internshipId);
                this.loadingInternship = false;
                if (!this.internship) {
                    this.toast.show('Internship not found', 'error');
                    this.router.navigate(['/browse-internships']);
                }
            },
            error: () => {
                this.toast.show('Error loading internship details', 'error');
                this.loadingInternship = false;
            }
        });
    }

    onSidebarCollapseChanged(collapsed: boolean) {
        this.isSidebarCollapsed = collapsed;
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

        // First get student_id from students table using user_id
        this.http.get(`${environment.apiUrl}/students/get_student_id.php?user_id=${user.id}`).subscribe({
            next: (response: any) => {
                if (response.student_id) {
                    this.submitWithStudentId(response.student_id);
                } else {
                    this.toast.show('Student record not found', 'error');
                }
            },
            error: () => {
                this.toast.show('Error getting student information', 'error');
            }
        });
    }

    submitWithStudentId(studentId: number) {
        const formData = new FormData();
        formData.append('student_id', studentId.toString());
        formData.append('internship_id', this.internshipId.toString());
        if (this.cvFile) formData.append('cv', this.cvFile);
        if (this.transcriptFile) formData.append('transcript', this.transcriptFile);
        if (this.applicationLetterFile) formData.append('letter', this.applicationLetterFile);

        this.loading = true;
        this.http.post(`${environment.apiUrl}/applications/add_application.php`, formData).subscribe({
            next: (res) => {
                this.toast.show('Application submitted successfully!', 'success');
                this.router.navigate(['/my-applications']);
            },
            error: (err: any) => {
                console.error('Application submission error:', err);
                let msg = 'Failed to submit application';
                if (err.error?.message) {
                    msg = err.error.message;
                } else if (typeof err.error === 'string') {
                    msg = err.error;
                } else if (err.message) {
                    msg = err.message;
                }
                this.toast.show(msg, 'error');
                this.loading = false;
            }
        });
    }
}
