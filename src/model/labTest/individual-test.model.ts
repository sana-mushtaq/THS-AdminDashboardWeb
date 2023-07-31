export class IndividualTest {
    serviceId: number;
    serviceCategoryId: number;
    serviceSectorId: number;
    serviceName: string;
    serviceNameArabic: string;
    instructions: string;
    instructionsArabic: string;
    servicePrice: number;
    serviceDescription: string;
    serviceDescriptionArabic: string;

    labTestCategoryName: string;
    labTestCategoryNameArabic: string;
    isActive: number;

    static getIndividualTestList(data): IndividualTest[] {
        var individualTests: IndividualTest[] = [];
        let tests = data["individualTests"];
        tests.forEach(test => {
            let individualTest = new IndividualTest();
            individualTest.serviceId = test.serviceId;
            individualTest.serviceCategoryId = test.serviceCategoryId;
            individualTest.serviceSectorId = test.serviceSectorId;
            individualTest.serviceName = test.serviceName;
            individualTest.serviceNameArabic = test.serviceNameArabic;
            individualTest.instructions = test.instructions;
            individualTest.instructionsArabic = test.instructionsArabic;
            individualTest.servicePrice = test.servicePrice;
            individualTest.serviceDescription = test.serviceDescription;
            individualTest.serviceDescriptionArabic = test.serviceDescriptionArabic;
            individualTest.isActive = test.isActive;
            individualTest.labTestCategoryName = test.labTestCategoryName;
            individualTest.labTestCategoryNameArabic = test.labTestCategoryNameArabic;
            individualTests.push(individualTest);
        });
        return individualTests;
    }
}


