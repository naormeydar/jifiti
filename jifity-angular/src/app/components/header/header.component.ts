import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() showBackButton: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateBackToList(): void {
    this.router.navigate(['/']);
  }
}
