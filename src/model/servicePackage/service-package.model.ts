export class ServicePackage {
    packageId: number;
    servicePackageCategoryId: number;
    serviceSectorId: number;
    packageName: string;
    packageNameArabic: string;
    instructions: string;
    instructionsArabic: string;
    packagePrice: number;
    packageDescription: string;
    packageDescriptionArabic: string;
    noOfTestsIncluded: number;
    testsIncluded: string;
    pacakgeCategoryName: string;
    packageCategoryNameArabic: string;
    isActive: number;
    imagePath: string;


    static getServicePackageList(data): ServicePackage[] {
        var servicePackages: ServicePackage[] = [];
        let packages = data["servicePackages"];
        packages.forEach(sPackage => {
            let servicepackage = new ServicePackage();
            servicepackage.packageId = sPackage.packageId;
            servicepackage.servicePackageCategoryId = sPackage.servicePackageCategoryId;
            servicepackage.serviceSectorId = sPackage.serviceSectorId;
            servicepackage.packageName = sPackage.packageName;
            servicepackage.packageNameArabic = sPackage.packageNameArabic;
            servicepackage.instructions = sPackage.instructions;
            servicepackage.instructionsArabic = sPackage.instructionsArabic;
            servicepackage.packagePrice = sPackage.packagePrice;
            servicepackage.packageDescription = sPackage.packageDescription;
            servicepackage.packageDescriptionArabic = sPackage.packageDescriptionArabic;
            servicepackage.noOfTestsIncluded = sPackage.noOfTestsIncluded;
            servicepackage.testsIncluded = sPackage.testsIncluded;
            servicepackage.pacakgeCategoryName = sPackage.pacakgeCategoryName;
            servicepackage.packageCategoryNameArabic = sPackage.packageCategoryNameArabic;
            servicepackage.isActive = sPackage.isActive;
            servicepackage.imagePath = sPackage.imagePath;
            servicePackages.push(servicepackage);
        });
        return servicePackages;
    }
    static getServicePackageListEmp(data): ServicePackage[] {
        var servicePackages: ServicePackage[] = [];
        let packages = data["packages"];
        packages.forEach(sPackage => {
            let servicepackage = new ServicePackage();
            servicepackage.packageId = sPackage.packageId;
            servicepackage.servicePackageCategoryId = sPackage.servicePackageCategoryId;
            servicepackage.serviceSectorId = sPackage.serviceSectorId;
            servicepackage.packageName = sPackage.packageName;
            servicepackage.packageNameArabic = sPackage.packageNameArabic;
            servicepackage.instructions = sPackage.instructions;
            servicepackage.instructionsArabic = sPackage.instructionsArabic;
            servicepackage.packagePrice = sPackage.packagePrice;
            servicepackage.packageDescription = sPackage.packageDescription;
            servicepackage.packageDescriptionArabic = sPackage.packageDescriptionArabic;
            servicepackage.noOfTestsIncluded = sPackage.noOfTestsIncluded;
            servicepackage.testsIncluded = sPackage.testsIncluded;
            servicepackage.pacakgeCategoryName = sPackage.pacakgeCategoryName;
            servicepackage.packageCategoryNameArabic = sPackage.packageCategoryNameArabic;
            servicepackage.isActive = sPackage.isActive;
            servicepackage.imagePath = sPackage.imagePath;
            servicePackages.push(servicepackage);
        });
        return servicePackages;
    }
    
}


