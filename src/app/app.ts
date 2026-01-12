import { Component } from '@angular/core';
import { HeaderComponent } from '@core/layout/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@core/layout/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.html',
})
export class App {}
