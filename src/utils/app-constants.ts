import { environment } from "../environments/environment";

export * from "./app-enum";
export * from "./app-literals";

export class AppConstants {
  //Service provider

  public static get loginURL(): string {
    return `${environment.domainName}${environment.loginURL}`;
  }

  public static get getProviderAppointmentListURL(): string {
    return `${environment.domainName}${environment.getProviderAppointmentListURL}`;
  }


  public static get getPatientListURL(): string {
    return `${environment.domainName}${environment.getPatientListURL}`;
  }

  public static get getStaffListURL(): string {
    return `${environment.domainName}${environment.getStaffListURL}`;
  }

  public static get getStaffListForSectorURL(): string {
    return `${environment.domainName}${environment.getStaffListForSectorURL}`;
  }

  public static get getAppointmentDetailsURL(): string {
    return `${environment.domainName}${environment.getAppointmentDetailsURL}`;
  }

  public static get assignStaffForAppointmentURL(): string {
    return `${environment.domainName}${environment.assignStaffForAppointmentURL}`;
  }

  public static get getSectorListURL(): string {
    return `${environment.domainName}${environment.getSectorListURL}`;
  }

  public static get postIndividualTestCategoryURL(): string {
    return `${environment.domainName}${environment.postIndividualTestCategoryURL}`;
  }
  public static get postServicePackageCategoryURL(): string {
    return `${environment.domainName}${environment.postServicePackageCategoryURL}`;
  }
  public static get postIndividualTestURL(): string {
    return `${environment.domainName}${environment.postIndividualTestURL}`;
  }
  public static get postServicePackageURL(): string {
    return `${environment.domainName}${environment.postServicePackageURL}`;
  }
  public static get postCommonServiceURL(): string {
    return `${environment.domainName}${environment.postCommonServiceURL}`;
  }
  public static get getIndividualTestCategoriesURL(): string {
    return `${environment.domainName}${environment.getIndividualTestCategoriesURL}`;
  }
  public static get getServicePackageCategoriesURL(): string {
    return `${environment.domainName}${environment.getServicePackageCategoriesURL}`;
  }
  public static get getIndividualLabTestURL(): string {
    return `${environment.domainName}${environment.getIndividualLabTestURL}`;
  }
  public static get getServicePackagesURL(): string {
    return `${environment.domainName}${environment.getServicePackagesURL}`;
  }
  public static get getCommonServicesURL(): string {
    return `${environment.domainName}${environment.getCommonServicesURL}`;
  }

  public static get postNewCareProviderStaffURL(): string {
    return `${environment.domainName}${environment.postNewCareProviderStaffURL}`;
  }

  public static get postNewServiceSectorURL(): string {
    return `${environment.domainName}${environment.postNewServiceSectorURL}`;
  }

  public static get updateAppointmentStatusURL(): string {
    return `${environment.domainName}${environment.updateAppointmentStatusURL}`;
  }

  public static get getAdminDashboardURL(): string {
    return `${environment.domainName}${environment.getAdminDashboardURL}`;
  }

  public static get getServiceSectorStatsURL(): string {
    return `${environment.domainName}${environment.getServiceSectorStatsURL}`;
  }

  public static get updateServiceSectorURL(): string {
    return `${environment.domainName}${environment.updateServiceSectorURL}`;
  }

  public static get updateLabPackageCategoryURL(): string {
    return `${environment.domainName}${environment.updateLabPackageCategoryURL}`;
  }

  public static get updateLabTestCatetoryURL(): string {
    return `${environment.domainName}${environment.updateLabTestCatetoryURL}`;
  }

  public static get updateLabPackageURL(): string {
    return `${environment.domainName}${environment.updateLabPackageURL}`;
  }

  public static get updateIndividualLabTestURL(): string {
    return `${environment.domainName}${environment.updateIndividualLabTestURL}`;
  }

