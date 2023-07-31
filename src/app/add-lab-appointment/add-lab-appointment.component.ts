import { Component, OnInit } from '@angular/core';
import { SelectorMatcher } from "@angular/compiler";
import { Select2OptionData } from "ng-select2";
import { PatientService } from "src/model/appointments/patient-service.model";
import { PatientUser } from "src/model/common/patient-user.model";
import { Sector } from "src/model/common/sector.model";
import { ServiceSpec } from "src/model/common/service-spec.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { APIResponse } from "src/utils/app-constants";
import Swal from "sweetalert2";
import * as moment from "moment";
import { Router } from "@angular/router";
declare var $: any;

enum ServiceType {
  Package = 1,
  IndividualLabTest = 2,
  CommonService = 3,
}
@Component({
  selector: 'app-add-lab-appointment',
  templateUrl: './add-lab-appointment.component.html',
  styleUrls: ['./add-lab-appointment.component.css']
})
export class AddLabAppointmentComponent implements OnInit {
  sectorList: Sector[] = [];
  selectedSector: Sector;
  packages: ServiceSpec[] = [];
  individualTests: ServiceSpec[] = [];
  commonServices: ServiceSpec[] = [];

  primaryPatient: PatientUser;
  dependents: PatientUser[] = [];
  patients: PatientUser[] = [];
  selectedServiceType: ServiceType = ServiceType.Package;

  currentServiceList: ServiceSpec[] = [];

  selectedService: ServiceSpec;
  selectedPatient: PatientUser;
  selectedLab

  selectedServices: PatientService[] = [];
  finalServices: PatientService[] = [];

  LabLists;

  finalServiceQuote: any;
  finalServiceCost: 0.0;

  isInvalidPrimaryUser = true;
  isFormInvalid = true;

  modaldependents;
  DependentCount:0;

  constructor(private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService, private router: Router) {
    this.getServiceSectors();
    this.getLabListData();
  }  

  ngOnInit(): void {
    this.selectedServiceType = ServiceType.Package;
    this.initUI();
    $(".view_details_btn").click(function () {
      $(".view_details").show();
    });
    $("#summary_close_btn").click(function () {
      $(".view_details").hide();
    });
    $('.onlyadmin').removeClass('dclass');
  }

  patientSearchClicked() {
    var patientMobileNumber = $("#patient_mobile").val();
    if (patientMobileNumber.trim() != "" && patientMobileNumber.trim().length == 9) {
      this.searchPatient(patientMobileNumber.trim());
    } else {
      Swal.fire("Error.", "Please enter a valid mobile number..!", "error");
    }
  }

  primaryPatientSelected(patient) {
    this.primaryPatient = patient;
    this.isInvalidPrimaryUser = false;
    $("#patient_name").val(this.primaryPatient.firstName + " " + this.primaryPatient.lastName);
    $("#patient_email").val(this.primaryPatient.emailId);
    $("#patient_nationalid").val(this.primaryPatient.nationalId);
    $("#patient_dob").val(this.primaryPatient.dob);
    this.getDepedents(this.primaryPatient.userId);
  }

