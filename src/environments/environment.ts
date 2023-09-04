// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  domainName: "http://localhost:3000/",

  //domainName: "https://taib.sa/services/", // Prod URL
  
  production: false,

  getServiceProviderAppointmentListURL: "getServiceProviderStaffAppointments",

  loginURL: "serviceProviderAdminLogin",
  getStaffListURL: "getStaffList",
  getPatientListURL: "getPatientList",
  getProviderAppointmentListURL: "getProviderAppointments",
  getAppointmentDetailsURL: "getProviderAppointmentDetails",
  getStaffListForSectorURL: "getStaffsForSector",
  assignStaffForAppointmentURL: "assignStaffForAppointment",
  getSectorListURL: "getAdminServiceSectors",

  postIndividualTestCategoryURL: "postIndividualTestCategory",
  postServicePackageCategoryURL: "postServicePackageCategory",
  postIndividualTestURL: "postIndividualTest",
  postServicePackageURL: "postServicePackage",
  postCommonServiceURL: "postCommonService",
  getIndividualTestCategoriesURL: "getIndividualTestCategories",
  getServicePackageCategoriesURL: "getServicePackageCategories",
  getIndividualLabTestURL: "getIndividualLabTest",
  getServicePackagesURL: "getServicePackages",
  getCommonServicesURL: "getCommonServices",
  postNewCareProviderStaffURL: "createCareProviderStaff",
  postNewServiceSectorURL: "postServiceSector",
  updateAppointmentStatusURL: "updateAppointmentStatus",
  getAdminDashboardURL: "getAdminDashboard",
  getServiceSectorStatsURL: "getAppointmentStats",
  updateServiceSectorURL: "updateServiceSector",
  updateLabPackageCategoryURL: "updateLabPackageCategory",
  updateLabTestCatetoryURL: "updateLabTestCatetory",
  updateLabPackageURL: "updateLabPackage",
  updateIndividualLabTestURL: "updateIndividualLabTest",
  updateCommonServiceURL: "updateCommonService",

  registerNewPatientURL: "registerNewPatient",
  searchPatientURL: "searchPatient",
  getServiceListURL: "getServiceList",
  getDependantsURL: "getDependants",
  getPatientSourcesURL: "getPaitentSources",
  postNewPatientSourceURL: "postPatientSource",
  getQuoteForServiceListURL: "getQuoteForServiceList",
  confirmAppointmentBookingURL: "confirmPatientAppointment",
  addOrUpdatePromoURL: "addOrUpdatePromo",
  getPromoListURL: "getPromoList",
  getPromoUsageURL: "getPromoUsageHistory",
  updatePromoStatusURL: "updatePromoStatus",
  cancelAppointmentURL: "cancelAppointment",
  getResultReadingRequestListURL: "getAdminResultReadingList",

  fileUploadURL: "fileUpload",
  imageUploadURL: "fileUploadImage",
  
  //SA LAB API'S
  getAdminLabDashboardURL: "getLabWiseSummary",
  getServiceProviderListURL: "getServiceProviderList",
  AddpostNewServiceProviderURL: "postNewServiceProvider",
  deleteLabResultFileURL: "deleteLabResultFile",
  reinviteLabURL: "resendLabServiceProviderInvite",
  updateLabServiceProviderStatusURL: "updateLabServiceProviderStatus",
  getPatientSummaryURL: "getPatientSummary",
  getServiceProviderDetailsURL: "getLabServiceProviderDetails",

  //LAB - INDIVIDUAL API"S
  getServiceProviderDashboardURL: "getServiceProviderDashboard",
  getServiceProviderStaffListURL: "getServiceProviderStaffList",
  createNewServiceProviderStaffURL: "createNewServiceProviderStaff",
  getProviderLabPackagesURL: "getLabEligibleLabPackages",
  getProviderLabTestsURL: "getLabEligibleLabTests",
  getProviderOtherServicesURL: "getLabEligibleCommonServices",
  getServiceProviderSettingsURL: "getServiceProviderSettings",
  updateServiceProviderSettingsURL: "updateServiceProviderSettings",
  optNewServiceURL: "optForNewService",
  getProviderOptedServicesURL: "getProviderOptedServices",
  assignCareGiverForResultRedingURL: "assignCareGiverForResultReding",
  getLabAppointmentListURL: "getLabAppointmentList",
  optInOptOutServiceURL: "optInOptOutService",
  getLabAppointmentDetailsURL: "getLabAppointmentDetails",
  assignCareGiverForLabAppointmentURL: "assignCareGiverForLabAppointment",
  changePasswordLabURL: "serviceProviderResetPassword",

  //EMPLOYEE CHECK
  getEmployeerListURL: "getEmployeerLIst",
  getCorpServicePackagesURL: "getCorpServicePackages",
  createNewEmployeerURL: "createNewEmployeer",
  createCorpServicePackageURL: "addBusinessPackage",
  getOpenCorpAppointmentsURL: "getBusinessAppointmentList",
  getCorpAppointmentHistoryURL: "getBusinessAppointmentList",
  getCorpAppointmentDetailsURL: "getBusinessAppointmentDetails",
  assignCareGiverForCorpAppointmentURL: "scheduleBusinessAppointment",

  //OTHER API"S
  getAppointmentsReportURL: "getAppointmentsReport",
  getExternalLabAppointmentListURL: "getExternalLabAppointmentList",
  assignServiceProviderForAppointmentURL: "assignServiceProviderForAppointment",
  getUnVerifiedPatientListURL: "getUnVerifiedPatientList",
  updatePatientAccountStatusURL: "updatePatientAccountStatus",

  //LAB- EMPLOYEE CHECK
  getBusinessAppointmentListForLabURL: "getBusinessAppointmentListForLab",
  getBusinessAppointmentDetailsForLabURL: "getBusinessAppointmentDetailsForLab",
  confirmLabBusinessAppoinmentScheduleURL: "confirmLabBusinessAppoinmentSchedule",
  getEmployeerListForLabURL: "getEmployeerListForLab",
  addPatientDependentURL: "addPatientDependent",

  //GET EMPLOYEER DETAILS
  getEmployeerDetailsURL: "getEmployeerDetails",

  //RESCHEDULE APPOINTMENT
  rescheduleAppointmentURL: "rescheduleAppointment",
  rescheduleBusinessAppointmentURL: "rescheduleBusinessAppointment",

  //OTHER SERVICE CATEGORY
  getCommonServiceCategoriesURL: "getCommonServiceCategories",
  postCommonServiceCategoryToServerURL: "postCommonServiceCategory",
  postInsuranceServiceProviderURL: "postInsuranceServiceProvider",
  getInsuranceProviderListURL: "getInsuranceProviderList",
  getCorpEmployeeDetailsURL: "getCorpEmployeeDetails",
  postNewCorpEmployeeURL: "postCorpEmployeeDetails",

  //INSURANCE
  getInsuredAppointmentListURL: "getInsuredAppointmentList",
  getInsuredAppointmentDetailsURL: "getInsuredAppointmentDetails",
  updatePatientInsuranceStatusURL: "updatePatientInsuranceStatus",


  //LAB ADD APPOINTMENT
  searchPatientForLabURL:"searchPatientForLab",
  getPatientDependentsForLabURL:"getPatientDependentsForLab",
  getServiceSectorsForLabURL:"getServiceSectorsForLab",
  getServiceListForLabURL:"getServiceListForLab",
  getQuoteForServiceListFromLabURL:"getQuoteForServiceListFromLab",
  postNewAppointmentForLabURL:"postNewAppointmentForLab",

  //ESCORT SERVICE

  addOrUpdateEscortServiceURL:"addOrUpdateEscortService",
  getEscortServiceListURL:"getEscortServiceList",
  getEscortServiceRequestListURL:"getEscortServiceRequestList",
  getEscortServiceRequestDetailsURL:"getEscortServiceRequestDetails",

  //GIFT LOG

  getGiftLogURL:"getGiftLog",

  sendVerificationSMS: "account/verification/sms"

};
