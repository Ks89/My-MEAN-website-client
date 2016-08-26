import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'register-page',
  template: require('./register.html')
})
export default class RegisterComponent {
  pageHeader: Object;
  formModel: FormGroup;
  registerAlert: Object = { visible: false }; //hidden by default
  isWaiting: boolean = false; //enable button's spinner

  constructor(private authService: AuthService,
              private router: Router) {
    this.pageHeader = {
      title: 'Create a new accout',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'name': [null, Validators.minLength(3)],
      'email': [null, Validators.minLength(3)],
      'password': [null, Validators.minLength(3)]
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
        },
        ()=>console.log("Done")
      );
    }
  }
}
