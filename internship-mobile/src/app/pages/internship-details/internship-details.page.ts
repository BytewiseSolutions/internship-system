import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonChip, IonLabel, IonBackButton, IonButtons, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, businessOutline, timeOutline, calendarOutline, cashOutline, peopleOutline, personOutline, mailOutline, callOutline } from 'ionicons/icons';

@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.page.html',
  styleUrls: ['./internship-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonChip, IonLabel, IonBackButton, IonButtons, IonItem]
})
export class InternshipDetailsPage implements OnInit {
  internship: any = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ locationOutline, businessOutline, timeOutline, calendarOutline, cashOutline, peopleOutline, personOutline, mailOutline, callOutline });
  }

  ngOnInit() {
    const internshipData = this.route.snapshot.queryParams['data'];
    if (internshipData) {
      this.internship = JSON.parse(internshipData);
      this.isLoading = false;
    }
  }

  applyNow() {
    this.router.navigate(['/apply'], {
      queryParams: { data: JSON.stringify(this.internship) }
    });
  }
}