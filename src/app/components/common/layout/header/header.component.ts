import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<void>();
  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sideNavToggled.emit();
  }

  onLoggedout() {
    this.router.navigate(['/login']);
  }
}
