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
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/register/register.html'
})
export default class RegisterComponent {
  pageHeader: any;
  formModel: FormGroup;

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
      console.log("Calling register...");
      this.authService.register({
        name: this.formModel.value.name,
        email: this.formModel.value.email,
        password: this.formModel.value.password
      }).subscribe(
        response => {
          console.log("Response");
          console.log(response);
          //redirect to login page
          this.router.navigate(['/login']);
        },
        (err)=>console.error(err),
        ()=>console.log("Done")
      );
    }
  }
}
