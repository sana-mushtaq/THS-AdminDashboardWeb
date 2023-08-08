export enum APIResponse {
  Success = 0,
  Failed = 1,
  ServerError = 2,
  RecordExistAlready = 3,
}

export enum AlertType {
  Success = 1,
  Error = 2,
  Warning = 3,
}

export enum AppointmentTriggerSource {
  AppointmentList = 1,
  ResultReadingList = 2,
  LabAppointmentList = 3
}

export enum StatusColor {
  Greeen = "#29de53",
  Amper = "#de6f29",
  Red = "#ff040e",
}

export enum ICPillerId {
  Maturity = 1,
  Awareness = 2,
  Engagement = 3,
  Relations = 4,
  Appriciation = 5,
}

export enum ICColor {
  Awareness = "#8483de",
  Relations = "#f7d477",
  Appriciation = "#ed5569",
  Engagement = "#f09950",
  Maturity = "#70e6d6",
}

export enum EmployeeColor {
  Employee = "#de729a",
  Leader = "#b5cccd",
}

export enum AppointmentStatus {
  Open = 0,
  Completed = 1,
  Cancelled = 2,
}

export enum AppointmentStages {
  NotPaid = -1,
  Scheduled = 0,
  Accpeted = 1,
  OnTheWay = 2,
  ArrivedDesination = 3,
  ServiceInProgress = 4,
  ServiceCompleted = 5,
  SampleSubmittedToLab = 6,
  ResultPublished = 7,
}

export enum AppointmentStageMessages {
  NotPaid = "Not Scheduled",
  Scheduled = "Scheduled",
  Accpeted = "Accepted",
  OnTheWay = "On the way",
  ArrivedDesination = "Arrived at patient location",
  CollectionInProgress = "Service in progress",
  CollectionCompleted = "Sample Collected",
  ServiceCompleted = "Service completed",
  SampleSubmittedToLab = "Sample submitted",
  ResultPublished = "Result published",
}

export enum PractiseUserRoles {
  LabTech = 1,
  Nurse = 2,
  Physiotherapist = 3,
  GeneralPhysician = 4,
}

export enum ServiceSectors {
  LabTech = 1,
  Nurse = 2,
  Physiotherapist = 3,
  GeneralPhysician = 4,
}

export enum AppointmentLogStatus {
  Open = 0,
  Completed = 1,
  InProgress = 2,
}

export enum MaxFileSize {
  TWOMB = 0,
  FIVEMB = 1,
  TWENTYMB = 2,
}

export enum FileUploadType {
  Sector = 1,
  Package = 2,
  CommonService = 3,
  AppointmentResult = 4,
  PromoImage = 5,
  ServiceProviderLogo = 6,
  Employee = 7,
  EmployeePackage = 9,
  EmployeeAppointmentResult = 10,
  CommonServiceCategoryImage = 11,
  InsuranceProviderLogoImage = 12,
}
