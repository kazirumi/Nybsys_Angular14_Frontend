import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {environment}  from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private fb: FormBuilder, private http: HttpClient) {}
  // readonly rootURL = 'https://localhost:44358/api';

  UserList: User[];

  userModel = this.fb.group({
    Id:[''],
    UserName: ['', Validators.required],
    Email: [
      '',
      [
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        Validators.required,
      ],
    ],
    FullName: [''],
  });

  getAllUser() {
    return this.http.get(environment.rootURL + '/User').subscribe(
      (res: any) => {
        this.UserList = res as User[];
        console.log(this.UserList);
      },
      (err) => {
        console.log('Unable to Collect User List');
      }
    );
  }

  deleteUser(Id: string) {
    return this.http.delete(environment.rootURL + '/User/' + Id);
  }

  editUser() {
    var body={
      UserName:this.userModel.value.UserName,
      Email:this.userModel.value.Email,
      FullName:this.userModel.value.FullName
    }
    return this.http.put(environment.rootURL + '/User/' + this.userModel.value.Id,body);
  }
}
