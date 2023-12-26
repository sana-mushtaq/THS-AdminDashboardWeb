import { AppointmentStages, AppointmentStatus } from "src/utils/app-constants";
import { UtilService } from "src/utils/util.service";
import { AppointmentService } from "./appointment-service.model";
import { AppointmentStatusLog } from "./appointment-status-log.model";
import { InsuranceSummary } from "./insurance-summary.model";
import { ServicePrice } from "./service-price.model";
import { TestResult } from "./test-result.model";

export class AppointmentDetails {
  appointmentId: number;
  sectorId: number;
  appointmentStatus: number;
  appointmentCurrentStatus: number;
  serviceProviderId: number;
  serviceDescription: string;
  serviceOption: number;
  servicePrice: number;
  serviceDate: string;
  serviceTime: string;
  createdDate: string;
  address: string;
  serviceLatitude: string;
  serviceLongitude: string;
  primaryPatientName: string;
  lastName: string;
  patientId: number;
  email: string;
  mobileNumber: number;
  gender: number;
  bloodGroup: string;
  dob: string;
  parctiseUserId: number;
  userRoleId: number;
  providerFirstName: string;
  providerLastName: string;
  providerEmail: string;
  providerMobile: number;
  idNumber: string;
  patientNotes: string;
  employeerName: string;
  logoPath: string;
  corpEmpId: string;
  nationalId: string;
  packageName : string;
  packageNameArabic : string;

  genderText: string;
  appointmentStatusText: string;
  appointmentCurrentStatusText: string;
  serviceOptionText: string;

  requestedServices: AppointmentService[];
  appointmentPriceDetails: ServicePrice;
  statusHistory: AppointmentStatusLog[];
  testResults: TestResult[];

  patientInsuraceDetails

  resultReadingStatus: number;
  rrPractiseUserId: number;
  rrProviderEmail : string;
  rrProviderFirstName : string;
  rrProviderLastName : string;
  rrProviderMobile : string;

  adminNotes: string;


  insuranceName : string;
  insuranceNameArabic : string;
  insuranceLogoPath : string;

  rescheduleRequestFrom: String;

