import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { FormComponent } from './components/form/form.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'new-user', component: FormComponent },
  { path: 'edit-user/:id', component: FormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
