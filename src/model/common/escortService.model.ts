export class EscortService {    


    serviceId: number;
    sectorId: number;
    serviceCategoryId: number;
    title: string;
    titleArabic: string;
    imagePath: string;
    servicePrice: string;
    serviceDescription:string;
    serviceDescriptionArabic: string;
    serviceSecDescription: string;
    serviceSecDescriptionArabic: string;
    isActive: number;
    offerings:[];
    

    static getEscortServiceList(responseData): EscortService[] {
        var serviceList: Array<EscortService> = [];
        let escortServiceList = responseData["escortServices"];
        escortServiceList.forEach(item => {
            let list = new EscortService();
            list.serviceId = item["serviceId"];
            list.sectorId = item["sectorId"];
            list.serviceCategoryId = item["serviceCategoryId"];
            list.isActive = item["isActive"];
            list.title = item["title"];

            list.titleArabic = item["titleArabic"];
            list.imagePath = item["imagePath"];
            list.servicePrice = item["servicePrice"];
            list.serviceDescription = item["serviceDescription"];
            list.serviceDescriptionArabic = item["serviceDescriptionArabic"];
            list.serviceSecDescription = item["serviceSecDescription"];
            list.serviceSecDescriptionArabic = item["serviceSecDescriptionArabic"];
            list.offerings = item["offerings"];
            
            serviceList.push(list);
        });
        return serviceList;
    }
    
}
