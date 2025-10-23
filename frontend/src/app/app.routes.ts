import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterCompanyComponent } from './pages/register-company/register-company.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { CompanyDashboardComponent } from './dashboards/company-dashboard/company-dashboard.component';
import { StudentDashboardComponent } from './dashboards/student-dashboard/student-dashboard.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ManageCompaniesComponent } from './dashboards/admin-dashboard/manage-companies/manage-companies.component';
import { ManageUsersComponent } from './dashboards/admin-dashboard/manage-users/manage-users.component';
import { ModerateReviewsComponent } from './dashboards/admin-dashboard/moderate-reviews/moderate-reviews.component';
import { ViewApplicationsComponent } from './dashboards/admin-dashboard/view-applications/view-applications.component';
import { ViewInternshipsComponent } from './dashboards/admin-dashboard/view-internships/view-internships.component';
import { ManageApplicationsComponent } from './dashboards/company-dashboard/manage-applications/manage-applications.component';
import { ManageInternshipsComponent } from './dashboards/company-dashboard/manage-internships/manage-internships.component';
import { ManageReviewsComponent } from './dashboards/company-dashboard/manage-reviews/manage-reviews.component';
import { BrowseInternshipsComponent } from './dashboards/student-dashboard/browse-internships/browse-internships.component';
import { CreateReviewsComponent } from './dashboards/student-dashboard/create-reviews/create-reviews.component';
import { TrackApplicationComponent } from './dashboards/student-dashboard/track-application/track-application.component';
import { ViewReviewsComponent } from './dashboards/student-dashboard/view-reviews/view-reviews.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { StudentLayoutComponent } from './layout/student-layout/student-layout.component';
import { CompanyLayoutComponent } from './layout/company-layout/company-layout.component';
import { ApplyComponent } from './pages/apply/apply-page.component';
import { LecturerDashboardComponent } from './dashboards/lecturer-dashboard/lecturer-dashboard.component';
import { ViewStudentsComponent } from './dashboards/lecturer-dashboard/view-students/view-students.component';
import { ReportsComponent } from './dashboards/lecturer-dashboard/reports/reports.component';

import { InternshipStatusComponent } from './dashboards/lecturer-dashboard/internship-status/internship-status.component';
import { LogbookComponent } from './dashboards/student-dashboard/logbook/logbook.component';
import { LecturerLayoutComponent } from './layout/lecturer-layout/lecturer-layout.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'register-company', component: RegisterCompanyComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'faqs', component: FaqComponent },
    { path: 'company-dashboard', component: CompanyDashboardComponent },
    { path: 'student-dashboard', component: StudentDashboardComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'lecturer-dashboard', component: LecturerDashboardComponent },
    { path: 'apply/:id', component: ApplyComponent },

    // Admin layout with children
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: 'manage-users', component: ManageUsersComponent },
            { path: 'manage-companies', component: ManageCompaniesComponent },
            { path: 'view-applications', component: ViewApplicationsComponent },
            { path: 'view-internships', component: ViewInternshipsComponent },
            { path: 'moderate-reviews', component: ModerateReviewsComponent },
        ]
    },
    // Company layout with children
    {
        path: '',
        component: CompanyLayoutComponent,
        children: [
            { path: 'manage-internships', component: ManageInternshipsComponent },
            { path: 'manage-applications', component: ManageApplicationsComponent },
            { path: 'manage-reviews', component: ManageReviewsComponent },
        ]
    },
    // Student layout with children
    {
        path: '',
        component: StudentLayoutComponent,
        children: [
            { path: 'browse-internships', component: BrowseInternshipsComponent },
            { path: 'track-application', component: TrackApplicationComponent },
            { path: 'create-reviews', component: CreateReviewsComponent },
            { path: 'view-reviews', component: ViewReviewsComponent },
            { path: 'logbook', component: LogbookComponent },
        ]
    },
    // Lecturer layout with children
    {
        path: '',
        component: LecturerLayoutComponent,
        children: [
            { path: 'view-students', component: ViewStudentsComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'internship-status', component: InternshipStatusComponent },
        ]
    },
];
