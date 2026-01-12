import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-footer',
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentDate = new Date().getFullYear();
}
