import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
// import { ProductService } from 'src/app/shared/product.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: [
  ]
})
export class RegistrationComponent implements OnInit {
  Check:any = null;
  constructor(public service:AuthService,public toastr:ToastrService) { }

  ngOnInit(): void {
  }
  get f(){
    return this.service.userModel.controls;
  }
  CheckPassword(confirmPassWord:any){
    let password=this.service.userModel.get('Passwords.Password')?.value;
    // console.log(b);
    if(confirmPassWord==password){
      this.Check=true;
    }
    else
    this.Check=false;
  }

  onSubmit(){
    // console.log(this.service.userModel.value);
    this.service.CreateUser().pipe(first()).subscribe(
      (res:any)=>{
        if(res.Succeeded){
          this.service.userModel.reset();
          this.toastr.success('new User created','Registration Successful');
        }
        else{
          console.log(res.errors)
          res.Errors.forEach((element:any) => {
            switch (element.Code) {
              case 'DuplicateUserName':
                this.toastr.error('user name is taken','Registration Faild');
                break;

              case 'InvalidUserName':
                this.toastr.error(element.Description,'Registration Faild');
                break;

              default:
                this.toastr.error(element.Description,'Registration Faild');
                break;
            }
          });
        }
      },
      err=>{
        console.log(err);
      }
    );
  }

}
