export class PatientUser {
  userId: string;
  firstName: string;
  lastName: string;
  gender: string;
  idType: string;
  nationalId: string;
  mobileNumber: string;
  emailId: string;
  dob: string;

  static getDependentList(data): PatientUser[] {
    var dependents: PatientUser[] = [];
    let dependentList = data["dependants"];
    dependentList.forEach((depedentData) => {
      let dependent = new PatientUser();
      dependent.userId = depedentData.userId;
      dependent.firstName = depedentData.firstName;
      dependent.lastName = depedentData.lastName;
      dependent.nationalId = depedentData.nationalId;
      dependent.idType = depedentData?.idType || '';

      let gender = depedentData.gender;

      if (gender == 1) {
        dependent.gender = "Male";
      } else {
        dependent.gender = "Female";
      }
      dependents.push(dependent);
    });
    return dependents;
  }

  static getPatientList(data): PatientUser[] {
    var patientUsers: PatientUser[] = [];
    let patientListData = data["patientDetails"];
    patientListData.forEach((patientData) => {
      let patientUser = new PatientUser();
      patientUser.userId = patientData.patientId;
      patientUser.firstName = patientData.firstName;
      patientUser.lastName = patientData.lastName;
      patientUser.idType = patientData?.idType || '';
      patientUser.nationalId = patientData.idNumber;
      patientUser.emailId = patientData.email;
      patientUser.mobileNumber = patientData.mobileNumber;
      patientUser.dob = patientData.dob;

      let gender = patientData.gender;

      if (gender == 1) {
        patientUser.gender = "Male";
      } else {
        patientUser.gender = "Female";
      }
      patientUsers.push(patientUser);
    });
    return patientUsers;
  }
}