  public static get updateCommonServiceURL(): string {
    return `${environment.domainName}${environment.updateCommonServiceURL}`;
  }

  public static get fileUploadURL(): string {
    return `${environment.domainName}${environment.fileUploadURL}`;
  }
  
  public static get imageUploadURL(): string {
    return `${environment.domainName}${environment.imageUploadURL}`;
  }

  public static get registerNewPatientURL(): string {
    return `${environment.domainName}${environment.registerNewPatientURL}`;
  }

  public static get searchPatientURL(): string {
    return `${environment.domainName}${environment.searchPatientURL}`;
  }

  public static get getServiceListURL(): string {
    return `${environment.domainName}${environment.getServiceListURL}`;
  }

  public static get getDependantsURL(): string {
    return `${environment.domainName}${environment.getDependantsURL}`;
  }

  public static get getPatientSourcesURL(): string {
    return `${environment.domainName}${environment.getPatientSourcesURL}`;
  }

  public static get postNewPatientSourceURL(): string {
    return `${environment.domainName}${environment.postNewPatientSourceURL}`;
  }

  public static get getQuoteForServiceListURL(): string {
    return `${environment.domainName}${environment.getQuoteForServiceListURL}`;
  }

  public static get confirmAppointmentBookingURL(): string {
    return `${environment.domainName}${environment.confirmAppointmentBookingURL}`;
  }

  public static get addOrUpdatePromoURL(): string {
    return `${environment.domainName}${environment.addOrUpdatePromoURL}`;
  }

  public static get getPromoListURL(): string {
    return `${environment.domainName}${environment.getPromoListURL}`;
  }

  public static get getPromoUsageURL(): string {
    return `${environment.domainName}${environment.getPromoUsageURL}`;
  }

  public static get updatePromoStatusURL(): string {
    return `${environment.domainName}${environment.updatePromoStatusURL}`;
  }

  public static get cancelAppointmentURL(): string {
    return `${environment.domainName}${environment.cancelAppointmentURL}`;
  }

  public static get getResultReadingRequestListURL(): string {
    return `${environment.domainName}${environment.getResultReadingRequestListURL}`;
  }

  public static get getAdminLabDashboardURL(): string {
    return `${environment.domainName}${environment.getAdminLabDashboardURL}`;
  }

  public static get getServiceProviderListURL(): string {
    return `${environment.domainName}${environment.getServiceProviderListURL}`;
  }

  public static get AddpostNewServiceProviderURL(): string {
    return `${environment.domainName}${environment.AddpostNewServiceProviderURL}`;
  }

  public static get getServiceProviderDashboardURL(): string {
    return `${environment.domainName}${environment.getServiceProviderDashboardURL}`;
  }

  public static get getServiceProviderStaffListURL(): string {
    return `${environment.domainName}${environment.getServiceProviderStaffListURL}`;
  }

  public static get createNewServiceProviderStaffURL(): string {
    return `${environment.domainName}${environment.createNewServiceProviderStaffURL}`;
  }

  public static get getProviderLabPackagesURL(): string {
    return `${environment.domainName}${environment.getProviderLabPackagesURL}`;
  }

  public static get getProviderLabTestsURL(): string {
    return `${environment.domainName}${environment.getProviderLabTestsURL}`;
  }
  
  public static get getProviderOtherServicesURL(): string {
    return `${environment.domainName}${environment.getProviderOtherServicesURL}`;
  }

  public static get getServiceProviderSettingsURL(): string {
    return `${environment.domainName}${environment.getServiceProviderSettingsURL}`;
  }

  public static get updateServiceProviderSettingsURL(): string {
    return `${environment.domainName}${environment.updateServiceProviderSettingsURL}`;
  }

  public static get optNewServiceURL(): string {
    return `${environment.domainName}${environment.optNewServiceURL}`;
  }
  
  public static get getProviderOptedServicesURL(): string {
    return `${environment.domainName}${environment.getProviderOptedServicesURL}`;
  }
  