  static initalizeAppointmentDetails(appointmentDetails): AppointmentDetails {
    var appointment = appointmentDetails["appointmentDetails"];

    var apptDetails = new AppointmentDetails();
    apptDetails.appointmentId = appointment["appointmentId"];
    apptDetails.sectorId = appointment["serviceSectorId"];
    apptDetails.appointmentStatus = appointment["appointmentStatus"];
    apptDetails.appointmentCurrentStatus = appointment["appointmentCurrentStatus"];
    apptDetails.serviceProviderId = appointment["serviceProviderId"];
    apptDetails.serviceDescription = appointment["sectorName"] + " - Home visit";
    apptDetails.serviceOption = appointment["serviceOption"];
    apptDetails.servicePrice = appointment["servicePrice"];
    apptDetails.serviceDate = appointment["serviceDate"];
    apptDetails.serviceTime = UtilService.time24hourTo12Hours(appointment["serviceTime"]);
    apptDetails.createdDate = appointment["createdDate"];
    apptDetails.address = appointment["address"];
    apptDetails.serviceLatitude = appointment["serviceLatitude"];
    apptDetails.serviceLongitude = appointment["serviceLongitude"];
    apptDetails.primaryPatientName = appointment["primaryPatientName"];
    apptDetails.lastName = appointment["lastName"];
    apptDetails.patientId = appointment["patientId"];
    apptDetails.email = appointment["email"];
    apptDetails.mobileNumber = appointment["mobileNumber"];
    apptDetails.gender = appointment["gender"];
    apptDetails.idNumber = appointment["idNumber"];
    apptDetails.patientNotes = appointment["patientNotes"];
    apptDetails.resultReadingStatus = appointment["resultReadingStatus"];
    apptDetails.rrPractiseUserId = appointment["rrPractiseUserId"];
    apptDetails.rrProviderEmail = appointment["rrProviderEmail"];
    apptDetails.rrProviderFirstName = appointment["rrProviderFirstName"];
    apptDetails.rrProviderLastName = appointment["rrProviderLastName"];
    apptDetails.rrProviderMobile = appointment["rrProviderMobile"];
    apptDetails.adminNotes = appointment["adminNotes"];
    appointment.rescheduleRequestFrom = appointment["rescheduleRequestFrom"];

    if (apptDetails.patientNotes == null || apptDetails.patientNotes == "") {
      apptDetails.patientNotes = "_ _";
    }

    if (apptDetails.serviceOption == 1) {
      apptDetails.serviceOptionText = "Male";
    } else if (apptDetails.serviceOption == 2) {
      apptDetails.serviceOptionText = "Female";
    } else {
      apptDetails.serviceOptionText = "Any";
    }

    if (apptDetails.gender == 1) {
      apptDetails.genderText = "Male";
    } else {
      apptDetails.genderText = "Female";
    }

    if (apptDetails.appointmentStatus == AppointmentStatus.Open) {
      apptDetails.appointmentStatusText = "Open";
    } else if (apptDetails.appointmentStatus == AppointmentStatus.Completed) {
      apptDetails.appointmentStatusText = "Completed";
    } else {
      apptDetails.appointmentStatusText = "Cancelled";
    }

    switch (apptDetails.appointmentCurrentStatus) {
      case AppointmentStages.NotPaid:
        apptDetails.appointmentCurrentStatusText = "Not Scheduled";
        break;
      case AppointmentStages.Scheduled:
        apptDetails.appointmentCurrentStatusText = "Scheduled";
        break;
      case AppointmentStages.ArrivedDesination:
        apptDetails.appointmentCurrentStatusText = "Arrived patient location";
        break;
      case AppointmentStages.ServiceInProgress:
        apptDetails.appointmentCurrentStatusText = "Service in progress";
        break;
      case AppointmentStages.ServiceCompleted:
        apptDetails.appointmentCurrentStatusText = "Service completed";
        break;
      case AppointmentStages.OnTheWay:
        apptDetails.appointmentCurrentStatusText = "On the way";
        break;
      case AppointmentStages.ResultPublished:
        apptDetails.appointmentCurrentStatusText = "Result published";
        break;
      case AppointmentStages.SampleSubmittedToLab:
        apptDetails.appointmentCurrentStatusText = "Sample submitted to lab";
        break;
      case AppointmentStages.Accpeted:
        apptDetails.appointmentCurrentStatusText = "Accepted";
        break;
      default:
        break;
    }

    apptDetails.bloodGroup = appointment["bloodGroup"];
    apptDetails.dob = appointment["dob"];
    apptDetails.parctiseUserId = appointment["parctiseUserId"];
    apptDetails.userRoleId = appointment["userRoleId"];
    apptDetails.providerFirstName = appointment["providerFirstName"];
    apptDetails.providerLastName = appointment["providerLastName"];
    apptDetails.providerEmail = appointment["providerEmail"];
    apptDetails.providerMobile = appointment["providerMobile"];

    apptDetails.testResults = TestResult.getLabResults(appointment["labResult"]);
    apptDetails.requestedServices = AppointmentService.getServiceList(appointment["services"]);
    apptDetails.statusHistory = AppointmentStatusLog.getAppointmentStatusHistory(appointment["statusHistory"]);
    apptDetails.appointmentPriceDetails = ServicePrice.getServiceprice(appointment["priceDetails"]);
    return apptDetails;
  }

