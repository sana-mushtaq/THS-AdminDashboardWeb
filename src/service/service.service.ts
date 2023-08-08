import { Injectable } from "@angular/core"
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment"

@Injectable({ providedIn: "root" })

export class ServiceService {

    private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
    private serverUrl : string = environment.domainName
    private serviceUrl : string = this.serverUrl+'dashboard/service'

    constructor(private _httpClient: HttpClient) {}

    //the following function will fetch all the branches from the backend
    getServiceList() {

      return this._httpClient.get<any>( this.serviceUrl+'/getServiceList')

    }
    
    //the following function will fetch all the branches from the backend
    getServiceListToAssign() {
        
      return this._httpClient.get<any>( this.serviceUrl+'/getServiceListToAssign')

    }

    //the following function will create a service provider in the backed based on the parameters receieved
    createService(body) {

      return this._httpClient.post<any>( this.serviceUrl+'/createService', body )

    }

    //the following function will update service status in the backed based on the parameters receieved
    updateServiceStatus(body) {

      return this._httpClient.post<any>( this.serviceUrl+'/updateServiceStatus', body )

    }

    //the following function will update service data based on the parameteres recieved
    updateService(body) {

      return this._httpClient.post<any>( this.serviceUrl+'/updateService', body )

    }

    //the following function will delete service based on the parameters recieved
    deleteService(body) {

      return this._httpClient.post<any>( this.serviceUrl+'/deleteService', body )

    }

  }