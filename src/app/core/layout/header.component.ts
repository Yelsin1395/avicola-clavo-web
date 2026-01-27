import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssHome, cssBox, cssCheck, cssChevronDown } from '@ng-icons/css.gg';
import { MenuProvider } from '@core/models/menuProvider.model';
import { IfAuthenticatedDirective } from '@core/directives/if-authenticated.directive';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive, IfAuthenticatedDirective, NgIcon],
  viewProviders: [provideIcons({ cssHome, cssBox, cssCheck, cssChevronDown })],
})
export class HeaderComponent {
  constructor(private readonly authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  isMenuItem(route: MenuProvider): boolean {
    return !route.children?.length && route.isEnabled;
  }

  isMenuGroup(route: MenuProvider): boolean {
    return !!route.children?.length && route.isEnabled;
  }

  menuRoutes: MenuProvider[] = [
    {
      title: 'Inicio',
      icon: 'cssHome',
      path: '/console',
      isEnabled: true,
    },
    {
      title: 'Operaciones',
      icon: 'cssBox',
      isEnabled: true,
      children: [
        {
          title: 'Productos',
          path: '/console/products',
          isEnabled: true,
        },
        {
          title: 'Clientes',
          path: '/console/clients',
          isEnabled: true,
        },
      ],
    },
  ];
}
