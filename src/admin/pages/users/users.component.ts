import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../core/services/users.service';

@Component({
  selector: 'mmw-admin-users-page',
  styleUrls: ['users.scss'],
  templateUrl: 'users.html'
})
export class UsersAdminComponent {
  users: Observable<any[]>;
  page = 1;
  collectionSize = 120;
  maxSize = 1;
  pageSize = 3;

  constructor(private userService: UserService) {
    this.users = this.userService.getUsers(this.page, this.pageSize);
  }

  onPageChange(event: any) {
    console.log('onPageChange page: ' + event + ', pageSize: ' + this.pageSize);
    this.users = this.userService.getUsers(event, this.pageSize);
  }
}
