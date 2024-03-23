import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy  {
  users: IUser[] = [];
  private usersSubscription?: Subscription;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.usersSubscription = this.userService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  goToEdit(id: number): void {
    this.router.navigate(['/edit-user', id]);
  }

  goToNewUser(): void {
    this.router.navigate(['/new-user']);
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
