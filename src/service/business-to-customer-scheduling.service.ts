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
  private b2cUrl : string = this.serverUrl+'booking'

  constructor(private _httpClient: HttpClient) {}

  businessToCustomerRequest(body) {

    return this._httpClient.post<any>( this.b2cUrl+'/businessToCustomerRequest', body)

  }

  checkServiceProviderEligibilty(body) {

    return this._httpClient.post<any>( this.b2cUrl+'/serviceProviderEligibility', body)

  }

  getServiceProviderService(body) {

    return this._httpClient.post<any>( this.b2cUrl+'/getServiceProviderService', body)

  }
    
  verifyTotal(body) {

    return this._httpClient.post<any>( this.b2cUrl+'/verifyTotal', body)

  }

  businessToCustomerAppointment(body) {

    return this._httpClient.post<any>( this.b2cUrl+'/businessToCustomerAppointment', body)
 
  }

  generatePaymentLink(body) {

    return this._httpClient.post<any>( this.b2cUrl+'/generatePaymentLink', body)
 
  }

  
  verifyPaymentStatus(body) {

    return this._httpClient.post<any>( this.b2cUrl+'/verifyPaymentStatus', body)
 
  }

  verifyDiscount(body) {

    return this._httpClient.post<any>(this.b2cUrl+'/verifyDiscountCode', body)

  }
 
  verifyAppointment(body) {

    return this._httpClient.post<any>(this.b2cUrl+'/verifyAppointment', body)

  }

   
  createB2B(body) {

    return this._httpClient.post<any>(this.b2cUrl+'/createB2B', body)

  }

  getB2B(body) {

    return this._httpClient.post<any>(this.b2cUrl+'/getB2B', body)

  }

  getSocketData(body) {

    return this._httpClient.post<any>(this.b2cUrl+'/getSocketData', body)

  }

  fetchb2bServiceProviders(body) {

    return this._httpClient.post<any>(this.b2cUrl+'/fetchb2bServiceProviders', body)

  }

    
}