  public static get assignCareGiverForResultRedingURL(): string {
    return `${environment.domainName}${environment.assignCareGiverForResultRedingURL}`;
  }

  public static get getEmployeerListURL(): string {
    return `${environment.domainName}${environment.getEmployeerListURL}`;
  }

  public static get getCorpServicePackagesURL(): string {
    return `${environment.domainName}${environment.getCorpServicePackagesURL}`;
  }  

  public static get createNewEmployeerURL(): string {
    return `${environment.domainName}${environment.createNewEmployeerURL}`;
  }

  public static get createCorpServicePackageURL(): string {
    return `${environment.domainName}${environment.createCorpServicePackageURL}`;
  }

  public static get getOpenCorpAppointmentsURL(): string {
    return `${environment.domainName}${environment.getOpenCorpAppointmentsURL}`;
  }

  public static get getCorpAppointmentHistoryURL(): string {
    return `${environment.domainName}${environment.getCorpAppointmentHistoryURL}`;
  }

  public static get getCorpAppointmentDetailsURL(): string {
    return `${environment.domainName}${environment.getCorpAppointmentDetailsURL}`;
  }

  public static get assignCareGiverForCorpAppointmentURL(): string {
    return `${environment.domainName}${environment.assignCareGiverForCorpAppointmentURL}`;
  }

  public static get deleteLabResultFileURL(): string {
    return `${environment.domainName}${environment.deleteLabResultFileURL}`;
  }

  public static get getLabAppointmentListURL(): string {
    return `${environment.domainName}${environment.getLabAppointmentListURL}`;
  }

  public static get optInOptOutServiceURL(): string {
    return `${environment.domainName}${environment.optInOptOutServiceURL}`;
  }

  public static get getLabAppointmentDetailsURL(): string {
    return `${environment.domainName}${environment.getLabAppointmentDetailsURL}`;
  }

  public static get assignCareGiverForLabAppointmentURL(): string {
    return `${environment.domainName}${environment.assignCareGiverForLabAppointmentURL}`;
  }

  public static get getPatientSummaryURL(): string {
    return `${environment.domainName}${environment.getPatientSummaryURL}`;
  }

  public static get reinviteLabURL(): string {
    return `${environment.domainName}${environment.reinviteLabURL}`;
  }

  public static get updateLabServiceProviderStatusURL(): string {
    return `${environment.domainName}${environment.updateLabServiceProviderStatusURL}`;
  }
  
  public static get changePasswordLabURL(): string {
    return `${environment.domainName}${environment.changePasswordLabURL}`;
  }

  public static get getServiceProviderDetailsURL(): string {
    return `${environment.domainName}${environment.getServiceProviderDetailsURL}`;
  }

  public static get getAppointmentsReportURL(): string {
    return `${environment.domainName}${environment.getAppointmentsReportURL}`;
  }

  public static get getExternalLabAppointmentListURL(): string {
    return `${environment.domainName}${environment.getExternalLabAppointmentListURL}`;
  }  

  public static get assignServiceProviderForAppointmentURL(): string {
    return `${environment.domainName}${environment.assignServiceProviderForAppointmentURL}`;
  }  

  public static get getUnVerifiedPatientListURL(): string {
    return `${environment.domainName}${environment.getUnVerifiedPatientListURL}`;
  }  

  public static get updatePatientAccountStatusURL(): string {
    return `${environment.domainName}${environment.updatePatientAccountStatusURL}`;
  }  

  public static get getBusinessAppointmentListForLabURL(): string {
    return `${environment.domainName}${environment.getBusinessAppointmentListForLabURL}`;
  }  

  public static get getBusinessAppointmentDetailsForLabURL(): string {
    return `${environment.domainName}${environment.getBusinessAppointmentDetailsForLabURL}`;
  }  

