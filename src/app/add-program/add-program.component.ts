import { Component, OnInit } from '@angular/core';
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse, FileUploadType } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ServiceSpec } from "src/model/common/service-spec.model";
import { Sector } from "src/model/common/sector.model";
import { PatientService } from "src/model/appointments/patient-service.model";
declare var $: any;
enum ServiceType {
  Package = 1,
  IndividualLabTest = 2,
  CommonService = 3,
}
@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.css']
})
export class AddProgramComponent implements OnInit {
  
  typeValidationForm: FormGroup;
  imgPreview;
  selectedFile: File;
  SessionLists;
  selectedServices = [];

  currentServiceList: ServiceSpec[] = [];
  packages: ServiceSpec[] = [];
  individualTests: ServiceSpec[] = [];
  commonServices: ServiceSpec[] = [];

  selectedServiceType: ServiceType = ServiceType.Package;
  selectedService: ServiceSpec;

  sectorList: Sector[] = [];
  selectedSector: Sector;

  finalServices: PatientService[] = [];
  

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getServiceSectors()
  }

  ngOnInit(): void {

    $('.onlypackage').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');

    this.formValidation();

    $(".edit_button").on("click", function () {
      console.log("Working");
    });
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      programName: ["", [Validators.required]],
      programNameArabic: ["", [Validators.required]],
      programDescription:["",[Validators.required]],
      programDescriptionArabic:["",[Validators.required]],
      programPrice:["",[Validators.required]],
      totalLevels:["",[Validators.required]],
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  handleFileInput(event) {
    this.selectedFile = event.files.item(0);
    if (event.files && event.files[0]) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imgPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  createSessionDate(e) {
    this.SessionLists = [];
    for (let index = 0; index < e.value; index++) {
      console.log(e.value);
      let params = {
        value : index
      }
      this.SessionLists.push(params);
    }
  }
  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }

  postProgramToServer(){

  }


  addService() {
    if (this.selectedSector != null && this.selectedService != null) {
      let patientService = new PatientService();
      patientService.selectedSector = this.selectedSector;
      patientService.selectedService = this.selectedService;
      this.selectedServices.push(patientService);
    }
    
  }

  removeService(index) {
    this.selectedServices.splice(index, 1);
  }

  getServiceListForSector(sectorId) {
    this._appService.getServiceListForSector(sectorId).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          if (sectorId == 1) {
            this.packages = ServiceSpec.getServicePackageList(response);
            this.individualTests = ServiceSpec.getIndividualTestList(response);
            if (this.selectedServiceType == ServiceType.Package) {
              this.currentServiceList = this.packages;
            } else {
              this.currentServiceList = this.individualTests;
            }
          } else {
            this.commonServices = ServiceSpec.getCommonServiceList(response);
            this.currentServiceList = this.commonServices;
          }
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }


  serviceSelected(event) {
    var selectedServiceId = event.value;
    this.selectedService = this.currentServiceList.find((currentService) => currentService.serviceId == selectedServiceId);
  }

  sectorChanged(event) {
    var sSectorId = event.value;
    this.selectedSector = this.sectorList.find((sector) => sector.sectorId == sSectorId);
    this.getServiceListForSector(sSectorId);
  }

  serviceChanged(event, selectedServiceType) {

    this.selectedServiceType = selectedServiceType;
      var sector = new Sector();
      sector.sectorId = 1;
      this.selectedSector = sector;
      if (this.packages.length == 0) {
        this.getServiceListForSector(1);
      } else {
        if (this.selectedServiceType == ServiceType.Package) {
          this.currentServiceList = this.packages;
        } else {
          this.currentServiceList = this.individualTests;
        }
      }
    
  }

  getServiceSectors() {
    this._appService.getSectorList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          var sectors = Sector.getSectorList(response);
          this.sectorList = sectors.filter(function (sector) {
            return sector.sectorId != 1;
          });
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

}
