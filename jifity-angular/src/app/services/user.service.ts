import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userListUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
      return this.http.get<any[]>(this.userListUrl);
  }

  getUserById(id: number): Observable<IUser> {
    const url = `${this.userListUrl}/${id}`;
    return this.http.get<IUser>(url);
  }

  addUser(newUser: IUser): Observable<IUser> {
    return this.http.post<any>(this.userListUrl, newUser);
  }

  editUser(user: IUser): Observable<IUser> {
    const url = `${this.userListUrl}/${user.id}`;
    return this.http.put<IUser>(url, user);
  }
}
