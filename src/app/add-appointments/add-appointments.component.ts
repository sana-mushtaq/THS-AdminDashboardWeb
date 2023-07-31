import { SelectorMatcher } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
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
  selector: "app-add-appointments",
  templateUrl: "./add-appointments.component.html",
  styleUrls: ["./add-appointments.component.css"],
})
export class AddAppointmentsComponent implements OnInit {
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

  selectedServices: PatientService[] = [];
  finalServices: PatientService[] = [];

  finalServiceQuote: any;
  finalServiceCost: 0.0;

  isInvalidPrimaryUser = true;
  isFormInvalid = true;

  modaldependents;
  DependentCount:0;

  constructor(private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService, private router: Router) {
    this.getServiceSectors();
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
        debugger
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
      serviceProviderId: 1,
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

    // $(".patient_select").click(function () {
    //   $("#patient_name").val("Mohammad");
    //   $("#patient_email").val("mohammad@gmail.com");
    //   $("#patient_nationalid").val("5401234");
    //   $("#patient_dob").val("01-01-2022");
    // });

    $(document).ready(function () {
      $(".js-example-matcher").select2({
        dropdownParent: $("#exampleModal"),
      });
    });

    // $("#add_service").click(function () {
    //   $(document).ready(function () {
    //     var max_fields = 10; //maximum input boxes allowed
    //     var wrapper = $("#service_add"); //Fields wrapper
    //     var add_button = $(".add_field_button"); //Add button ID

    //     var x = 1;

    //     if (x < max_fields) {
    //       x++; //text box increment
    //       $(wrapper).append(
    //         '<tr><td>1</td><td><select class="form-control js-example-basic-single" style="font-size:12px ! important;width:75% ! important;"><option>Select Service</option><option>Other Department</option><option>Other Department</option></select></td><td>540</td><td><select class="form-control table_select_appoint js-example-basic-single" style="font-size:12px ! important;width:75% ! important;"><option>Select Patient</option><option>Other Department</option><option>Other Department</option></select></td><td><button type="button" class="btn btn-primary remove_service_row" style="font-size:12px !important;margin-left:10px !important" >Remove</button></td></tr>'
    //       );
    //     }
    //     $(wrapper).on("click", ".remove_service_row", function (e: { preventDefault: () => void }) {
    //       console.log("Working");
    //       e.preventDefault();
    //       $(this).parent().parent("tr").remove();
    //       x--;
    //     });
    //   });
    // });
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
