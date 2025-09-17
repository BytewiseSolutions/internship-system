import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Application, ApplicationService } from '../../../services/application.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

interface Internship {
  id: number;
  title: string;
  company_name: string;
  location: string;
  postedDate: string;
  deadline: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-browse-internships',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-internships.component.html',
  styleUrls: ['./browse-internships.component.scss']
})
export class BrowseInternshipsComponent implements OnInit {
  internships: Internship[] = [];
  filteredInternships: Internship[] = [];
  appliedInternshipIds: number[] = [];

  searchTerm: string = '';
  filterPostedFrom: string = '';
  filterPostedTo: string = '';
  filterDeadlineFrom: string = '';
  filterDeadlineTo: string = '';
  filterStatus: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  showApplyModal = false;
  selectedInternship: Internship | null = null;
  files: { cv?: File; transcript?: File; letter?: File } = {};

  constructor(
    private applicationService: ApplicationService,
    private toast: ToastService,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit() {
    this.loadInternships();
    this.loadAppliedInternships();
  }

  loadInternships() {
    this.http.get<Internship[]>('http://localhost:8081/internships/get_internships.php')
      .pipe(
        map(data => data.filter(item => item.status === 'Active'))
      )
      .subscribe({
        next: (data) => {
          this.internships = data;
          this.filteredInternships = [...this.internships];
          this.totalPages = Math.ceil(this.filteredInternships.length / this.itemsPerPage);
        },
        error: (err) => {
          console.error('Failed to load internships:', err);
        }
      });
  }
  loadAppliedInternships() {
    const student = JSON.parse(localStorage.getItem('user') || '{}');
    if (!student?.id) return;

    this.applicationService.getApplications()
      .subscribe({
        next: (applications: Application[]) => {
          this.appliedInternshipIds = applications
            .filter(a => a.student_id === student.id)
            .map(a => a.internship_id);
        },
        error: (err) => console.error('Failed to load student applications:', err)
      });
  }
  filterInternships() {
    this.filteredInternships = this.internships.filter(internship => {
      const search = this.searchTerm.toLowerCase();
      const matchesText =
        internship.title.toLowerCase().includes(search) ||
        internship.company_name.toLowerCase().includes(search) ||
        internship.location.toLowerCase().includes(search);

      const matchesPosted =
        (!this.filterPostedFrom || new Date(internship.postedDate) >= new Date(this.filterPostedFrom)) &&
        (!this.filterPostedTo || new Date(internship.postedDate) <= new Date(this.filterPostedTo));

      const matchesDeadline =
        (!this.filterDeadlineFrom || new Date(internship.deadline) >= new Date(this.filterDeadlineFrom)) &&
        (!this.filterDeadlineTo || new Date(internship.deadline) <= new Date(this.filterDeadlineTo));

      const matchesStatus =
        !this.filterStatus || internship.status === this.filterStatus;

      return matchesText && matchesPosted && matchesDeadline && matchesStatus;
    });

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredInternships.length / this.itemsPerPage);
  }

  get paginatedInternships(): Internship[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredInternships.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  applyForInternship(internship: Internship) {
    console.log(`Applying for internship: ${internship.title} at ${internship.company_name}`);
  }
  openApplyModal(internship: Internship) {
    this.selectedInternship = internship;
    this.showApplyModal = true;
  }

  closeApplyModal() {
    this.showApplyModal = false;
    this.selectedInternship = null;
    this.files = {};
  }

  onFileSelected(event: any, type: 'cv' | 'transcript' | 'letter') {
    if (event.target.files.length > 0) {
      this.files[type] = event.target.files[0];
    }
  }


  submitApplication() {
    if (!this.selectedInternship) {
      console.log('No internship selected.');
      return;
    }

    const studentRaw = localStorage.getItem('user');
    const student = studentRaw ? JSON.parse(studentRaw) : null;

    if (!student || !student.id || student.role !== 'STUDENT') {
      alert('You must be logged in as a student to apply.');
      console.error('Student ID missing or role is not STUDENT.', student);
      return;
    }
    console.log('Parsed student object:', student);

    if (!student) {
      alert('You must be logged in as a student to apply.');
      console.error('No student object found in localStorage.');
      return;
    }

    const studentId = student.id || student.user_id;
    console.log('Using student ID:', studentId, 'Role:', student.role);

    if (!studentId || student.role !== 'STUDENT') {
      alert('You must be logged in as a student to apply.');
      console.error('Student ID missing or role is not STUDENT.');
      return;
    }

    const formData = new FormData();
    formData.append('student_id', studentId.toString());
    formData.append('internship_id', this.selectedInternship.id.toString());

    if (this.files.cv) {
      formData.append('cv', this.files.cv);
      console.log('CV file added:', this.files.cv.name);
    }
    if (this.files.transcript) {
      formData.append('transcript', this.files.transcript);
      console.log('Transcript file added:', this.files.transcript.name);
    }
    if (this.files.letter) {
      formData.append('letter', this.files.letter);
      console.log('Application letter file added:', this.files.letter.name);
    }

    console.log('Submitting application for internship:', this.selectedInternship);

    this.http.post('http://localhost:8081/applications/add_application.php', formData)
      .subscribe({
        next: (res) => {
          console.log('Application submitted successfully:', res);
          this.closeApplyModal();
        },
        error: (err) => {
          console.error('Error submitting application:', err);
        }
      });
  }
}