  static initalizeEmployeeAppointmentDetails(appointmentDetails): AppointmentDetails {
    var appointment = appointmentDetails["appointmentDetails"];

    var apptDetails = new AppointmentDetails();

    apptDetails.appointmentId = appointment["appointmentId"];
    apptDetails.serviceProviderId = appointment["serviceProviderId"];
    // apptDetails.sectorId = appointment["serviceSectorId"];
    apptDetails.appointmentStatus = appointment["appointmentStatus"];
    apptDetails.appointmentCurrentStatus = appointment["appointmentCurrentStatus"];
    apptDetails.serviceDescription = appointment["packageName"] + " - Home visit";
    apptDetails.serviceOption = appointment["serviceOption"];
    apptDetails.servicePrice = appointment["servicePrice"];
    apptDetails.serviceDate = appointment["serviceDate"];
    apptDetails.serviceTime = UtilService.time24hourTo12Hours(appointment["serviceTime"]);
    apptDetails.createdDate = appointment["createdDate"];
    apptDetails.address = appointment["address"];
    apptDetails.serviceLatitude = appointment["serviceLatitude"];
    apptDetails.serviceLongitude = appointment["serviceLongitude"];
    apptDetails.patientNotes = appointment["patientNotes"];
    apptDetails.employeerName = appointment["employeerName"];
    apptDetails.logoPath = appointment["logoPath"];
    apptDetails.corpEmpId = appointment["corpEmpId"];
    apptDetails.primaryPatientName = appointment["patientFirstName"];
    apptDetails.lastName = appointment["patientLastName"];
    apptDetails.email = appointment["email"];
    apptDetails.mobileNumber = appointment["mobileNumber"];
    apptDetails.nationalId = appointment["nationalId"];
    apptDetails.packageName = appointment["packageName"];
    apptDetails.packageNameArabic = appointment["packageNameArabic"];
    apptDetails.parctiseUserId = appointment["parctiseUserId"];
    apptDetails.userRoleId = appointment["userRoleId"];
    apptDetails.providerFirstName = appointment["providerFirstName"];
    apptDetails.providerLastName = appointment["providerLastName"];
    apptDetails.providerEmail = appointment["providerEmail"];
    apptDetails.providerMobile = appointment["providerMobile"];
    apptDetails.dob = appointment["dob"];
    apptDetails.rescheduleRequestFrom = appointment["rescheduleRequestFrom"];
    
    // apptDetails.patientId = appointment["patientId"];
    // apptDetails.gender = appointment["gender"];
    apptDetails.idNumber = appointment["nationalId"];
    

    if (apptDetails.patientNotes == null || apptDetails.patientNotes == "") {
      apptDetails.patientNotes = "_ _";
    }

    if (apptDetails.serviceOption == 1) {
      apptDetails.serviceOptionText = "Male";
    } else if (apptDetails.serviceOption == 2) {
      apptDetails.serviceOptionText = "Female";
    } else {
      apptDetails.serviceOptionText = "Any";
    }

    if (apptDetails.gender == 1) {
      apptDetails.genderText = "Male";
    } else {
      apptDetails.genderText = "Female";
    }

    if (apptDetails.appointmentStatus == AppointmentStatus.Open) {
      apptDetails.appointmentStatusText = "Open";
    } else if (apptDetails.appointmentStatus == AppointmentStatus.Completed) {
      apptDetails.appointmentStatusText = "Completed";
    } else {
      apptDetails.appointmentStatusText = "Cancelled";
    }

    switch (apptDetails.appointmentCurrentStatus) {
      case AppointmentStages.Scheduled:
        apptDetails.appointmentCurrentStatusText = "Scheduled";
        break;
      case AppointmentStages.ArrivedDesination:
        apptDetails.appointmentCurrentStatusText = "Arrived patient location";
        break;
      case AppointmentStages.ServiceInProgress:
        apptDetails.appointmentCurrentStatusText = "Service in progress";
        break;
      case AppointmentStages.ServiceCompleted:
        apptDetails.appointmentCurrentStatusText = "Service completed";
        break;
      case AppointmentStages.OnTheWay:
        apptDetails.appointmentCurrentStatusText = "On the way";
        break;
      case AppointmentStages.ResultPublished:
        apptDetails.appointmentCurrentStatusText = "Result published";
        break;
      case AppointmentStages.SampleSubmittedToLab:
        apptDetails.appointmentCurrentStatusText = "Sample submitted to lab";
        break;
      case AppointmentStages.Accpeted:
        apptDetails.appointmentCurrentStatusText = "Accepted";
        break;
      default:
        break;
    }

    apptDetails.testResults = TestResult.getLabResults(appointment["labResult"]);
    apptDetails.statusHistory = AppointmentStatusLog.getAppointmentStatusHistory(appointment["statusHistory"]);

    return apptDetails;
  }


