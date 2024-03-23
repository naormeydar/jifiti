import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userListUrl = 'assets/user_list.json';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.userListUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.getUsers().pipe(
      map(data => data.users.find((user: any) => user.id === id))
    );
  }

  addUser(user: any): Observable<any> {
    return this.getUsers().pipe(
      map(data => {
        user.id = this.generateId(data.users);
        data.users.push(user);
        return data;
      }),
      switchMap(updatedData => {
        return this.saveUserList(updatedData);
      })
    );
  }

  updateUser(user: any): Observable<any> {
    return this.getUsers().pipe(
      map(data => {
        const index = data.users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          data.users[index] = user;
        }
        return data;
      }),
      switchMap(updatedData => {
        return this.saveUserList(updatedData);
      })
    );
  }

  private saveUserList(data: any): Observable<any> {
    return of(data);
  }

  private generateId(users: any[]): number {
    let maxId = 0;
    for (const user of users) {
      if (user.id > maxId) {
        maxId = user.id;
      }
    }
    return maxId + 1;
  }
}
