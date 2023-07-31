// import { InsuranceSummary } from "./insurance-summary.model";

export class InsuranceSummary {
    
    insuranceRecordId: number;
    insuranceProviderId: 1;
    verificationStatus: number;
    verifiedDate:string

    static getInsuranceDetails(serviceResponse): InsuranceSummary[] {
        if (serviceResponse == undefined || serviceResponse == null ) {
            serviceResponse = {
              insuranceProviderId: null,
              insuranceRecordId: null,
              verificationStatus: null,
              verifiedDate: null,
            };
        }

        let services: InsuranceSummary[] = [];

        
        let appointmentService = new InsuranceSummary();

        appointmentService.insuranceRecordId = serviceResponse['insuranceRecordId'];
        appointmentService.insuranceProviderId = serviceResponse['insuranceProviderId'];
        appointmentService.verificationStatus = serviceResponse['verificationStatus'];
        appointmentService.verifiedDate = serviceResponse['verifiedDate'];

        services.push(appointmentService);
        
        return services;
    }

}