  serviceChanged(event, selectedServiceType) {
    if (
      (selectedServiceType == ServiceType.Package || selectedServiceType == ServiceType.IndividualLabTest) &&
      this.selectedServiceType == ServiceType.CommonService
    ) {
      this.selectedServices = [];
      this.finalServices = [];
    } else if (
      (this.selectedServiceType == ServiceType.Package || this.selectedServiceType == ServiceType.IndividualLabTest) &&
      selectedServiceType == ServiceType.CommonService
    ) {
      this.selectedServices = [];
      this.finalServices = [];
    }

    this.selectedServiceType = selectedServiceType;
    if (this.selectedServiceType == ServiceType.Package || this.selectedServiceType == ServiceType.IndividualLabTest) {
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
  }

  sectorChanged(event) {
    var sSectorId = event.value;
    this.selectedSector = this.sectorList.find((sector) => sector.sectorId == sSectorId);
    this.getServiceListForSector(sSectorId);
  }

  patientSelected(event) {
    var seletedPatientId = event.value;
    this.selectedPatient = this.dependents.find((dependent) => dependent.userId == seletedPatientId);
  }

  serviceSelected(event) {
    var selectedServiceId = event.value;
    this.selectedService = this.currentServiceList.find((currentService) => currentService.serviceId == selectedServiceId);
  }

  addService() {
    if (this.selectedSector != null && this.selectedService != null && this.selectedPatient != null) {
      let patientService = new PatientService();
      patientService.selectedSector = this.selectedSector;
      patientService.selectedPatient = this.selectedPatient;
      patientService.selectedService = this.selectedService;
      this.selectedServices.push(patientService);
    }
  }

  removeService(index) {
    this.selectedServices.splice(index, 1);
  }

  searchPatient(patientMobileNumber: string) {
    this._appService.searchPatient(patientMobileNumber).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.patients = PatientUser.getPatientList(response);
          this.DependentCount = response.dependantCount;
        } else {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }

  serviceSelectionCompleted() {
    this.finalServices = [...this.finalServices, ...this.selectedServices];
    this.selectedServices = [];
    this.calculateServiceCost();
    this.closeNewServiceModel();
  }

  deleteFinanlizedService(index) {
    this.finalServices.splice(index, 1);
    this.calculateServiceCost();
  }

  paymentDetailsChanged(value) {
    var collectedAmount = $("#service_paidamount").val();
    var paymentReference = $("#payment_reference").val();

    if (collectedAmount.trim() == "" || paymentReference.trim() == "" || this.finalServiceQuote == null || this.primaryPatient == null) {
      this.isFormInvalid = true;
    } else {
      this.isFormInvalid = false;
    }
  }

  getDepedents(primaryPatientId: string) {
    this._appService.getDependentsForPatient(primaryPatientId).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.dependents = PatientUser.getDependentList(response);
          this.dependents.push(this.primaryPatient);
        } else {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
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

  calculateServiceCost() {
    var selectedServices = [];
    this.finalServices.forEach((patientService) => {
      var service = {
        serviceType: patientService.selectedService.serviceType,
        serviceId: patientService.selectedService.serviceId,
        serviceCount: 1,
      };
      selectedServices.push(service);
    });

    var quoteParams = {
      userId: this.selectedPatient.userId,
      servicePrimarySectorId: this.selectedSector.sectorId,
      selectedServices: selectedServices,
    };
    this._appService.getServiceQuote(quoteParams).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          if (response.serviceProviders != null && response.serviceProviders.length > 0) {
            this.finalServiceQuote = response.serviceProviders[0].costDetails;
            this.finalServiceCost = this.finalServiceQuote.totalCost;
          } else {
            this.finalServiceQuote = null;
            this.finalServiceCost = 0.0;
            Swal.fire("Error.", "Unable to get the service costing. Please try again later..!", "error");
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

  confirmAppointment() {
    var serviceDate = $("#service_date").val();
    var serviceTime = $("#service_time").val();
    var serviceAddress = $("#service_address").val();
    var collectedAmount = $("#service_paidamount").val();
    var paymentReference = $("#payment_reference").val();

    serviceDate = moment(serviceDate, "YYYY-MM-DD").format("DD/MM/YYYY");

    var selectedFinalServices = [];
    this.finalServices.forEach((patientService) => {
      var service = {
        serviceType: patientService.selectedService.serviceType,
        serviceId: patientService.selectedService.serviceId,
        serviceCategoryId: patientService.selectedService.serviceCategoryId,
        patientIds: [patientService.selectedPatient.userId],
        serviceCount: 1,
      };
      selectedFinalServices.push(service);
    });

    var confirmAppointmentParams = {
      userId: this.primaryPatient.userId,
      authToken: "dfkdhk234364hjkhsd",
      servicePrimarySectorId: this.selectedSector.sectorId,
      serviceProviderId: this.selectedLab,
      serviceDate: serviceDate,
      serviceTime: serviceTime,
      serviceOption: 3,
      quoteId: this.finalServiceQuote.quoteId,
      paymentReferenceId: paymentReference,
      paymentAmount: collectedAmount,
      lat: 0.0,
      lng: 0.0,
      address: serviceAddress,
      selectedServices: selectedFinalServices,
      paymentMethod: 2,
    };

    debugger;

    this._appService.confirmAppointment(confirmAppointmentParams).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          var appointmentId = response.appointmentId;
          this.router.navigate(["../appointments"]);
          Swal.fire("Congratulations.", "Appointment has been booked successfully. Appointment Number : APP" + appointmentId, "success");
        } else {
          Swal.fire("Error.", "There was an error in booking an appointment. Please try again later..!", "error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  chooseServiceClicked() {
    $("#newServiceModel").show();
  }

  closeNewServiceModel() {
    $("#newServiceModel").hide();
  }

  initUI() {
    $("#my-select").multiSelect();
    $("input.timepicker").timepicker({
      timeFormat: "hh:mm p",
      interval: 15,
    });

    $(document).ready(function () {
      $(".js-example-matcher").select2({
        dropdownParent: $("#exampleModal"),
      });
    });
  }

  getLabListData() {
    this._appService.getServiceProviderList().subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
            this.LabLists = response.serviceProviderList;
        } else {
            console.log("Unable to get appointments");
        }
    }, err => {
        console.log("Unable to get appointments");
    });   
  }
  changeSelectedLab(e) {
    alert(e.value);
    this.selectedLab = e.value;
  }
  ViewDependentList(e) {
    this._appService.getDependentsForPatient(e).subscribe(
      (response: any) => {
        debugger
        if (response.status == APIResponse.Success) {
          this.modaldependents = PatientUser.getDependentList(response);
        } else {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
    $("#viewDependentModel").show(); 
  }

  close() {
    $('.modal').hide();
  }

}