  public static get confirmLabBusinessAppoinmentScheduleURL(): string {
    return `${environment.domainName}${environment.confirmLabBusinessAppoinmentScheduleURL}`;
  }  

  public static get getEmployeerListForLabURL(): string {
    return `${environment.domainName}${environment.getEmployeerListForLabURL}`;
  }  
  public static get addPatientDependentURL(): string {
    return `${environment.domainName}${environment.addPatientDependentURL}`;
  }  

  public static get getEmployeerDetailsURL(): string {
    return `${environment.domainName}${environment.getEmployeerDetailsURL}`;
  }  

  public static get rescheduleAppointmentURL(): string {
    return `${environment.domainName}${environment.rescheduleAppointmentURL}`;
  }  

  public static get rescheduleBusinessAppointmentURL(): string {
    return `${environment.domainName}${environment.rescheduleBusinessAppointmentURL}`;
  }  

  public static get getCommonServiceCategoriesURL(): string {
    return `${environment.domainName}${environment.getCommonServiceCategoriesURL}`;
  } 

  public static get getInsuranceProviderListURL(): string {
    return `${environment.domainName}${environment.getInsuranceProviderListURL}`;
  } 

  public static get postCommonServiceCategoryToServerURL(): string {
    return `${environment.domainName}${environment.postCommonServiceCategoryToServerURL}`;
  } 

  public static get postInsuranceServiceProviderURL(): string {
    return `${environment.domainName}${environment.postInsuranceServiceProviderURL}`;
  } 

  public static get getCorpEmployeeDetailsURL(): string {
    return `${environment.domainName}${environment.getCorpEmployeeDetailsURL}`;
  } 

  public static get postNewCorpEmployeeURL(): string {
    return `${environment.domainName}${environment.postNewCorpEmployeeURL}`;
  } 

  public static get getInsuredAppointmentListURL(): string {
    return `${environment.domainName}${environment.getInsuredAppointmentListURL}`;
  } 

  public static get getInsuredAppointmentDetailsURL(): string {
    return `${environment.domainName}${environment.getInsuredAppointmentDetailsURL}`;
  } 

  public static get updatePatientInsuranceStatusURL(): string {
    return `${environment.domainName}${environment.updatePatientInsuranceStatusURL}`;
  } 

  public static get searchPatientForLabURL(): string {
    return `${environment.domainName}${environment.searchPatientForLabURL}`;
  }

  public static get getPatientDependentsForLabURL(): string {
    return `${environment.domainName}${environment.getPatientDependentsForLabURL}`;
  }

  public static get getServiceSectorsForLabURL(): string {
    return `${environment.domainName}${environment.getServiceSectorsForLabURL}`;
  }

  public static get getServiceListForLabURL(): string {
    return `${environment.domainName}${environment.getServiceListForLabURL}`;
  }

  public static get getQuoteForServiceListFromLabURL(): string {
    return `${environment.domainName}${environment.getQuoteForServiceListFromLabURL}`;
  }

  public static get postNewAppointmentForLabURL(): string {
    return `${environment.domainName}${environment.postNewAppointmentForLabURL}`;
  }

  public static get addOrUpdateEscortServiceURL(): string {
    return `${environment.domainName}${environment.addOrUpdateEscortServiceURL}`;
  }

  public static get getEscortServiceListURL(): string {
    return `${environment.domainName}${environment.getEscortServiceListURL}`;
  }

  public static get getEscortServiceRequestListURL(): string {
    return `${environment.domainName}${environment.getEscortServiceRequestListURL}`;
  }

  public static get getEscortServiceRequestDetailsURL(): string {
    return `${environment.domainName}${environment.getEscortServiceRequestDetailsURL}`;
  }

  public static get getGiftLogURL(): string {
    return `${environment.domainName}${environment.getGiftLogURL}`;
  }

  public static get sendVerificationSMS(): string {
    return `${environment.domainName}${environment.sendVerificationSMS}`;
  }
}
