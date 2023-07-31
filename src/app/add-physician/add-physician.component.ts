import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { APIResponse, PractiseUserRoles } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: "app-add-physician",
  templateUrl: "./add-physician.component.html",
  styleUrls: ["./add-physician.component.css"],
})
export class AddPhysicianComponent implements OnInit {
  typeValidationForm: FormGroup;
  selectedGender = 1;
  submit: boolean;
  typesubmit: boolean;

  selectedBooldGroup;
  seletedDegree;

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router, public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    $("#nav_users").addClass("active");
    $("#myBtn").click(function () {
      $("#myModal").show();
    });
    $(".close").click(function () {
      $("#myModal").hide();
    });
    $(".ok").click(function () {
      $("#myModal").hide();
    });
    this.formValidation();
    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-physician').addClass('active');
  }

  bloodGroupChanged(event) {
    this.selectedBooldGroup = event.target.value;
  }

  degreeChanged(event) {
    this.seletedDegree = event.target.value;
  }

  genderSelected(eventValue, selectedGender) {
    this.selectedGender = selectedGender;
  }

  // onClickCreateUser() {
  //   var firstName = $('#firstName').val();
  //   var firstNameArabic = $('#firstNameArabic').val();
  //   var lastName = $('#lastName').val();
  //   var lastNameArabic = $('#lastNameArabic').val();
  //   var emailId = $('#emailId').val();
  //   var mobile = $('#mobileNumber').val();
  //   var dob = $('#dobinput').val().toString();

  //   dob = this.getFormattedDate(new Date(dob));

  //   var medicalLicenseNo = $('#medicalregno').val();

  //   let licenseExpiry = $('#medicallicence').val().toString();
  //   var medicalLicenseExpiryDate = this.getFormattedDate(new Date(licenseExpiry));

  //   let params = {
  //     "userRoleId": PractiseUserRoles.GeneralPhysician,
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
  //     "bloodGroup": this.selectedBooldGroup,
  //     "degree": this.seletedDegree,
  //     "designation": "Physiotherapist"
  //   }
  //   this.postNewCareProviderStaff(params);
  // }

  postNewCareProviderStaff() {
    this.typesubmit = true;
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      let params = this.typeValidationForm.value;
      params["userRoleId"] = PractiseUserRoles.GeneralPhysician;
      params["gender"] = this.selectedGender;
      params["dob"] = moment(params.dob, "YYYY-MM-DD").format("DD-MM-YYYY");
      params["medicalLicenseExpiryDate"] = moment(params.medicalLicenseExpiryDate, "YYYY-MM-DD").format("DD-MM-YYYY");

      this._appService.postNewCareProviderStaff(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            Swal.fire("Success.", "New Staff is created successfully..!", "success");
            this.router.navigate(["../general-physician"]);
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

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      userRoleId: ["", [Validators.required]],
      title: ["", [Validators.required]],
      sectorId: ["2"],
      firstName: ["", [Validators.required]],
      firstNameArabic: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      lastNameArabic: ["", [Validators.required]],
      emailId: ["", [Validators.required]],
      code: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      nationality: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      gender: [this.selectedGender],
      userStatus: ["0"],
      departmentId: ["1"],
      employeeId: ["LAB"],
      medicalLicenseNo: ["", [Validators.required]],
      medicalLicenseExpiryDate: ["", [Validators.required]],
      bloodGroup: [""],
      degree: ["", [Validators.required]],
      languagesSpoken: ["", [Validators.required]],
      languagesSpokenArabic: ["", [Validators.required]],
      experience: ["", [Validators.required]],
      experienceArabic: ["", [Validators.required]],
      designation: [""],
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }
}
