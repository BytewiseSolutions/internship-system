import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonChip, IonLabel, IonSearchbar, IonSelect, IonSelectOption, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, timeOutline, businessOutline, filterOutline } from 'ionicons/icons';
import { InternshipService } from '../../services/internship.service';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.page.html',
  styleUrls: ['./internships.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonChip, IonLabel, IonSearchbar, IonSelect, IonSelectOption, IonItem]
})
export class InternshipsPage implements OnInit {
  internships: any[] = [];
  filteredInternships: any[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  locationFilter: string = '';
  workTypeFilter: string = '';

  constructor(private internshipService: InternshipService, private router: Router) {
    addIcons({ locationOutline, timeOutline, businessOutline, filterOutline });
  }

  ngOnInit() {
    this.loadInternships();
  }

  loadInternships() {
    this.internshipService.getAvailableInternships().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.internships = Array.isArray(response) ? response : [];
        this.filteredInternships = [...this.internships];
        console.log('Internships loaded:', this.internships.length);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading internships:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilters();
  }

  onLocationChange() {
    this.applyFilters();
  }

  onWorkTypeChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredInternships = this.internships.filter(internship => {
      const matchesSearch = !this.searchTerm || 
        internship.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        internship.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesLocation = !this.locationFilter || 
        internship.location.toLowerCase().includes(this.locationFilter.toLowerCase());
      
      const matchesWorkType = !this.workTypeFilter || 
        internship.work_type === this.workTypeFilter;
      
      return matchesSearch && matchesLocation && matchesWorkType;
    });
  }

  getUniqueLocations(): string[] {
    const locations = this.internships.map(i => i.location).filter(Boolean);
    return [...new Set(locations)];
  }

  getWorkTypes(): string[] {
    return ['REMOTE', 'ON_SITE', 'HYBRID'];
  }

  viewDetails(internship: any) {
    this.router.navigate(['/internship-details'], {
      queryParams: { data: JSON.stringify(internship) }
    });
  }
}