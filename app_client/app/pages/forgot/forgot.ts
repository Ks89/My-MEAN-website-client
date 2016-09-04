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
  selector: 'forgot-page',
  templateUrl: 'app/pages/forgot/forgot.html'
})
export default class ForgotComponent {
  pageHeader: any;
  formModel: FormGroup;

  //this class is used when you click on the "forgot password" to reset your password

  constructor(private authService: AuthService,
              private router: Router) {
    this.pageHeader = {
      title: 'Forgot',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, Validators.minLength(3)]
    })
  }

  onForgot() {
    if (this.formModel.valid) {
      console.log("Calling forgot password...");
      this.authService.forgot(this.formModel.value.email)
      .subscribe(response => {
          console.log("Response");
          console.log(response);
        },
        (err)=>console.error(err),
        ()=>console.log("Done")
      );
    }
  }
}
