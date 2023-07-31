import * as moment from "moment";
import { AppointmentStageMessages, AppointmentStages, AppointmentStatus } from "src/utils/app-constants";
import { Patient } from "../common/patient.model";
import { Price } from "../common/price.model";
import { Service } from "../common/service.model";
import { SpStaff } from "../common/sp-staff.model";
import { UtilService } from "src/utils/util.service";

export class Appointment {
  appointmentId: string;
  serviceSectorId: number;
  serviceName: string;
  serviceGender: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentBookingStatus: number;
  appointmentCurrentStatus: number;
  appointmentBookingDate: string;

  appointmentBookingDateTime: string;
  servicePrice: string;

  primaryPatientFirstName: string;
  primaryPatientLastName: string;
  patientMobile: string;
  patientEmail: string;
  appointmentDisplayId: string;

  appointmentStatusMessage: string;
  appointmentStage: string;
  patientSource: string;
  packageName: string;

  providerFirstName: string;
  providerLastName: string;

  resultReadingRequestDate: string;
  resultReadingStatus: string;

  corpEmpId: string;
  employeerName: string;

  createdDate: string;
  serviceCost: string;
  homeVisitCost: string;
  discounts: string;
  vat: string;
  totalServiceCost: string;
  pendingSync: number;
  providerName: string;
  serviceProviderId: number;
  city: string;
  serviceProviderName: string;
  address: string;

  insuranceName: string;
  insuranceNameArabic: string;
  insuranceLogoPath: string;

  paymentReferenceId : string;
  paymentUrl : String;
  paymentStatus : String;
  paymentMethod : String;
  refSourceName : String;

