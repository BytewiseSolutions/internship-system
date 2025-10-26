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
import { FaqComponent } from './pages/faq/faq.component';
import { ManageCompaniesComponent } from './dashboards/admin-dashboard/manage-companies/manage-companies.component';
import { ManageUsersComponent } from './dashboards/admin-dashboard/manage-users/manage-users.component';
import { ModerateReviewsComponent } from './dashboards/admin-dashboard/moderate-reviews/moderate-reviews.component';
import { ViewApplicationsComponent } from './dashboards/admin-dashboard/view-applications/view-applications.component';
import { ViewInternshipsComponent } from './dashboards/admin-dashboard/view-internships/view-internships.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { CompanyLayoutComponent } from './layout/company-layout/company-layout.component';
import { ApplyComponent } from './pages/apply/apply-page.component';
import { LecturerDashboardComponent } from './dashboards/lecturer-dashboard/lecturer-dashboard.component';
import { ViewStudentsComponent } from './dashboards/lecturer-dashboard/view-students/view-students.component';
import { ReportsComponent } from './dashboards/lecturer-dashboard/reports/reports.component';

import { InternshipStatusComponent } from './dashboards/lecturer-dashboard/internship-status/internship-status.component';

import { LecturerLayoutComponent } from './layout/lecturer-layout/lecturer-layout.component';

import { SystemAdminDashboardComponent } from './dashboards/system-admin-dashboard/system-admin-dashboard.component';
import { SystemAdminLayoutComponent } from './layout/system-admin-layout/system-admin-layout.component';
import { SchoolAdminDashboardComponent } from './dashboards/school-admin-dashboard/school-admin-dashboard.component';
import { ManageSchoolsComponent } from './dashboards/system-admin-dashboard/manage-schools/manage-schools.component';
import { SystemManageCompaniesComponent } from './dashboards/system-admin-dashboard/manage-companies/manage-companies.component';
import { ManageSchoolAdminsComponent } from './dashboards/system-admin-dashboard/manage-school-admins/manage-school-admins.component';
import { ManageCompanyUsersComponent } from './dashboards/system-admin-dashboard/manage-company-users/manage-company-users.component';
import { SystemOverviewComponent } from './dashboards/system-admin-dashboard/system-overview/system-overview.component';
import { EmployerDashboardComponent } from './dashboards/employer-dashboard/employer-dashboard.component';
import { ManageInternshipsComponent as EmployerManageInternshipsComponent } from './dashboards/employer-dashboard/manage-internships/manage-internships.component';
import { ManageApplicationsComponent as EmployerManageApplicationsComponent } from './dashboards/employer-dashboard/manage-applications/manage-applications.component';
import { ManageReviewsComponent as EmployerManageReviewsComponent } from './dashboards/employer-dashboard/manage-reviews/manage-reviews.component';
import { StudentDashboardComponent } from './dashboards/student-dashboard/student-dashboard.component';
import { BrowseInternshipsComponent } from './pages/student/browse-internships/browse-internships.component';
import { MyApplicationsComponent } from './pages/student/my-applications/my-applications.component';
import { MyInternshipComponent } from './pages/student/my-internship/my-internship.component';
import { LogbookComponent } from './pages/student/logbook/logbook.component';
import { ReviewsComponent } from './pages/student/reviews/reviews.component';
import { ProfileComponent } from './pages/student/profile/profile.component';
import { InternshipDetailsComponent } from './pages/internship-details/internship-details.component';

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

    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'system-admin-dashboard', component: SystemAdminDashboardComponent },
    { path: 'school-admin-dashboard', component: SchoolAdminDashboardComponent },
    { path: 'lecturer-dashboard', component: LecturerDashboardComponent },
    { path: 'employer-dashboard', component: EmployerDashboardComponent },
    { path: 'student-dashboard', component: StudentDashboardComponent },
    { path: 'browse-internships', component: BrowseInternshipsComponent },
    { path: 'my-applications', component: MyApplicationsComponent },
    { path: 'my-internship', component: MyInternshipComponent },
    { path: 'logbook', component: LogbookComponent },
    { path: 'reviews', component: ReviewsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'apply/:id', component: ApplyComponent },
    { path: 'internship-details/:id', component: InternshipDetailsComponent },

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
    { path: 'manage-internships', component: EmployerManageInternshipsComponent },
    { path: 'manage-applications', component: EmployerManageApplicationsComponent },
    { path: 'manage-reviews', component: EmployerManageReviewsComponent },

    {
        path: '',
        component: LecturerLayoutComponent,
        children: [
            { path: 'view-students', component: ViewStudentsComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'internship-status', component: InternshipStatusComponent },
        ]
    },
    // System Admin layout with children
    {
        path: '',
        component: SystemAdminLayoutComponent,
        children: [
            { path: 'manage-schools', component: ManageSchoolsComponent },
            { path: 'system-manage-companies', component: SystemManageCompaniesComponent },
            { path: 'manage-school-admins', component: ManageSchoolAdminsComponent },
            { path: 'manage-company-users', component: ManageCompanyUsersComponent },
            { path: 'system-overview', component: SystemOverviewComponent },
        ]
    },

    // School Admin routes
    { path: 'manage-courses', component: SchoolAdminDashboardComponent },
    { path: 'manage-lecturers', component: SchoolAdminDashboardComponent },
    { path: 'manage-students', component: SchoolAdminDashboardComponent },
    { path: 'school-reports', component: SchoolAdminDashboardComponent },
];
