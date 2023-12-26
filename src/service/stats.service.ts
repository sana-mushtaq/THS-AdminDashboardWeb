import { Injectable } from "@angular/core"
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment"
@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
  private serverUrl : string = environment.domainName
  private statsUrl : string = this.serverUrl+'dashboard/stats'

  constructor(private _httpClient: HttpClient) {}

  //the following function will fetch all patients
  getPatientCount(params) {
        
    return this._httpClient.post<any>( this.statsUrl+'/numberOfPatients', params)

  }

  getPatientCountPerDay(params) {
        
    return this._httpClient.post<any>( this.statsUrl+'/numberOfPatientsPerDay', params)

  }

  getAppointmentScheduled(params) {
        
    return this._httpClient.post<any>( this.statsUrl+'/numberOfScheduledAppointments', params)

  }

  getAppointmentCanceled(params) {
        
    return this._httpClient.post<any>( this.statsUrl+'/numberOfCanceledAppointments', params)

  }
  
  getConfidenceInTreatment(params) {
        
    return this._httpClient.post<any>( this.statsUrl+'/confidenceInTreatment', params)

  }

  getServiceRevenue(body) {

    return this._httpClient.post<any>(this.statsUrl+'/getServiceRevenue', body)

  }

  getCategoryRevenue(body) {

    return this._httpClient.post<any>(this.statsUrl+'/getCategoryRevenue', body)

  }

  getNumberOfStaff(body) {

    return this._httpClient.post<any>(this.statsUrl+'/numberOfStaff', body)

  }

  getStaffPerformance(body) {

    return this._httpClient.post<any>(this.statsUrl+'/staffPerformance', body)

  }

  getUtilizationRate(body) {

    return this._httpClient.post<any>(this.statsUrl+'/utilizationRate', body)

  }

}