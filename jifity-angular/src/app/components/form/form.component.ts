import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

interface FormControls {
  [key: string]: any;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  formFields: any[] = [];
  userForm: FormGroup;
  userId?: string;

  constructor(private formBuilder: FormBuilder, private formService: FormService, private userService: UserService,  private route: ActivatedRoute) {
    this.userForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.formService.getUserFormFields().subscribe(data => {
        this.formFields = data.form_fields;
        this.buildForm();
      });
    });
  }

  private buildForm(): void {
    const formGroup: FormControls = {};
    this.formFields.forEach(field => {
      formGroup[field.key] = ['', Validators.required];
    });
    this.userForm = this.formBuilder.group(formGroup);
  }

  onSubmit(): void {
    console.log(this.userForm.value);
  }
}
