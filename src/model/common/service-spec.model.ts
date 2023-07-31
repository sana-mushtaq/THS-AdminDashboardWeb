export class ServiceSpec {
  serviceId: string;
  serviceType: number;
  serviceName: string;
  serviceCategoryName: string;
  serviceCategoryId: number;
  noOfTestsIncluded: string;
  servicePrice: string;

  static getIndividualTestList(data): ServiceSpec[] {
    var individualTests: ServiceSpec[] = [];
    let tests = data["individualTests"];
    tests.forEach((testDetails) => {
      let testList = testDetails.tests;
      testList.forEach((test) => {
        let individualTest = new ServiceSpec();
        individualTest.serviceCategoryName = testDetails.serviceCategoryName;
        individualTest.serviceCategoryId = testDetails.serviceCategoryId;
        individualTest.serviceId = test.testId;
        individualTest.serviceName = test.testName;
        individualTest.servicePrice = test.servicePrice;
        individualTest.serviceType = 2;
        individualTests.push(individualTest);
      });
    });
    return individualTests;
  }

  static getServicePackageList(data): ServiceSpec[] {
    var servicePackages: ServiceSpec[] = [];
    let packagesList = data["labPackages"];
    packagesList.forEach((sPackage) => {
      let packages = sPackage.packages;
      packages.forEach((packageDetails) => {
        let servicepackage = new ServiceSpec();
        servicepackage.serviceCategoryName = sPackage.serviceCategoryName;
        servicepackage.serviceCategoryId = sPackage.serviceCategoryId;
        servicepackage.serviceId = packageDetails.serviceId;
        servicepackage.serviceName = packageDetails.serviceName;
        servicepackage.noOfTestsIncluded = packageDetails.noOfTestsIncluded;
        servicepackage.servicePrice = packageDetails.servicePrice;
        servicepackage.serviceType = 1;
        servicePackages.push(servicepackage);
      });
    });
    return servicePackages;
  }

  static getCommonServiceList(data): ServiceSpec[] {
    var commonServices: ServiceSpec[] = [];
    let servcieData = data["serviceList"];
    servcieData.forEach((service) => {
      let commonService = new ServiceSpec();
      commonService.serviceId = service.serviceId;
      commonService.serviceName = service.serviceName;
      commonService.servicePrice = service.servicePrice;
      commonService.serviceCategoryId = 1;
      commonService.serviceType = 2;
      commonServices.push(commonService);
    });
    return commonServices;
  }
}
