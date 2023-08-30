import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Component, OnInit } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { Patient } from "src/model/common/patient.model";
import { PatientSource } from "src/model/patientSource/patient-source.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse } from "src/utils/app-constants";
import { Router } from "@angular/router";
import { AppDataService } from "src/service/app-data.service";
import { Subject, takeUntil } from "rxjs";
import { NgxSummernoteModule } from 'ngx-summernote';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export enum NotificationMedium {
  Whatsapp = 1,
  Sms = 2,
  Mail = 3,
  Push = 2,
}

export enum NotificationType {
  Individual = 1,
  Group = 2,
}

declare var $: any;
@Component({
  selector: 'app-notificaions',
  templateUrl: './notificaions.component.html',
  styleUrls: ['./notificaions.component.css']
})
export class NotificaionsComponent implements OnInit {

  dropdownList = [];
  dropdownSettings:IDropdownSettings={};
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      image: [
        ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeMedia']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['customButtons', ['testBtn']],
    ],

    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };
  // Notification form
  public notificationForm : FormGroup;
  

  constructor(
    private _appService: AppService, 
    private _appUtil: UtilService, 
    private router: Router,
    private _appDataService: AppDataService,
    private _formBuilder : FormBuilder
  ) {
    this.getPaitentsList();
    // Create Notification Form
    this.notificationForm = this._formBuilder.group({
      title : ['', [Validators.required]],
      title_ar : ['', [Validators.required]],
      description : ['', [Validators.required]],
      description_ar : ['', [Validators.required]],
      patients : [[]],
    });
  }

  actualpatientList: Patient[] = [];
  notificationType;
  notificationTo = 2;

  ngOnInit(): void {
    $('.onlyadmin').removeClass('dclass');
    this.dropdownList = this.actualpatientList
    this.dropdownSettings = {
      idField: 'patientId',
      textField: 'searchName',
      allowSearchFilter: true
    };
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   $("#summernote").summernote();
    // }, 2500);
  }
  

  getPaitentsList() {
    $("#example").DataTable().destroy();
    this._appService.getPatientsList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.actualpatientList = Patient.getPatientsListforSearch(response);       
          this.dropdownList = this.actualpatientList   
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  closeModal() {
    $('#add_department').hide();
  }

  NotificationTypeChange(e) {
    // console.log(e.value);
    this.notificationType = e.value;
  }

  NotificationTo(e) {
    this.notificationTo = e.value;
  }
  
  // Send Notification
  onSendNotification(){
    
    // Check form validation
    if( this.notificationForm.invalid ){
      this.notificationForm.markAllAsTouched();
      return;
    }

    // Check Notification Type
    switch ( parseInt( this.notificationType ) ) {

      // Send Whatsapp Notification
      case NotificationMedium.Whatsapp:
        this.sendWhatsappNotification();
        break;
    
      default:
        break;

    }

  }

  sendWhatsappNotification(){
    // Send Whatsapp Notification To Individual
    if( this.notificationTo == 1 ){
      // Check if patient list is empty
      if( this.notificationForm.value.patients.length == 0 ){
        Swal.fire('Error', 'Select atleast one patient', 'error');
        return
      }

      const data = this.notificationForm.value;
      this._appService.sendWhatsappNotification( data ).subscribe({
        next: (res : any) => {
          let message = 'Message sent successfully;';
          message += '<br>Success: '+res.success.length;
          if( res.failed.length > 0 ){
            message += '<br>Failed: '+res.failed.length;
            message += '<br>Failed Reason:<br> Missing Phone Number';
          }
          Swal.fire('Success', message, 'success')
        },
        error: (err : any) => {Swal.fire('Error', err.error.message, 'error')}
      });
    }
  }
}
