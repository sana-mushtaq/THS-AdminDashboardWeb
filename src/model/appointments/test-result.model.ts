export class TestResult {
  fileName: string;
  fileLink: string;
  resultId: string;

  resultReadingFileName: string;
  resultReadingFileUrl: string;

  static getLabResults(labResults): TestResult[] {
    let results: TestResult[] = [];
    labResults.forEach((result) => {
      let labResult = new TestResult();
      labResult.fileName = result.fileName;
      labResult.fileLink = result.fileLink;
      labResult.resultId = result.resultId;
      labResult.resultReadingFileName = result.resultReadingFileName;
      labResult.resultReadingFileUrl = result.resultReadingFileUrl;
      results.push(labResult);
    });
    return results;
  }
}