  static initalizeInsuredAppointmentDetails(appointmentDetails): AppointmentDetails {

    
    var appointment = appointmentDetails["appointmentDetails"];

    var apptDetails = new AppointmentDetails();
    apptDetails.appointmentId = appointment["appointmentId"];

    
   
    
    apptDetails.sectorId = appointment["serviceSectorId"];
    apptDetails.appointmentStatus = appointment["appointmentStatus"];
    apptDetails.appointmentCurrentStatus = appointment["appointmentCurrentStatus"];
    apptDetails.serviceProviderId = appointment["serviceProviderId"];
    apptDetails.serviceDescription = appointment["sectorName"] + " - Home visit";
    apptDetails.serviceOption = appointment["serviceOption"];
    apptDetails.servicePrice = appointment["servicePrice"];
    apptDetails.serviceDate = appointment["serviceDate"];
    apptDetails.serviceTime = UtilService.time24hourTo12Hours(appointment["serviceTime"]);
    apptDetails.createdDate = appointment["createdDate"];
    apptDetails.address = appointment["address"];
    apptDetails.serviceLatitude = appointment["serviceLatitude"];
    apptDetails.serviceLongitude = appointment["serviceLongitude"];
    apptDetails.primaryPatientName = appointment["primaryPatientName"];
    apptDetails.lastName = appointment["lastName"];
    apptDetails.patientId = appointment["patientId"];
    apptDetails.email = appointment["email"];
    apptDetails.mobileNumber = appointment["mobileNumber"];
    apptDetails.gender = appointment["gender"];
    apptDetails.idNumber = appointment["idNumber"];
    apptDetails.patientNotes = appointment["patientNotes"];
    apptDetails.resultReadingStatus = appointment["resultReadingStatus"];
    apptDetails.rrPractiseUserId = appointment["rrPractiseUserId"];
    apptDetails.rrProviderEmail = appointment["rrProviderEmail"];
    apptDetails.rrProviderFirstName = appointment["rrProviderFirstName"];
    apptDetails.rrProviderLastName = appointment["rrProviderLastName"];
    apptDetails.rrProviderMobile = appointment["rrProviderMobile"];
    apptDetails.adminNotes = appointment["adminNotes"];
    apptDetails.rescheduleRequestFrom = appointment["rescheduleRequestFrom"];
    if (apptDetails.patientNotes == null || apptDetails.patientNotes == "") {
      apptDetails.patientNotes = "_ _";
    }

    if (apptDetails.serviceOption == 1) {
      apptDetails.serviceOptionText = "Male";
    } else if (apptDetails.serviceOption == 2) {
      apptDetails.serviceOptionText = "Female";
    } else {
      apptDetails.serviceOptionText = "Any";
    }

    if (apptDetails.gender == 1) {
      apptDetails.genderText = "Male";
    } else {
      apptDetails.genderText = "Female";
    }

    if (apptDetails.appointmentStatus == AppointmentStatus.Open) {
      apptDetails.appointmentStatusText = "Open";
    } else if (apptDetails.appointmentStatus == AppointmentStatus.Completed) {
      apptDetails.appointmentStatusText = "Completed";
    } else {
      apptDetails.appointmentStatusText = "Cancelled";
    }

    switch (apptDetails.appointmentCurrentStatus) {
      case AppointmentStages.Scheduled:
        apptDetails.appointmentCurrentStatusText = "Scheduled";
        break;
      case AppointmentStages.ArrivedDesination:
        apptDetails.appointmentCurrentStatusText = "Arrived patient location";
        break;
      case AppointmentStages.ServiceInProgress:
        apptDetails.appointmentCurrentStatusText = "Service in progress";
        break;
      case AppointmentStages.ServiceCompleted:
        apptDetails.appointmentCurrentStatusText = "Service completed";
        break;
      case AppointmentStages.OnTheWay:
        apptDetails.appointmentCurrentStatusText = "On the way";
        break;
      case AppointmentStages.ResultPublished:
        apptDetails.appointmentCurrentStatusText = "Result published";
        break;
      case AppointmentStages.SampleSubmittedToLab:
        apptDetails.appointmentCurrentStatusText = "Sample submitted to lab";
        break;
      case AppointmentStages.Accpeted:
        apptDetails.appointmentCurrentStatusText = "Accepted";
        break;
      default:
        break;
    }

    apptDetails.bloodGroup = appointment["bloodGroup"];
    apptDetails.dob = appointment["dob"];
    apptDetails.parctiseUserId = appointment["parctiseUserId"];
    apptDetails.userRoleId = appointment["userRoleId"];
    apptDetails.providerFirstName = appointment["providerFirstName"];
    apptDetails.providerLastName = appointment["providerLastName"];
    apptDetails.providerEmail = appointment["providerEmail"];
    apptDetails.providerMobile = appointment["providerMobile"];

    apptDetails.insuranceName = appointment["insuranceName"];
    apptDetails.insuranceNameArabic = appointment["insuranceNameArabic"];
    apptDetails.insuranceLogoPath = appointment["insuranceLogoPath"];

    apptDetails.testResults = TestResult.getLabResults(appointment["labResult"]);
    apptDetails.requestedServices = AppointmentService.getServiceList(appointment["services"]);
    apptDetails.statusHistory = AppointmentStatusLog.getAppointmentStatusHistory(appointment["statusHistory"]);
    apptDetails.appointmentPriceDetails = ServicePrice.getServiceprice(appointment["priceDetails"]);
    apptDetails.patientInsuraceDetails = InsuranceSummary.getInsuranceDetails(appointment["patientInsuraceSummary"]);
    
    return apptDetails;
  }
  
}
