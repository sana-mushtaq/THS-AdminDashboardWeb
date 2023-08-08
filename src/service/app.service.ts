import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { AppConstants } from "../utils/app-constants";

@Injectable({
  providedIn: "root",
})
export class AppService {
  httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };

  constructor(private _httpClient: HttpClient) {}

  // Service Provider

  userLogin(userName: string, password: string) {
    let params = {
      userName: userName,
      password: password,
    };
    return this._httpClient.post(AppConstants.loginURL, params, this.httpOptions);
  }

  getServiceProviderAppointmentList(serviceProviderId: string) {
    let reqParams = {
      userId: serviceProviderId,
    };
    return this._httpClient.post<any>(AppConstants.getProviderAppointmentListURL, reqParams);
  }

  getPractiseUserForSector(userRoleId: string) {
    let reqParams = {
      userRoleId: userRoleId,
    };
    return this._httpClient.post<any>(AppConstants.getStaffListForSectorURL, reqParams);
  }

  assignStaffForAppointment(staffId: string, appointmentId: string,adminNotesValue: string) {
    let reqParams = {
      staffId: staffId,
      appointmentId: appointmentId,
      adminNotes:adminNotesValue
    };
    return this._httpClient.post<any>(AppConstants.assignStaffForAppointmentURL, reqParams);
  }
  
  getAppoitmentDetails(appointmentId: string) {
    let reqParams = {
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.getAppointmentDetailsURL, reqParams);
  }

  postNewLabTestCatagory(params: any) {
    return this._httpClient.post<any>(AppConstants.postIndividualTestCategoryURL, params);
  }

  postNewServicePackageCatagory(params: any) {
    return this._httpClient.post<any>(AppConstants.postServicePackageCategoryURL, params);
  }

  postNewCommonService(params: any) {
    return this._httpClient.post<any>(AppConstants.postCommonServiceURL, params);
  }

  postNewSector(params: any) {
    return this._httpClient.post<any>(AppConstants.postNewServiceSectorURL, params);
  }

  postNewLabTest(params: any) {
    return this._httpClient.post<any>(AppConstants.postIndividualTestURL, params);
  }

  postNewCareProviderStaff(params: any) {
    return this._httpClient.post<any>(AppConstants.postNewCareProviderStaffURL, params);
  }

  updateServiceSector(params: any) {
    return this._httpClient.post<any>(AppConstants.updateServiceSectorURL, params);
  }

  updateLabPackageCategory(params: any) {
    return this._httpClient.post<any>(AppConstants.updateLabPackageCategoryURL, params);
  }

  updateLabTestCatetory(params: any) {
    return this._httpClient.post<any>(AppConstants.updateLabTestCatetoryURL, params);
  }

  updateLabPackage(params: any) {
    return this._httpClient.post<any>(AppConstants.updateLabPackageURL, params);
  }

  updateIndividualLabTest(params: any) {
    return this._httpClient.post<any>(AppConstants.updateIndividualLabTestURL, params);
  }

  updateCommonService(params: any) {
    return this._httpClient.post<any>(AppConstants.updateCommonServiceURL, params);
  }

  postNewServicePackage(params: any) {
    return this._httpClient.post<any>(AppConstants.postServicePackageURL, params);
  }

  getIndividualTestCategories() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getIndividualTestCategoriesURL, reqParams);
  }

  getAdminDashboard() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getAdminDashboardURL, reqParams);
  }

  getServiceSectorStats(reqParams) {
  
    return this._httpClient.post<any>(AppConstants.getServiceSectorStatsURL, reqParams);
  }

  getPatientsList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getPatientListURL, reqParams);
  }

  getSectorList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getSectorListURL, reqParams);
  }

  getCareProviderStaffs() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getStaffListForSectorURL, reqParams);
  }

  // getSectors() {
  //   let reqParams = {
  //   };
  //   return this._httpClient.post<any>(AppConstants.getStaffListForSectorURL, reqParams);
  // }

  getServicePackageCategories() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getServicePackageCategoriesURL, reqParams);
  }

  getIndividualLabTestList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getIndividualLabTestURL, reqParams);
  }

  getServicePackages() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getServicePackagesURL, reqParams);
  }

  getCommonServices() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getCommonServicesURL, reqParams);
  }

  updateAppointmentStatus(params: any) {
    return this._httpClient.post<any>(AppConstants.updateAppointmentStatusURL, params);
  }

  getServiceListForSector(sectorId) {
    let reqParams = {
      servicePrimarySectorId: sectorId,
    };
    return this._httpClient.post<any>(AppConstants.getServiceListURL, reqParams);
  }

  searchPatient(userMobileNumber) {
    let reqParams = {
      mobileNumber: userMobileNumber,
    };
    return this._httpClient.post<any>(AppConstants.searchPatientURL, reqParams);
  }

  getDependentsForPatient(patientId) {
    let reqParams = {
      userId: patientId,
    };
    return this._httpClient.post<any>(AppConstants.getDependantsURL, reqParams);
  }

  getPatientSources() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getPatientSourcesURL, reqParams);
  }

  postNewPatientSource(params: any) {
    return this._httpClient.post<any>(AppConstants.postNewPatientSourceURL, params);
  }

  registerNewPatient(params: any) {
    return this._httpClient.post<any>(AppConstants.registerNewPatientURL, params);
  }

  getServiceQuote(params: any) {
    return this._httpClient.post<any>(AppConstants.getQuoteForServiceListURL, params);
  }

  confirmAppointment(params: any) {
    return this._httpClient.post<any>(AppConstants.confirmAppointmentBookingURL, params);
  }

  addOrUpdatePromo(params: any) {
    return this._httpClient.post<any>(AppConstants.addOrUpdatePromoURL, params);
  }

  getPromoList(params: any) {
    return this._httpClient.post<any>(AppConstants.getPromoListURL, params);
  }

  getPromoUsageHistory(params: any) {
    return this._httpClient.post<any>(AppConstants.getPromoUsageURL, params);
  }

  updatePromoStatus(params: any) {
    return this._httpClient.post<any>(AppConstants.updatePromoStatusURL, params);
  }

  cancelAppointment(appointmentId: string) {
    let params = {
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.cancelAppointmentURL, params);
  }

  getResultReadingRequestList(params: any) {
    return this._httpClient.post<any>(AppConstants.getResultReadingRequestListURL, params);
  }

  uploadfileToServer(imageFile: File, fileUploadType: number, fileSourceId: string) {
    let fileUploadUrl = AppConstants.fileUploadURL;
    let uploadType = fileUploadType.toString();
    const formData: FormData = new FormData();
    formData.append("uploadedImage", imageFile, imageFile.name);
    formData.append("fileName", imageFile.name);
    formData.append("fileUploadType", uploadType);
    formData.append("fileSourceId", fileSourceId);
    return this._httpClient.post(fileUploadUrl, formData);
  }
  
  fileUploadImage(imageFile) {

    const formData: FormData = new FormData();
    let fileUploadUrl = AppConstants.imageUploadURL;
    formData.append("uploadedImage", imageFile, imageFile.name);
    formData.append("fileName", imageFile.name);
    return this._httpClient.post(fileUploadUrl, formData);

  }

  getAdminLabDashboard(params: any) {
    // let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getAdminLabDashboardURL, params);
  }

  getServiceProviderList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getServiceProviderListURL, reqParams);
  }

  postNewServiceProvider(params:any) {
    return this._httpClient.post<any>(AppConstants.AddpostNewServiceProviderURL, params);
  }
  
  getServiceProviderDashboard(){
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getServiceProviderDashboardURL, reqParams);
  }

  getServiceProviderStaffList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getServiceProviderStaffListURL, reqParams);
  }
  
  createNewServiceProviderStaff(params: any) {
    return this._httpClient.post<any>(AppConstants.createNewServiceProviderStaffURL, params);
  }

  getProviderLabPackages() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getProviderLabPackagesURL, reqParams);
  }

  getProviderLabTests() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getProviderLabTestsURL, reqParams);
  }

  getProviderOtherServices() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getProviderOtherServicesURL, reqParams);
  }

  getServiceProviderSettings() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getServiceProviderSettingsURL, reqParams);
  }

  updateServiceProviderSettings(params: any) {
    return this._httpClient.post<any>(AppConstants.updateServiceProviderSettingsURL, params);
  }

  optNewService(params: any) {
    return this._httpClient.post<any>(AppConstants.optNewServiceURL, params);
  }

  getProviderOptedServices(params:any) {
    return this._httpClient.post<any>(AppConstants.getProviderOptedServicesURL, params);
  }

  assignCareGiverForResultReding(readerId:string, appointmentId: string) {
    let reqParams = {
      staffId: readerId,
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.assignCareGiverForResultRedingURL, reqParams);
  }

  getEmployeerList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getEmployeerListURL, reqParams);
  }

  getCorpServicePackages() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getCorpServicePackagesURL, reqParams);
  }

  createNewEmployeer(params:any){
    return this._httpClient.post<any>(AppConstants.createNewEmployeerURL, params);
  }

  createCorpServicePackage(params:any){
    return this._httpClient.post<any>(AppConstants.createCorpServicePackageURL, params);
  }

  getOpenCorpAppointments(params:any){
    return this._httpClient.post<any>(AppConstants.getOpenCorpAppointmentsURL, params);
  }

  getCorpAppointmentHistory(params:any){
    return this._httpClient.post<any>(AppConstants.getCorpAppointmentHistoryURL, params);
  }

  getCorpAppointmentDetails(appointmentId: string) {
    let reqParams = {
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.getCorpAppointmentDetailsURL, reqParams);
  }

  assignCareGiverForCorpAppointment(staffId: string, appointmentId: string, serviceDate: string, serviceTime: string, employerNotes: string, careGiverNotes:string) {
    let reqParams = {
      staffId: staffId,
      appointmentId: appointmentId,
      serviceDate: serviceDate, 
      serviceTime: serviceTime,
      adminNotes:careGiverNotes, 
      noteToEmployeer: employerNotes, 
    };
    return this._httpClient.post<any>(AppConstants.assignCareGiverForCorpAppointmentURL, reqParams);
  }

  deleteLabResultFile(params:any){
    return this._httpClient.post<any>(AppConstants.deleteLabResultFileURL, params);
  }

  getLabAppointmentList(){
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getLabAppointmentListURL, reqParams);
  }
  optInOptOutService(params:any) {
    return this._httpClient.post<any>(AppConstants.optInOptOutServiceURL, params);
  }

  getLabAppointmentDetails(appointmentId: string) {
    let reqParams = {
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.getLabAppointmentDetailsURL, reqParams);
  }

  assignCareGiverForLabAppointment(staffId: string, appointmentId: string) {
    let reqParams = {
      staffId: staffId,
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.assignCareGiverForLabAppointmentURL, reqParams);
  }

  getPatientSummary(params: any) {
    return this._httpClient.post<any>(AppConstants.getPatientSummaryURL, params);
  }
  addPatientDependent(params: any) {
    return this._httpClient.post<any>(AppConstants.addPatientDependentURL, params);
  }
  

  reinviteLab(params: any) {
    return this._httpClient.post<any>(AppConstants.reinviteLabURL, params);
  }

  updateLabServiceProviderStatus(params: any) {
    return this._httpClient.post<any>(AppConstants.updateLabServiceProviderStatusURL, params);
  }

  changePasswordLab(params: any) {
    return this._httpClient.post<any>(AppConstants.changePasswordLabURL, params);
  }

  getServiceProviderDetails(params: any) {
    return this._httpClient.post<any>(AppConstants.getServiceProviderDetailsURL, params);
  }

  getAppointmentsReport(params: any) {
    return this._httpClient.post<any>(AppConstants.getAppointmentsReportURL, params);
  }

  getExternalLabAppointmentList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getExternalLabAppointmentListURL, reqParams);
  }

  assignServiceProviderForAppointment(params: any) {
    return this._httpClient.post<any>(AppConstants.assignServiceProviderForAppointmentURL, params);
  }

  getUnVerifiedPatientList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getUnVerifiedPatientListURL, reqParams);
  }

  updatePatientAccountStatus(params: any) {
    return this._httpClient.post<any>(AppConstants.updatePatientAccountStatusURL, params);
  }

  getBusinessAppointmentListForLab(params: any) {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getBusinessAppointmentListForLabURL, params);
  }

  getBusinessAppointmentDetailsForLab(appointmentId: string) {
    let reqParams = {
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.getBusinessAppointmentDetailsForLabURL, reqParams);
  }

  confirmLabBusinessAppoinmentSchedule(staffId: string, appointmentId: string, serviceDate: string, serviceTime: string, employerNotes: string, careGiverNotes:string) {
    let reqParams = {
      staffId: staffId,
      appointmentId: appointmentId,
      serviceDate: serviceDate, 
      serviceTime: serviceTime,
      adminNotes:careGiverNotes, 
      noteToEmployeer: employerNotes, 
    };
    return this._httpClient.post<any>(AppConstants.confirmLabBusinessAppoinmentScheduleURL, reqParams);
  }
  
  getEmployeerListForLab (userRoleId: string) {
    let reqParams = {
      userRoleId: userRoleId,
    };
    return this._httpClient.post<any>(AppConstants.getEmployeerListForLabURL, reqParams);
  }

  getEmployeerDetails(params) {
    return this._httpClient.post<any>(AppConstants.getEmployeerDetailsURL, params);
  }

  rescheduleAppointment(params) {
    return this._httpClient.post<any>(AppConstants.rescheduleAppointmentURL, params);
  }

  rescheduleBusinessAppointment(params) {
    return this._httpClient.post<any>(AppConstants.rescheduleBusinessAppointmentURL, params);
  }

  getCommonServiceCategories() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getCommonServiceCategoriesURL, reqParams);
  }

  getInsuranceProviderList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getInsuranceProviderListURL, reqParams);
  }

  postCommonServiceCategoryToServer(params: any) {
    return this._httpClient.post<any>(AppConstants.postCommonServiceCategoryToServerURL, params);
  }

  postInsuranceServiceProvider(params: any) {
    return this._httpClient.post<any>(AppConstants.postInsuranceServiceProviderURL, params);
  }

  getCorpEmployeeDetails(params: any) {
    return this._httpClient.post<any>(AppConstants.getCorpEmployeeDetailsURL, params);
  }

  postNewCorpEmployee(params: any) {
    return this._httpClient.post<any>(AppConstants.postNewCorpEmployeeURL, params);
  }

  getInsuredAppointmentList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getInsuredAppointmentListURL, reqParams);
  }

  getInsuredAppointmentDetails(appointmentId: string) {
    let reqParams = {
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.getInsuredAppointmentDetailsURL, reqParams);
  }

  updatePatientInsuranceStatus(params) {
    return this._httpClient.post<any>(AppConstants.updatePatientInsuranceStatusURL, params);
  }

  searchPatientForLab(userMobileNumber) {
    let reqParams = {
      mobileNumber: userMobileNumber,
    };
    return this._httpClient.post<any>(AppConstants.searchPatientForLabURL, reqParams);
  }

  getPatientDependentsForLab(patientId) {
    let reqParams = {
      userId: patientId,
    };
    return this._httpClient.post<any>(AppConstants.getPatientDependentsForLabURL, reqParams);
  }

  getServiceSectorsForLab() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getServiceSectorsForLabURL, reqParams);
  }

  getServiceListForLab(sectorId) {
    let reqParams = {
      servicePrimarySectorId: sectorId,
    };
    return this._httpClient.post<any>(AppConstants.getServiceListForLabURL, reqParams);   
  }

  getQuoteForServiceListFromLab(params: any) {
    return this._httpClient.post<any>(AppConstants.getQuoteForServiceListFromLabURL, params);
  }

  postNewAppointmentForLab(params: any) {
    return this._httpClient.post<any>(AppConstants.postNewAppointmentForLabURL, params);
  }

  addOrUpdateEscortService(params: any) {
    return this._httpClient.post<any>(AppConstants.addOrUpdateEscortServiceURL, params);
  }

  getEscortServiceList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getEscortServiceListURL, reqParams);
  }

  getEscortServiceRequestList() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getEscortServiceRequestListURL, reqParams);
  }

  getEscortServiceRequestDetails(appointmentId: string) {
    let reqParams = {
      appointmentId: appointmentId,
    };
    return this._httpClient.post<any>(AppConstants.getEscortServiceRequestDetailsURL, reqParams);
  }

  getGiftLog() {
    let reqParams = {};
    return this._httpClient.post<any>(AppConstants.getGiftLogURL, reqParams);
  }

}
