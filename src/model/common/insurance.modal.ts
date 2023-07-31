export class InsuranceList {

    insuranceProviderId: number;
    insuranceName:string;
    insuranceNameArabic: string;
    isActive: number;
    insuranceLogoPath:string;
    

    static getInsuranceList(responseData): InsuranceList[] {
        var labCategories: Array<InsuranceList> = [];
        let categories = responseData["insuranceProviderList"];
        categories.forEach(category => {
            let serviceCategory = new InsuranceList();
            serviceCategory.insuranceProviderId = category["insuranceProviderId"];
            serviceCategory.insuranceName = category["insuranceName"];
            serviceCategory.insuranceNameArabic = category["insuranceNameArabic"];
            serviceCategory.isActive = category["isActive"];
            serviceCategory.insuranceLogoPath = category["insuranceLogoPath"];
            
            labCategories.push(serviceCategory);
        });
        return labCategories;
    }
    
}
