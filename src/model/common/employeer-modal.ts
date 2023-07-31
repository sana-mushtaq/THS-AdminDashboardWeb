export class Employeer {
    employeerId: number;
    employeerName: string;
    employeerNameArabic: string;
    logoPath: string;
    contactPersonName: string;
    contactPersonNameArabic: string;
    email: string;
    mobile: string;
    address: string;
    isActive: number;
    website: string;
    employeerAccessCode: string;

    optedPackageIds;
    optedLabIds;
  
    static getEmployeerList(response): Employeer[] {
      var employeerList: Employeer[] = [];
      let employeerListResponse = response["employeerList"];
  
      employeerListResponse.forEach((data) => {
        let employee = new Employeer();
        employee.employeerId = data.employeerId;
        employee.employeerName = data.employeerName;
        employee.employeerNameArabic = data.employeerNameArabic;
        employee.email = data.email;
        employee.logoPath = data.logoPath;
        employee.contactPersonName = data.contactPersonName;
        employee.contactPersonNameArabic = data.contactPersonNameArabic;
        employee.address = data.address;
        employee.mobile = data.mobile;
        employee.website = data.website;
        employee.isActive = data.isActive;
        employee.employeerAccessCode = data.employeerAccessCode;
        employeerList.push(employee);
      });
      return employeerList;
    }

    static getEmployeerDetails(response): Employeer[] {
      var employeeDetails = [];
      let data = response["employeeDetails"];
  
      
        let employee = new Employeer();
        employee.employeerId = data["employeerId"];
        employee.employeerName = data["employeerName"];
        employee.employeerNameArabic = data["employeerNameArabic"];
        employee.email = data["email"];
        employee.logoPath = data["logoPath"];
        employee.contactPersonName = data["contactPersonName"];
        employee.contactPersonNameArabic = data["contactPersonNameArabic"];
        employee.address = data["address"];
        employee.mobile = data["mobile"];
        employee.website = data["website"];
        employee.isActive = data["isActive"];
        employee.employeerAccessCode = data["employeerAccessCode"];
        employee.optedPackageIds = data["optedPackageIds"];
        employee.optedLabIds = data["optedLabIds"];

        employeeDetails.push(employee);

        return employeeDetails;
    }
  
    static zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }
  }