  static getAppointmentList(appointments): Appointment[] {
    var appointmentList: Array<Appointment> = [];
    if (appointments == null) {
      return appointmentList;
    }
    appointments.forEach((data) => {
      var appointment = new Appointment();
      appointment.appointmentId = data["appointmentId"];
      appointment.paymentReferenceId = data["paymentReferenceId"];
      appointment.paymentUrl = data["paymentUrl"];
      appointment.paymentStatus = data["paymentStatus"];
      appointment.serviceSectorId = data["serviceSectorId"];
      appointment.appointmentDisplayId = "APP" + appointment.appointmentId;
      appointment.serviceName = data["sectorName"] + " - Home visit";
      appointment.appointmentBookingStatus = data["appointmentStatus"];
      appointment.appointmentCurrentStatus = data["appointmentCurrentStatus"];
      appointment.patientSource = data["sourceName"];
      appointment.refSourceName = data["refSourceName"];
      appointment.paymentMethod = data["paymentMethod"];

      switch (appointment.appointmentBookingStatus) {
        case AppointmentStatus.Completed:
          appointment.appointmentStatusMessage = "Open";
          break;
        case AppointmentStatus.Cancelled:
          appointment.appointmentStatusMessage = "Cancelled";
          break;
        default:
          break;
      }

      switch (appointment.appointmentCurrentStatus) {
        case AppointmentStages.NotPaid:
          appointment.appointmentStage = AppointmentStageMessages.NotPaid;
          break;
        case AppointmentStages.Accpeted:
          appointment.appointmentStage = AppointmentStageMessages.Accpeted;
          break;
        case AppointmentStages.ArrivedDesination:
          appointment.appointmentStage = AppointmentStageMessages.ArrivedDesination;
          break;
        case AppointmentStages.ServiceCompleted:
          if (appointment.serviceSectorId == 1) {
            appointment.appointmentStage = AppointmentStageMessages.CollectionCompleted;
          } else {
            appointment.appointmentStage = AppointmentStageMessages.ServiceCompleted;
          }
          break;
        case AppointmentStages.ServiceInProgress:
          appointment.appointmentStage = AppointmentStageMessages.CollectionInProgress;
          break;
        case AppointmentStages.OnTheWay:
          appointment.appointmentStage = AppointmentStageMessages.OnTheWay;
          break;
        case AppointmentStages.ResultPublished:
          appointment.appointmentStage = AppointmentStageMessages.ResultPublished;
          break;
        case AppointmentStages.SampleSubmittedToLab:
          appointment.appointmentStage = AppointmentStageMessages.SampleSubmittedToLab;
          break;
        case AppointmentStages.Scheduled:
          appointment.appointmentStage = AppointmentStageMessages.Scheduled;
          break;
        default:
          break;
      }

      var gender = data["serviceOption"];
      if (gender == "1") {
        appointment.serviceGender = "Male";
      } else if (gender == "2") {
        appointment.serviceGender = "Female";
      } else {
        appointment.serviceGender = "Any";
      }

      appointment.servicePrice = data["servicePrice"];

      var serviceDate = data["serviceDate"];
      appointment.appointmentDate = moment(serviceDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");

      appointment.appointmentTime = UtilService.time24hourTo12Hours(data["serviceTime"]);

      appointment.primaryPatientFirstName = data["primaryPatientName"];
      appointment.primaryPatientLastName = data["lastName"];
      appointment.address = data["address"];

      var resultReadingRequestDate = data["resultReadingRequestDate"];
      if (resultReadingRequestDate != null) {
        appointment.resultReadingRequestDate = moment(resultReadingRequestDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      }

      var bookingDate = data["createdDate"];
      appointment.appointmentBookingDate = moment(bookingDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY hh:mm a");
      appointment.patientEmail = data["email"];
      appointment.patientMobile = data["mobile"];
      appointment.providerFirstName = data["providerFirstName"];
      appointment.providerLastName = data["providerLastName"];
      appointment.patientMobile = data["mobileNumber"];

      appointmentList.push(appointment);
    });
    return appointmentList;
  }

  static getServiceAppointmentList(appointments): Appointment[] {
    var appointmentList: Array<Appointment> = [];
    if (appointments == null) {
      return appointmentList;
    }
    appointments.forEach((data) => {
      var appointment = new Appointment();
      appointment.appointmentId = data["appointmentId"];
      appointment.serviceSectorId = data["serviceSectorId"];
      appointment.appointmentDisplayId = "APP" + appointment.appointmentId;
      appointment.serviceName = data["sectorName"] + " - Home visit";
      appointment.appointmentBookingStatus = data["appointmentStatus"];
      appointment.appointmentCurrentStatus = data["appointmentCurrentStatus"];
      appointment.patientSource = data["sourceName"];
      appointment.employeerName = data["employeerName"];
      appointment.corpEmpId = data["corpEmpId"];
      appointment.packageName = data["packageName"] + " - Home visit";
      appointment.city = data["city"];
      appointment.serviceProviderName = data["serviceProviderName"];

      switch (appointment.appointmentBookingStatus) {
        case AppointmentStatus.Completed:
          appointment.appointmentStatusMessage = "Open";
          break;
        case AppointmentStatus.Cancelled:
          appointment.appointmentStatusMessage = "Cancelled";
          break;
        default:
          break;
      }

      switch (appointment.appointmentCurrentStatus) {
        case AppointmentStages.Accpeted:
          appointment.appointmentStage = AppointmentStageMessages.Accpeted;
          break;
        case AppointmentStages.ArrivedDesination:
          appointment.appointmentStage = AppointmentStageMessages.ArrivedDesination;
          break;
        case AppointmentStages.ServiceCompleted:
          appointment.appointmentStage = AppointmentStageMessages.CollectionCompleted;
          break;
        case AppointmentStages.ServiceInProgress:
          appointment.appointmentStage = AppointmentStageMessages.CollectionInProgress;
          break;
        case AppointmentStages.OnTheWay:
          appointment.appointmentStage = AppointmentStageMessages.OnTheWay;
          break;
        case AppointmentStages.ResultPublished:
          appointment.appointmentStage = AppointmentStageMessages.ResultPublished;
          break;
        case AppointmentStages.SampleSubmittedToLab:
          appointment.appointmentStage = AppointmentStageMessages.SampleSubmittedToLab;
          break;
        case AppointmentStages.Scheduled:
          appointment.appointmentStage = AppointmentStageMessages.Scheduled;
          break;
        default:
          break;
      }

      var gender = data["serviceOption"];
      if (gender == "1") {
        appointment.serviceGender = "Male";
      } else if (gender == "2") {
        appointment.serviceGender = "Female";
      } else {
        appointment.serviceGender = "Any";
      }

      appointment.servicePrice = data["servicePrice"];

      var serviceDate = data["serviceDate"];
      appointment.appointmentDate = moment(serviceDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");

      appointment.appointmentTime = UtilService.time24hourTo12Hours(data["serviceTime"]);

      appointment.primaryPatientFirstName = data["patientFirstName"];
      appointment.primaryPatientLastName = data["patientLastName"];

      var resultReadingRequestDate = data["resultReadingRequestDate"];
      if (resultReadingRequestDate != null) {
        appointment.resultReadingRequestDate = moment(resultReadingRequestDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      }

      var bookingDate = data["createdDate"];
      appointment.appointmentBookingDate = moment(bookingDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY hh:mm a");
      appointment.patientEmail = data["email"];
      appointment.patientMobile = data["mobileNumber"];

      appointmentList.push(appointment);
    });
    return appointmentList;
  }

  static getReportDetailList(appointments): Appointment[] {
    var appointmentList: Array<Appointment> = [];
    if (appointments == null) {
      return appointmentList;
    }
    appointments.forEach((data) => {
      var appointment = new Appointment();
      appointment.appointmentId = data["appointmentId"];
      appointment.serviceSectorId = data["serviceSectorId"];
      appointment.appointmentDisplayId = "APP" + appointment.appointmentId;
      appointment.serviceName = data["sectorName"] + " - Home visit";
      appointment.appointmentBookingStatus = data["appointmentStatus"];
      appointment.appointmentCurrentStatus = data["appointmentCurrentStatus"];
      appointment.patientSource = data["sourceName"];
      appointment.employeerName = data["employeerName"];
      appointment.corpEmpId = data["corpEmpId"];
      appointment.packageName = data["packageName"] + " - Home visit";

      switch (appointment.appointmentBookingStatus) {
        case AppointmentStatus.Completed:
          appointment.appointmentStatusMessage = "Open";
          break;
        case AppointmentStatus.Cancelled:
          appointment.appointmentStatusMessage = "Cancelled";
          break;
        default:
          break;
      }

      switch (appointment.appointmentCurrentStatus) {
        case AppointmentStages.Accpeted:
          appointment.appointmentStage = AppointmentStageMessages.Accpeted;
          break;
        case AppointmentStages.ArrivedDesination:
          appointment.appointmentStage = AppointmentStageMessages.ArrivedDesination;
          break;
        case AppointmentStages.ServiceCompleted:
          appointment.appointmentStage = AppointmentStageMessages.CollectionCompleted;
          break;
        case AppointmentStages.ServiceInProgress:
          appointment.appointmentStage = AppointmentStageMessages.CollectionInProgress;
          break;
        case AppointmentStages.OnTheWay:
          appointment.appointmentStage = AppointmentStageMessages.OnTheWay;
          break;
        case AppointmentStages.ResultPublished:
          appointment.appointmentStage = AppointmentStageMessages.ResultPublished;
          break;
        case AppointmentStages.SampleSubmittedToLab:
          appointment.appointmentStage = AppointmentStageMessages.SampleSubmittedToLab;
          break;
        case AppointmentStages.Scheduled:
          appointment.appointmentStage = AppointmentStageMessages.Scheduled;
          break;
        default:
          break;
      }

      var gender = data["serviceOption"];
      if (gender == "1") {
        appointment.serviceGender = "Male";
      } else if (gender == "2") {
        appointment.serviceGender = "Female";
      } else {
        appointment.serviceGender = "Any";
      }

      appointment.servicePrice = data["servicePrice"];

      var serviceDate = data["serviceDate"];
      appointment.appointmentDate = moment(serviceDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");

      appointment.appointmentTime = UtilService.time24hourTo12Hours(data["serviceTime"]);

      appointment.primaryPatientFirstName = data["patientFirstName"];
      appointment.primaryPatientLastName = data["patientLastName"];

      var resultReadingRequestDate = data["resultReadingRequestDate"];
      if (resultReadingRequestDate != null) {
        appointment.resultReadingRequestDate = moment(resultReadingRequestDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      }

      var bookingDate = data["createdDate"];
      appointment.appointmentBookingDate = moment(bookingDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY hh:mm a");
      appointment.patientEmail = data["email"];
      appointment.patientMobile = data["mobileNumber"];
      appointment.serviceSectorId = data["serviceSectorId"];
      appointment.servicePrice = data["servicePrice"];

      var createdDate = data["createdDate"];
      if (createdDate != null) {
        appointment.createdDate = moment(createdDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      }

      appointment.serviceCost = data["serviceCost"];
      appointment.homeVisitCost = data["homeVisitCost"];
      appointment.discounts = data["discounts"];
      appointment.vat = data["vat"];
      appointment.totalServiceCost = data["totalServiceCost"];

      appointmentList.push(appointment);
    });
    return appointmentList;
  }

  static getExternalAppointmentList(appointments): Appointment[] {
    var appointmentList: Array<Appointment> = [];
    if (appointments == null) {
      return appointmentList;
    }
    appointments.forEach((data) => {
      var appointment = new Appointment();
      appointment.appointmentId = data["appointmentId"];
      appointment.serviceSectorId = data["serviceSectorId"];
      appointment.appointmentDisplayId = "APP" + appointment.appointmentId;
      appointment.serviceName = data["sectorName"] + " - Home visit";
      appointment.appointmentBookingStatus = data["appointmentStatus"];
      appointment.appointmentCurrentStatus = data["appointmentCurrentStatus"];
      appointment.patientSource = data["sourceName"];

      switch (appointment.appointmentBookingStatus) {
        case AppointmentStatus.Completed:
          appointment.appointmentStatusMessage = "Open";
          break;
        case AppointmentStatus.Cancelled:
          appointment.appointmentStatusMessage = "Cancelled";
          break;
        default:
          break;
      }

      switch (appointment.appointmentCurrentStatus) {
        case AppointmentStages.Accpeted:
          appointment.appointmentStage = AppointmentStageMessages.Accpeted;
          break;
        case AppointmentStages.ArrivedDesination:
          appointment.appointmentStage = AppointmentStageMessages.ArrivedDesination;
          break;
        case AppointmentStages.ServiceCompleted:
          if (appointment.serviceSectorId == 1) {
            appointment.appointmentStage = AppointmentStageMessages.CollectionCompleted;
          } else {
            appointment.appointmentStage = AppointmentStageMessages.ServiceCompleted;
          }
          break;
        case AppointmentStages.ServiceInProgress:
          appointment.appointmentStage = AppointmentStageMessages.CollectionInProgress;
          break;
        case AppointmentStages.OnTheWay:
          appointment.appointmentStage = AppointmentStageMessages.OnTheWay;
          break;
        case AppointmentStages.ResultPublished:
          appointment.appointmentStage = AppointmentStageMessages.ResultPublished;
          break;
        case AppointmentStages.SampleSubmittedToLab:
          appointment.appointmentStage = AppointmentStageMessages.SampleSubmittedToLab;
          break;
        case AppointmentStages.Scheduled:
          appointment.appointmentStage = AppointmentStageMessages.Scheduled;
          break;
        default:
          break;
      }

      var gender = data["serviceOption"];
      if (gender == "1") {
        appointment.serviceGender = "Male";
      } else if (gender == "2") {
        appointment.serviceGender = "Female";
      } else {
        appointment.serviceGender = "Any";
      }

      appointment.servicePrice = data["servicePrice"];

      var serviceDate = data["serviceDate"];
      appointment.appointmentDate = moment(serviceDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");

      appointment.appointmentTime = UtilService.time24hourTo12Hours(data["serviceTime"]);

      appointment.primaryPatientFirstName = data["primaryPatientName"];
      appointment.primaryPatientLastName = data["lastName"];
      appointment.address = data["address"];

      var resultReadingRequestDate = data["resultReadingRequestDate"];
      if (resultReadingRequestDate != null) {
        appointment.resultReadingRequestDate = moment(resultReadingRequestDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      }

      var bookingDate = data["createdDate"];
      appointment.appointmentBookingDate = moment(bookingDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY hh:mm a");
      appointment.patientEmail = data["email"];
      appointment.patientMobile = data["mobileNumber"];
      appointment.providerFirstName = data["providerFirstName"];
      appointment.providerLastName = data["providerLastName"];

      appointment.providerName = data["providerName"];
      appointment.serviceProviderId = data["serviceProviderId"];

      var a = moment(bookingDate);
      var b = moment();

      var minutesDiff = b.diff(a, "minutes");

      appointment.pendingSync = minutesDiff;

      appointmentList.push(appointment);
    });
    return appointmentList;
  }

  static getInsuredAppointmentList(appointments): Appointment[] {
    var appointmentList: Array<Appointment> = [];
    if (appointments == null) {
      return appointmentList;
    }
    appointments.forEach((data) => {
      var appointment = new Appointment();
      appointment.appointmentId = data["appointmentId"];
      appointment.serviceSectorId = data["serviceSectorId"];
      appointment.appointmentDisplayId = "APP" + appointment.appointmentId;
      appointment.serviceName = data["sectorName"] + " - Home visit";
      appointment.appointmentBookingStatus = data["appointmentStatus"];
      appointment.appointmentCurrentStatus = data["appointmentCurrentStatus"];
      appointment.patientSource = data["sourceName"];

      switch (appointment.appointmentBookingStatus) {
        case AppointmentStatus.Completed:
          appointment.appointmentStatusMessage = "Open";
          break;
        case AppointmentStatus.Cancelled:
          appointment.appointmentStatusMessage = "Cancelled";
          break;
        default:
          break;
      }

      switch (appointment.appointmentCurrentStatus) {
        case AppointmentStages.Accpeted:
          appointment.appointmentStage = AppointmentStageMessages.Accpeted;
          break;
        case AppointmentStages.ArrivedDesination:
          appointment.appointmentStage = AppointmentStageMessages.ArrivedDesination;
          break;
        case AppointmentStages.ServiceCompleted:
          if (appointment.serviceSectorId == 1) {
            appointment.appointmentStage = AppointmentStageMessages.CollectionCompleted;
          } else {
            appointment.appointmentStage = AppointmentStageMessages.ServiceCompleted;
          }
          break;
        case AppointmentStages.ServiceInProgress:
          appointment.appointmentStage = AppointmentStageMessages.CollectionInProgress;
          break;
        case AppointmentStages.OnTheWay:
          appointment.appointmentStage = AppointmentStageMessages.OnTheWay;
          break;
        case AppointmentStages.ResultPublished:
          appointment.appointmentStage = AppointmentStageMessages.ResultPublished;
          break;
        case AppointmentStages.SampleSubmittedToLab:
          appointment.appointmentStage = AppointmentStageMessages.SampleSubmittedToLab;
          break;
        case AppointmentStages.Scheduled:
          appointment.appointmentStage = AppointmentStageMessages.Scheduled;
          break;
        default:
          break;
      }

      var gender = data["serviceOption"];
      if (gender == "1") {
        appointment.serviceGender = "Male";
      } else if (gender == "2") {
        appointment.serviceGender = "Female";
      } else {
        appointment.serviceGender = "Any";
      }

      appointment.servicePrice = data["servicePrice"];

      var serviceDate = data["serviceDate"];
      appointment.appointmentDate = moment(serviceDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");

      appointment.appointmentTime = UtilService.time24hourTo12Hours(data["serviceTime"]);

      appointment.primaryPatientFirstName = data["primaryPatientName"];
      appointment.primaryPatientLastName = data["lastName"];
      appointment.address = data["address"];

      var resultReadingRequestDate = data["resultReadingRequestDate"];
      if (resultReadingRequestDate != null) {
        appointment.resultReadingRequestDate = moment(resultReadingRequestDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      }

      var bookingDate = data["createdDate"];
      appointment.appointmentBookingDate = moment(bookingDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY hh:mm a");
      appointment.patientEmail = data["email"];
      appointment.patientMobile = data["mobileNumber"];
      appointment.providerFirstName = data["providerFirstName"];
      appointment.providerLastName = data["providerLastName"];

      appointment.providerName = data["providerName"];
      appointment.serviceProviderId = data["serviceProviderId"];

      appointment.insuranceName = data["insuranceName"];
      appointment.insuranceNameArabic = data["insuranceNameArabic"];
      appointment.insuranceLogoPath = data["insuranceLogoPath"];

      var a = moment(bookingDate);
      var b = moment();

      var minutesDiff = b.diff(a, "minutes");

      appointment.pendingSync = minutesDiff;

      appointmentList.push(appointment);
    });
    return appointmentList;
  }

}
