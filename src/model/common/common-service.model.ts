export class CommonService {
    serviceId: number;
    sectorId: number;
    title: string;
    titleArabic: string;
    imagePath: string;
    servicePrice: number;
    serviceDescription: string;
    serviceDescriptionArabic: string;
    serviceSecDescription: string;
    serviceSecDescriptionArabic: string;
    isActive: number;
    sectorName: string;

    //CATEGORY DETAILS

    serviceCategoryId:number;
    serviceCategoryName: string;
    serviceCategoryNameArabic : string;


    static getCommonServiceList(serviceResponse): CommonService[] {
        var services: CommonService[] = [];
        serviceResponse.forEach(service => {
            let commonService = new CommonService();
            commonService.serviceId = service.serviceId;
            commonService.sectorId = service.sectorId;
            commonService.title = service.title;
            commonService.titleArabic = service.titleArabic;
            commonService.imagePath = service.imagePath;
            commonService.servicePrice = service.servicePrice;
            commonService.serviceDescription = service.serviceDescription;
            commonService.serviceDescriptionArabic = service.serviceDescriptionArabic;
            commonService.serviceSecDescription = service.serviceSecDescription;
            commonService.serviceSecDescriptionArabic = service.serviceSecDescriptionArabic;
            commonService.isActive = service.isActive;
            commonService.sectorName = service.sectorName;
            commonService.serviceCategoryId = service.serviceCategoryId;
            commonService.serviceCategoryName =service.serviceCategoryName;
            commonService.serviceCategoryNameArabic = service.serviceCategoryNameArabic;
            services.push(commonService);
        });
        return services;
    }
}



