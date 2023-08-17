// THS-25
import { Injectable } from "@angular/core"
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})

export class BusinessToCustomerSchedulingService {

  private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
  private serverUrl : string = environment.domainName
  private serviceUrl : string = this.serverUrl+'booking'

  constructor(private _httpClient: HttpClient) {}

  businessToCustomerRequest(body) {

    return this._httpClient.post<any>( this.serviceUrl+'/businessToCustomerRequest', body)

  }
    
}