import { Component } from '@angular/core';
import {UserService} from "../../common/services/users.service";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'mmw-admin-users-page',
  styleUrls: ['users.scss'],
  templateUrl: 'users.html'
})
export default class UsersAdminComponent {
  public users: Observable<any[]>;
  page = 1;
  public collectionSize = 120;
  public maxSize = 5;
  public pageSize = 3;

  constructor(private userService: UserService) {
    this.users = this.userService.getUsers(this.page, this.pageSize);
  }

  public onPageChange(event) {
    console.log("onPageChange page: " + event + ", pageSize: " + this.pageSize);
    this.users = this.userService.getUsers(event, this.pageSize);
  }
}
