import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';
import { EmailValidators, PasswordValidators } from 'ng2-validators';
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'register-page',
  templateUrl: 'register.html'
})
export default class RegisterComponent {
  pageHeader: Object;
  formModel: FormGroup;
  registerAlert: Object = { visible: false }; //hidden by default
  showFormError: boolean = false;
  isWaiting: boolean = false; //enable button's spinner

  constructor(private authService: AuthService,
              private router: Router) {
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
      'password': [null, null], //TODO FIXME
      'passwordConfirm': [null, null] //TODO FIXME
    })
  }

  onRegister() {
    if (this.formModel.valid) {
      this.isWaiting = true;
      console.log("Calling register...");
      this.authService.register({
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
          this.router.navigate(['/login']);
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
