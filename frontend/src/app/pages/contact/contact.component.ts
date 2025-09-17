import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/common/navbar/navbar.component";
import { FooterComponent } from "../../components/common/footer/footer.component";

@Component({
  selector: 'app-contact',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
