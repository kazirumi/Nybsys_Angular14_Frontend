import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService{

  signInStatus:boolean=false;
  hideAdminOptions=false;

  userDetails:any;
  
  readonly rootURL='https://localhost:44358/api';

  constructor(private http:HttpClient,private fb:FormBuilder,private router :Router) {
   }
   
   userModel=this.fb.group({
                UserName:['',Validators.required],
                Email:['',Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
                FullName:[''],
                Passwords:this.fb.group({
                  Password:['',[Validators.required,Validators.minLength(4)]],
                  ConfirmPassword:['',Validators.required]
                }),
                Role:['',Validators.required]
              });

   comparePassword(fb:FormGroup){

    let confirmPswrdCtrl:any= fb.get('ConfirmPassword');
    
    if(confirmPswrdCtrl.errors==null)
    {
      if(fb.get('Password')?.value != confirmPswrdCtrl.value)
      {
        confirmPswrdCtrl.setErrors({passwordMismatch:true});
      }
      else
      {
        confirmPswrdCtrl.setErrors(null);
      }
    }

   }

  
  
CreateUser(){
  var body={
    UserName:this.userModel.value.UserName,
    Email:this.userModel.value.Email,
    FullName:this.userModel.value.FullName,
    Password:this.userModel.value.Passwords?.Password,
    Role:this.userModel.value.Role
  };
 return this.http.post(this.rootURL+'/ApplicationUsers/Register',body);

}


getUserProfile(){
  
  return this.http.get(this.rootURL+'/UserProfile').subscribe(
    (res:any)=>{
      this.userDetails = res;
      console.log(this.userDetails.UserName)
    },
    (err)=>{
      console.log('Unable to Collect User')
    }
  );;
}

login(formData:any){
  const headers = new HttpHeaders({'Accept':'*/*'});
   
  return this.http.post(this.rootURL+'/ApplicationUsers/Login',formData,{ headers: headers } );
}

OnLogOut(){
    
  localStorage.removeItem('token');

  this.signInStatus = false;
  
  this.router.navigate(['/user/login']);

}

roleMatch(allowedRoles:any){
      var isMatch=false;
      var payload=JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
      var userRole=payload.role;
      allowedRoles.forEach(
        (element:any) =>{
        if(element==userRole){
          isMatch=true;
        }
      });

      return isMatch;

}

}
