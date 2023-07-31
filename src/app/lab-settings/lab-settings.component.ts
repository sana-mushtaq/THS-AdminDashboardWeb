import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

import { AlertType, APIResponse, PractiseUserRoles } from "src/utils/app-constants";
import Swal from "sweetalert2";
import * as moment from "moment";

declare var $: any;

@Component({
  selector: "app-lab-settings",
  templateUrl: "./lab-settings.component.html",
  styleUrls: ["./lab-settings.component.css"],
})
export class LabSettingsComponent implements OnInit {
  typeValidationForm: FormGroup;
  selectedGender = 1;
  submit: boolean;
  typesubmit: boolean;
  workStartTime;
  workEndTime;
  serviceDuration;
  serviceInterval;

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router, public formBuilder: FormBuilder) {
    this.getServiceProviderSettings();
  }

  ngOnInit(): void {
    $('.onlylabmenu').removeClass('dclass');
    var element = document.getElementById("nav_users");
    element.classList.add("active");
    this.formValidation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 1000);
  }

  drawPage() {
    $("#nav_users").addClass("active");
  }

  genderSelected(eventValue, selectedGender) {
    this.selectedGender = selectedGender;
  }

  bloodGroupChanged(event) {
    console.log(event.target.value);
  }

  // onClickCreateUser() {
  //   var firstName = $('#firstName').val();
  //   var firstNameArabic = $('#firstNameArabic').val();
  //   var lastName = $('#lastName').val();
  //   var lastNameArabic = $('#lastNameArabic').val();
  //   var emailId = $('#emailId').val();
  //   var mobile = $('#mobileNumber').val();
  //   var dob = $('#dobinput').val();

  //   dob = this.getFormattedDate(new Date(dob));

  //   var medicalLicenseNo = $('#medicalregno').val();
  //   var medicalLicenseExpiryDate = $('#medicallicence').val();
  //   var bloodGroup = $('#bloodGroup').val();

  //   let params = {
  //     "userRoleId": PractiseUserRoles.Nurse,
  //     "sectorId": 2,
  //     "firstName": firstName,
  //     "firstNameArabic": firstNameArabic,
  //     "lastName": lastName,
  //     "lastNameArabic": lastNameArabic,
  //     "emailId": emailId,
  //     "mobile": mobile,
  //     "nationality": "Saudi Arabia",
  //     "dob": dob,
  //     "gender": this.selectedGender,
  //     "userStatus": 0,
  //     "departmentId": 1,
  //     "employeeId": "LAB",
  //     "medicalLicenseNo": medicalLicenseNo,
  //     "medicalLicenseExpiryDate": medicalLicenseExpiryDate,
  //     "bloodGroup": "O +ive",
  //     "degree": "Masters",
  //     "designation": "Lab Technician"
  //   }
  //   this.postNewCareProviderStaff(params);
  // }

  postNewCareProviderStaff() {
    this.typesubmit = true;
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      let params = this.typeValidationForm.value;
      params["userRoleId"] = PractiseUserRoles.Nurse;
      params["gender"] = this.selectedGender;
      params["dob"] = moment(params.dob, "YYYY-MM-DD").format("DD-MM-YYYY");
      params["medicalLicenseExpiryDate"] = moment(params.medicalLicenseExpiryDate, "YYYY-MM-DD").format("DD-MM-YYYY");

      this._appService.postNewCareProviderStaff(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            Swal.fire("Success.", "New Staff is created successfully..!", "success");
            this.router.navigate(["../nurse"]);
          } else if (response.status == APIResponse.RecordExistAlready) {
            Swal.fire("Error.", "Mobile number exists already. Please verify given mobile number and try again..!", "error");
          } else {
            Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
        }
      );
    }
  }

  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return day + "-" + month + "-" + year;
  }

  getServiceProviderSettings() {
      this._appService.getServiceProviderSettings().subscribe((response: any) => {
          if (response.status == APIResponse.Success) {
            this.workStartTime = response.providerSettings[0].workStartTime;
            this.workEndTime = response.providerSettings[0].workEndTime;
            this.serviceDuration = response.providerSettings[0].slotDuration;
            this.serviceInterval = response.providerSettings[0].serviceInterval;
          } else {
              console.log("Unable to get appointments");
          }
      }, err => {
          console.log("Unable to get appointments");
      });   
  }
 
  updateServiceProviderSettings() {
      if (this.typeValidationForm.invalid) {
          // alert("working");
          return;
      }
      let params = this.typeValidationForm.value;
      this._appService.updateServiceProviderSettings(params).subscribe((response: any) => {
          if (response.status == APIResponse.Success) {
              Swal.fire("Success.", "Settings Updated successfully..!", "success");
            } else if (response.status == APIResponse.RecordExistAlready) {
              Swal.fire("Error.", "Mobile number exists already. Please verify given mobile number and try again..!", "error");
            } else {
              Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
            }
          },
          (err) => {
            Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
      });   
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      workStartTime: ["", [Validators.required]],
      workEndTime:["", [Validators.required]],
      serviceDuration:["", [Validators.required]],
      serviceInterval:["", [Validators.required]],
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }
}
