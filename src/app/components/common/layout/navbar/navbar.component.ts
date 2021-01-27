import { Component, OnInit } from '@angular/core';
import { childRoutes } from 'src/app/models/child-routes';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  routes = childRoutes;
  
  constructor() { }

  ngOnInit(): void {
  }

}
