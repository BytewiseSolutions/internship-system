import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/common/navbar/navbar.component";
import { FooterComponent } from "../../components/common/footer/footer.component";

@Component({
  selector: 'app-about',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
