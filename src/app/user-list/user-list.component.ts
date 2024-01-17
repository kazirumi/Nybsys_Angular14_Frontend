import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';

import {  inject, TemplateRef } from '@angular/core';

import { ModalDismissReasons, NgbActiveModal, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-list',
  templateUrl: './user-list.component.html',
  styles: []
})
export class UserListComponent implements OnInit {

  constructor(public userService:UserService,public toastr:ToastrService) { }

  ngOnInit(): void {
    this.userService.getAllUser();
  }

  get f(){
    return this.userService.userModel.controls;
  }
  deleteUser(user_id:string){
    
    let allow=confirm("Are you sure to delete");
    
    if(allow)
    this.userService.deleteUser(user_id).subscribe(
      (res:any)=>{
          this.toastr.success(' User deleted','Delete Successful');
          this.userService.getAllUser();
      },
      err=>{
        console.log(err);
      }
    );
  }


  private modalService = inject(NgbModal);

 modalRef:NgbActiveModal;
  onSubmit(content:TemplateRef<any>){
      this.userService.editUser().subscribe(res=>{
          this.toastr.success(' User Edit','Edit Successful');
          this.userService.getAllUser();
          this.modalRef.close();
        },
        (err) => {
          console.log('Unable Edit User');
        }
      );

  }

  onEditUser(content: TemplateRef<any>,user:User){
    this.openModal(content);
    this.userService.userModel.patchValue({
      Id:user.Id,
      UserName:user.UserName,
      FullName:user.FullName,
      Email:user.Email
    });
  }
	openModal(content: TemplateRef<any>,) {
		this.modalRef=this.modalService.open(content, { centered: true ,backdrop:false});
	}


}
