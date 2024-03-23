import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormService } from '../../services/form.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user.model';
import { IFormField } from '../../models/form_field.model';

interface FormControls {
  [key: string]: any;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {
  formFields: IFormField[] = [];
  userForm: FormGroup;
  userId?: number;
  formSubtitle?: string;
  userDetails?: IUser;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];
    this.subscriptions.push(
      this.formService.getUserFormFields().subscribe(data => {
        this.formFields = data.form_fields;
        this.buildForm();
      })
    );

    if (this.userId) {
      this.formSubtitle = "Edit user's personal info";
      this.subscriptions.push(
        this.userService.getUserById(this.userId).subscribe(
          (data) => {
            this.userDetails = data;
            this.populateFormWithUserDetails(this.userDetails);
          },
          (error) => {
            console.error(`Error occurred while fetching user with id:${this.userId}`, error);
            this.router.navigate(['']);
          }
        )
      );
    } else {
      this.formSubtitle = "Fill out new user's personal info";
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private buildForm(): void {
    const formGroup: FormControls = {};
    this.formFields.forEach(field => {
      formGroup[field.key] = ['', Validators.required];
    });
    this.userForm = this.formBuilder.group(formGroup);
  }

  private populateFormWithUserDetails(userDetails: IUser): void {
    if (userDetails) {
      this.userForm.patchValue({
        id: userDetails.id,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
        phone: userDetails.phone
      });
    }
  }

  getFeildPlaceholder(field: IFormField): string {
    if (field.key === "phone") {
      return '000-000-0000';
    } else if (field.key === "email") {
      return 'email@email.com';
    }
    return field.label;
  }

  getFieldPattern(field: IFormField): string | RegExp {
    console.log(this.userForm);
    if (field.validators.includes("phone")) {
      return '[0]{1}[5]{1}[023459]{1}-[0-9]{3}-[0-9]{4}';
    } else if (field.validators.includes("email")) {
      return '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
    }
    return '';
  }

  onSubmit(): void {
    this.userDetails = this.userForm.value;
    if (this.userId) {
      this.userDetails = { ...this.userDetails, id: this.userId } as IUser;
      this.subscriptions.push(
        this.userService.editUser(this.userDetails).subscribe(() => {
          this.router.navigate(['/users']);
        })
      );
    } else {
      this.subscriptions.push(
        this.userService.addUser(this.userDetails as IUser).subscribe(() => {
          this.router.navigate(['/users']);
        })
      );
    }
  }
}
