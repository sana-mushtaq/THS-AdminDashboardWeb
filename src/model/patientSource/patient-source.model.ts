export class PatientSource {
  sourceId: number;
  sourceName: string;
  sourceNameArabic: string;

  static getPatientSources(data): PatientSource[] {
    var patientSources: PatientSource[] = [];
    let sources = data["patientSources"];
    sources.forEach((source) => {
      let patientSource = new PatientSource();
      patientSource.sourceId = source.sourceId;
      patientSource.sourceName = source.sourceName;
      patientSource.sourceNameArabic = source.sourceNameArabic;
      patientSources.push(patientSource);
    });
    return patientSources;
  }
}
