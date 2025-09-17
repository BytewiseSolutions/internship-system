import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/common/navbar/navbar.component";
import { FooterComponent } from "../../components/common/footer/footer.component";
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
  

export class FaqComponent {
  activeIndex: number | null = null;

  faqs = [
    {
      question: 'How do I apply for an internship?',
      answer: 'Simply browse available internships on the homepage or use the search feature. Once you find a listing, click "Apply Now" and follow the prompts.',
       open: false
    },
    {
      question: 'Is there a fee to use this platform?',
      answer: 'No, our platform is completely free for both applicants and companies.',
       open: false
    },
    {
      question: 'How can I know if my application was successful?',
      answer: 'You will receive a notification and email once your application is submitted. If the company accepts your application, they will contact you directly',
       open: false
    },
    {
      question: 'Can I update my profile or resume after registration?',
      answer: 'Yes, you can log into your account at any time and edit your profile details or upload a new resume.',
       open: false
    },
    {
      question: 'Who can I contact for technical support?',
      answer: 'You can reach our support team at monamane.lebohang45@gmail.com or call us during business hours for assistance.',
       open: false
    }
  ];

  toggleFAQ(index: number) {
    this.faqs.forEach((faq, i) => {
      faq.open = i === index ? !faq.open : false;
    });
  }
}

