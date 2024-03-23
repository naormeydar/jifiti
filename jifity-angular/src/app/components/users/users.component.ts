import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data.users;
    });
  }

  goToEdit(id: number): void {
    this.router.navigate(['/edit-user', id]);
  }

  goToNewUser(): void {
    this.router.navigate(['/new-user']);
  }
}
