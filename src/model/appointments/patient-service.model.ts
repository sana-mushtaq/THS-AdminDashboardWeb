import { PatientUser } from "../common/patient-user.model";
import { Sector } from "../common/sector.model";
import { ServiceSpec } from "../common/service-spec.model";

export class PatientService {
  selectedSector: Sector;
  selectedPatient: PatientUser;
  selectedService: ServiceSpec;
}
