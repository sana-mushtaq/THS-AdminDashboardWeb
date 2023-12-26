import * as moment from "moment";

export class Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: number;
  address: string;
  bloodGroup: string;
  dob: string;
  isActive: number;
  sourceName: string;
  sourceId: number;
  nationalId: string;
  walletBalance: string;
  nationality: string;
  insurance_data: any;

  genderText: string;
  patientDisplayId: string;
  otp: string;

  profileImagePath;

  createdDate: string;

  searchName: string;

  static getPatientsList(response): Patient[] {
    var patientList: Array<Patient> = [];
    let patientsResponse = response["patientList"];

    patientsResponse.forEach((data) => {
      var patient = new Patient();
      patient.patientId = data["patientId"];
      patient.firstName = data["firstName"];
      patient.lastName = data["lastName"];
      patient.email = data["email"];
      patient.mobileNumber = data["mobileNumber"];
      patient.gender = data["gender"];
      patient.address = data["address"];
      patient.bloodGroup = data["bloodGroup"];
      patient.dob = data["dob"];
      patient.isActive = data["isActive"];
      patient.sourceName = data["sourceName"];
      patient.sourceId = data["sourceId"];
      patient.nationalId = data["idNumber"];
      patient.walletBalance = data["walletBalance"];
      patient.patientDisplayId = "PAT" + Patient.zeroPad(patient.patientId, 4);
      patient.insurance_data = data["insurance_data"];
      var gender = data["gender"];
      if (gender == "1") {
        patient.genderText = "Male";
      } else if (gender == "2") {
        patient.genderText = "Female";
      }
      patient.gender = gender;

      patientList.push(patient);
    });
    return patientList;
  }

  static getPatientsDetail(response): Patient[] {
    var patientList: Array<Patient> = [];
    let patientsResponse = response["patientProfile"];

    patientsResponse.forEach((data) => {
      var patient = new Patient();
      patient.patientId = data["userId"];
      patient.firstName = data["firstName"];
      patient.lastName = data["lastName"];
      patient.email = data["email"];
      patient.mobileNumber = data["mobile"];
      patient.gender = data["gender"];
      patient.dob = data["dob"];
      patient.nationality = data["nationality"];
      patient.nationalId = data["nationalId"];
      patient.walletBalance = data["walletBalance"];
      patient.insurance_data = data["insurance_data"];
      var gender = data["gender"];
      if (gender == "1") {
        patient.genderText = "Male";
      } else if (gender == "2") {
        patient.genderText = "Female";
      }
      patient.gender = gender;

      patientList.push(patient);
    });

    return patientList;
  }

  static getPatientDependent(response): Patient[] {
    var patientList: Array<Patient> = [];
    let patientsResponse = response["patientDependents"];

    patientsResponse.forEach((data) => {
      var patient = new Patient();
      patient.patientId = data["userId"];
      patient.firstName = data["firstName"];
      patient.lastName = data["lastName"];
      patient.email = data["email"];
      patient.mobileNumber = data["mobileNumber"];
      patient.gender = data["gender"];
      patient.dob = data["dob"];
      patient.nationality = data["nationality"];
      patient.nationalId = data["nationalId"];
      patient.profileImagePath = data["profileImagePath"];
      patient.insurance_data = data["insurance_data"];
      var gender = data["gender"];
      if (gender == "1") {
        patient.genderText = "Male";
      } else if (gender == "2") {
        patient.genderText = "Female";
      }
      patient.gender = gender;
      patient.patientDisplayId = "PAT" + Patient.zeroPad(patient.patientId, 4);

      patientList.push(patient);
    });

    return patientList;
  }

  static zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }

  static getUnverifiedPatientsList(response): Patient[] {
    var patientList: Array<Patient> = [];
    let patientsResponse = response["patientList"];

    patientsResponse.forEach((data) => {
      var patient = new Patient();
      patient.patientId = data["patientId"];
      patient.firstName = data["firstName"];
      patient.lastName = data["lastName"];
      patient.email = data["email"];
      patient.mobileNumber = data["mobileNumber"];
      patient.gender = data["gender"];
      patient.address = data["address"];
      patient.bloodGroup = data["bloodGroup"];
      patient.dob = data["dob"];
      patient.isActive = data["isActive"];
      patient.sourceName = data["sourceName"];
      patient.sourceId = data["sourceId"];
      patient.nationalId = data["idNumber"];
      patient.walletBalance = data["walletBalance"];
      patient.patientDisplayId = "PAT" + Patient.zeroPad(patient.patientId, 4);
      patient.createdDate = moment(data["createdDate"], "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      patient.insurance_data = data["insurance_data"];
      patient.otp = data["otp"];

      var gender = data["gender"];
      if (gender == "1") {
        patient.genderText = "Male";
      } else if (gender == "2") {
        patient.genderText = "Female";
      }
      patient.gender = gender;

      patientList.push(patient);
    });
    return patientList;
  }

  static getPatientsListforSearch(response): Patient[] {
    var patientList: Array<Patient> = [];
    let patientsResponse = response["patientList"];

    patientsResponse.forEach((data) => {
      var patient = new Patient();
      patient.patientId = data["patientId"];
      patient.searchName = data["firstName"] + data["lastName"] + " - "+ "PAT" + Patient.zeroPad(patient.patientId, 4);

      patientList.push(patient);
    });
    return patientList;
  }
}
