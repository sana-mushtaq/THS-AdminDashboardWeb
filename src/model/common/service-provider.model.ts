export class ServiceProvider {
    serviceProviderId: number;
    providerName: string;
    providerNameArabic: string;
    emailId: string;
    phoneNumber: string;
    logoPath: string;
    description: string;
    descriptionArabic: string;
    availableServiceOption : string;
    address: string;
    adderssArabic: string
    contactPersonName: string;
    latitude : string;
    longitude: string;
    contactPersonNameArabic: string;
    serviceProviderType: string;
    isActive: number;
    serviceCoverageRadius: number;
    ineligiblePackages: string;
    inelligibleLabTests: string;
    ineligibleOtherServices: string;

    static getServiceProviderDetails(responseData): ServiceProvider[] {
        var providerDetails: Array<ServiceProvider> = [];
        let data = responseData["serviceProviderDetails"];
        
            let serviceProvider = new ServiceProvider();
            serviceProvider.serviceProviderId = data["serviceProviderId"];
            serviceProvider.providerName = data["providerName"];
            serviceProvider.providerNameArabic = data["providerNameArabic"];
            serviceProvider.emailId = data["emailId"];
            serviceProvider.phoneNumber = data["phoneNumber"];
            serviceProvider.logoPath = data["logoPath"];
            serviceProvider.description = data["description"];
            serviceProvider.descriptionArabic = data["descriptionArabic"];
            serviceProvider.availableServiceOption = data["availableServiceOption"];
            serviceProvider.address = data["address"];
            serviceProvider.adderssArabic = data["adderssArabic"];
            serviceProvider.contactPersonName = data["contactPersonName"];
            serviceProvider.latitude = data["latitude"];
            serviceProvider.longitude = data["longitude"];
            serviceProvider.contactPersonNameArabic = data["contactPersonNameArabic"];
            serviceProvider.serviceProviderType = data["serviceProviderType"];
            serviceProvider.isActive = data["isActive"];
            serviceProvider.serviceCoverageRadius = data["serviceCoverageRadius"];
            serviceProvider.ineligiblePackages = data["ineligiblePackages"];
            serviceProvider.inelligibleLabTests = data["inelligibleLabTests"];
            serviceProvider.ineligibleOtherServices = data["ineligibleOtherServices"];

            providerDetails.push(serviceProvider);
        
        return providerDetails;
    }
};