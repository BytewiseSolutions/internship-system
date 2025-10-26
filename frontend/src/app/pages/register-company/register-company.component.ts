import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent {
  loading = false;

  registrationData = {
    company_name: '',
    company_email: '',
    company_address: '',
    employer_name: '',
    employer_email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) { }

  registerCompany() {
    if (!this.registrationData.company_name || !this.registrationData.company_email || 
        !this.registrationData.company_address || !this.registrationData.employer_name || 
        !this.registrationData.employer_email || !this.registrationData.password) {
      this.toast.show('All fields are required!', 'error');
      return;
    }

    this.loading = true;
    this.http.post(`${environment.apiUrl}/auth/register-company.php`, this.registrationData)
      .subscribe({
        next: (res: any) => {
          this.toast.show('Company and employer registered successfully!', 'success');
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Registration failed. Please try again.';
          this.toast.show(errorMsg, 'error');
          this.loading = false;
        }
      });
  }
}
