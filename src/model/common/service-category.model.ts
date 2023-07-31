export class ServiceCategory {
    serviceId: number;
    categoryName: string;
    categoryNameArabic: string;
    isActive: number;

    //COMMON SERVICE

    serviceCategoryId: number;
    serviceSectorId: number;
    serviceCategoryName: string;
    serviceCategoryNameArabic: string;
    sectorName: string;
    sectorNameArabic: string;
    serviceCategoryImagePath: string;

    static getLabServiceCategories(responseData): ServiceCategory[] {
        var labCategories: Array<ServiceCategory> = [];
        let categories = responseData["labTestCategories"];
        categories.forEach(category => {
            let serviceCategory = new ServiceCategory();
            serviceCategory.serviceId = category["labTestCategoryId"];
            serviceCategory.categoryName = category["labTestCategoryName"]
            serviceCategory.categoryNameArabic = category["labTestCategoryNameArabic"]
            serviceCategory.isActive = category["isActive"]
            labCategories.push(serviceCategory);
        });
        return labCategories;
    }

    static getServicePackageCategories(responseData): ServiceCategory[] {
        var servicePackages: Array<ServiceCategory> = [];
        let categories = responseData["servicePackageCategories"];
        categories.forEach(category => {
            let serviceCategory = new ServiceCategory();
            serviceCategory.serviceId = category["servicePackageCategoryId"];
            serviceCategory.categoryName = category["pacakgeCategoryName"]
            serviceCategory.categoryNameArabic = category["packageCategoryNameArabic"]
            serviceCategory.isActive = category["isActive"]
            servicePackages.push(serviceCategory);
        });
        return servicePackages;
    }
    static getcommonServiceCategories(responseData): ServiceCategory[] {
        var servicePackages: Array<ServiceCategory> = [];
        let categories = responseData["commonServiceCategories"];
        categories.forEach(category => {
            let serviceCategory = new ServiceCategory();
            serviceCategory.serviceCategoryId = category["serviceCategoryId"];
            serviceCategory.serviceSectorId = category["serviceSectorId"];
            serviceCategory.serviceCategoryName = category["serviceCategoryName"];
            serviceCategory.serviceCategoryNameArabic = category["serviceCategoryNameArabic"];
            serviceCategory.sectorName = category["sectorName"];
            serviceCategory.sectorNameArabic = category["sectorNameArabic"];
            serviceCategory.serviceCategoryImagePath = category["serviceCategoryImagePath"];
            
            servicePackages.push(serviceCategory);
        });
        return servicePackages;
    }

    
}
