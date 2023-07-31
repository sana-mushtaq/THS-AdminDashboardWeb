import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AlertType, APIResponse, PractiseUserRoles } from 'src/utils/app-constants';
import Swal from 'sweetalert2';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-add-technician',
  templateUrl: './add-technician.component.html',
  styleUrls: ['./add-technician.component.css']
})
export class AddTechnicianComponent implements OnInit {

  typeValidationForm: FormGroup;
  selectedGender = 1;
  submit: boolean;
  typesubmit: boolean;
  modalTitle: string;

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    private router: Router,
    public formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    $('#myBtn').click(function () {
      $('#myModal').show();
    })
    $('.close').click(function () {
      $('#myModal').hide();
    })
    $('.ok').click(function () {
      $('#myModal').hide();
    })

    this.formValidation();
    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-technician').addClass('active');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 1000)
  }

  drawPage() {
    $('#nav_users').addClass('active');
  }

  genderSelected(eventValue, selectedGender) {
    this.selectedGender = selectedGender;
  }


  postNewCareProviderStaff() {
    this.typesubmit = true;
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      let params = this.typeValidationForm.value;
      params["userRoleId"] = PractiseUserRoles.LabTech
      params["gender"] = this.selectedGender
      params["dob"] = moment(params.dob, 'YYYY-MM-DD').format('DD-MM-YYYY');
      params["medicalLicenseExpiryDate"] = moment(params.medicalLicenseExpiryDate, 'YYYY-MM-DD').format('DD-MM-YYYY');

      this._appService.postNewCareProviderStaff(params).subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire(
            'Success.',
            'New Staff is created successfully..!',
            'success'
          );
          this.router.navigate(['../technician']);
        } else if (response.status == APIResponse.RecordExistAlready) {
          Swal.fire(
            'Error.',
            'Mobile number exists already. Please verify given mobile number and try again..!',
            'error'
          );
        } else {
          Swal.fire(
            'Error.',
            'Something went wrong. Please try again..!',
            'error'
          );
        }
      }, err => {
        Swal.fire(
          'Error.',
          'Something went wrong. Please try again..!',
          'error'
        );
      });
    }
  }


  bloodGroupChanged(event) {
    console.log(event.target.value);
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      userRoleId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      sectorId: ['2'],
      firstName: ['', [Validators.required]],
      firstNameArabic: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      lastNameArabic: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      code: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: [this.selectedGender],
      userStatus: ['0'],
      departmentId: ['1'],
      employeeId: ['LAB'],
      medicalLicenseNo: ['', [Validators.required]],
      medicalLicenseExpiryDate: ['', [Validators.required]],
      bloodGroup: [''],
      degree: ['', [Validators.required]],
      languagesSpoken: ['', [Validators.required]],
      languagesSpokenArabic: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      experienceArabic: ['', [Validators.required]],
      designation: ['']
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  // technicianEdit(userId) {
  //   debugger;
  //   this.modalTitle = 'Edit Technician';

  //   let selectedpractiseUsers = this.practiseUsers.find(PractiseUser => PractiseUser.userId == userId);
  //   if(selectedpractiseUsers != null) {
  //     this.typeValidationForm.patchValue({

  //     userRoleId: [''],
  //     title: [''],
  //     sectorId: [''],
  //     firstName: selectedpractiseUsers.firstName,
  //     firstNameArabic: [''],
  //     lastName: selectedpractiseUsers.lastName,
  //     lastNameArabic: [''],
  //     emailId: selectedpractiseUsers.email,
  //     code: [''],
  //     mobile: selectedpractiseUsers.mobile,
  //     nationality: [''],
  //     dob: selectedpractiseUsers.dob,
  //     gender: selectedpractiseUsers.gender,
  //     userStatus: ['0'],
  //     departmentId: ['1'],
  //     employeeId: ['LAB'],
  //     medicalLicenseNo: [''],
  //     medicalLicenseExpiryDate: [''],
  //     bloodGroup: selectedpractiseUsers.bloodGroup,
  //     degree: [''],
  //     languagesSpoken: [''],
  //     languagesSpokenArabic: [''],
  //     experience: [''],
  //     experienceArabic: [''],
  //     designation: ['']

  //     });

  //   }
  // }


}




// IN parctiseUserId INT,
// IN userRoleId INT,
// IN sectorId INT,
// IN firstName varchar(45),
// IN firstNameArabic varchar(45),
// IN lastName varchar(45),
// IN lastNameArabic varchar(45),
// IN emailId varchar(45),
// IN mobile varchar(45),
// IN nationality varchar(45),
// IN dob varchar(45),
// IN gender INT,
// IN userStatus INT,
// IN departmentId INT,
// IN employeeId INT,
// IN medicalLicenseNo varchar(45),
// IN medicalLicenseExpiryDate varchar(45),
// IN bloodGroup varchar(45),
// IN degree varchar(45),
// IN designation varchar(45)