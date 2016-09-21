import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';
import { EmailValidators, PasswordValidators } from 'ng2-validators';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';

@Component({
  selector: 'register-page',
  templateUrl: 'register.html'
})
export default class RegisterComponent implements OnInit {
  public pageHeader: Object;
  public formModel: FormGroup;
  public registerAlert: Object = { visible: false }; //hidden by default
  public showFormError: boolean = false;
  public isWaiting: boolean = false; //enable button's spinner

  constructor(private _authService: AuthService,
              private _router: Router) {
    this.pageHeader = {
      title: 'Create a new accout',
      strapline: ''
    };

    const passwordValidator = Validators.compose([
      PasswordValidators.alphabeticalCharacterRule(1),
      PasswordValidators.digitCharacterRule(1),
      PasswordValidators.lowercaseCharacterRule(1),
      PasswordValidators.uppercaseCharacterRule(1),
      PasswordValidators.repeatCharacterRegexRule(3),
      Validators.minLength(8)]);

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': [null, EmailValidators.simple()],
      'emailConfirm': [null, EmailValidators.simple()],
      'password': [null, passwordValidator],
      'passwordConfirm': [null, null]
    })
  }

  ngOnInit(){

  }

  onRegister() {
    if (this.formModel.valid) {
      if(this.formModel.value.password != this.formModel.value.passwordConfirm) {
        this.registerAlert = {
          visible: true,
          status: 'danger',
          strong : 'Danger',
          message: 'Password and Password confirm must be equals'
        };
        this.isWaiting = false;
        this.showFormError = true;
        return;
      }
      if(this.formModel.value.email != this.formModel.value.emailConfirm) {
        this.registerAlert = {
          visible: true,
          status: 'danger',
          strong : 'Danger',
          message: 'Email and Email confirm must be equals'
        };
        this.isWaiting = false;
        this.showFormError = true;
        return;
      }

      this.isWaiting = true;
      console.log("Calling register...");
      this._authService.register({
        name: this.formModel.value.name,
        email: this.formModel.value.email,
        password: this.formModel.value.password
      }).subscribe(
        response => {
          console.log("Response");
          console.log(response);
          this.registerAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response.message
          };
          this.isWaiting = false;
          this.showFormError = false;
          this._router.navigate(['/login']);
        },
        err => {
          console.error(err);
          this.registerAlert = {
            visible: true,
            status: 'danger',
            strong : 'Danger',
            message: JSON.parse(err._body).message
          };
          this.isWaiting = false;
          this.showFormError = true;
        },
        ()=>console.log("Done")
      );
    }
  }
}
