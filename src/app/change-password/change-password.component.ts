import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse,FileUploadType } from 'src/utils/app-constants';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router, public formBuilder: FormBuilder) 
  {

  }

  typeValidationForm: FormGroup;

  ngOnInit(): void {
    $(".onlylabmenu").removeClass("dclass");
    this.formValidation();
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
        oldPassword: ["", [Validators.required]],
        newPassword:["",[Validators.required]],
        confNewPassword:["", [Validators.required]],
    });
  }
  get type() {
      return this.typeValidationForm.controls;
  }

  changePassword() {
    if (this.typeValidationForm.invalid) {
        // alert("working");
        return;
    }
    let params = this.typeValidationForm.value;

    this._appService.changePasswordLab(params).subscribe((response: any) => {            
      if (response.status == APIResponse.Success) {
          Swal.fire('Password Changed Successfully!', '', 'success')
      } else {
        // this.closeNewServiceView();
        Swal.fire('Something Went Wrong !! Try Again', '', 'info')
      }
    });
  }

}
