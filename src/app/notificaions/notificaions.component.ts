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
  

  constructor(
    private _appService: AppService, 
    private _appUtil: UtilService, 
    private router: Router,
    private _appDataService: AppDataService
  ) {
    this.getPaitentsList();
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
  
  

}
