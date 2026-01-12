import { Component, OnInit, signal } from '@angular/core';
import { JwtService } from '@core/auth/services/jwt.service';

@Component({
  selector: 'app-home.component',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  protected readonly userName = signal('');

  constructor(private readonly jwtService: JwtService) {}

  ngOnInit(): void {
    const content = this.jwtService.getContentToken();
    
    this.userName.set(content.fullName);
  }
}
