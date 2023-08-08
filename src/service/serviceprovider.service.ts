import { Injectable } from "@angular/core"
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment"

@Injectable({ providedIn: "root" })

export class ServiceproviderService {

    private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
    private serverUrl : string = environment.domainName
    private serviceProviderUrl : string = this.serverUrl+'dashboard/serviceprovider'

    constructor(private _httpClient: HttpClient) {}

    //the following function will fetch all the branches from the backend
    getServiceProviderList(body) {
        
      return this._httpClient.post<any>( this.serviceProviderUrl+'/getServiceProviderList', body)

    }

    //the following function will create a service provider in the backed based on the parameters receieved
    createServiceProvider(body) {

      return this._httpClient.post<any>( this.serviceProviderUrl+'/createServiceProvider', body )

    }

    //the following function will assign branch to service provider
    assignBranch(body) {

      return this._httpClient.post<any>( this.serviceProviderUrl+'/assignBranch', body )

    }

    //the following function will unassign branch for service provider
    unassignBranch(body) {

      return this._httpClient.post<any>( this.serviceProviderUrl+'/unassignBranch', body )

    }

     //the following function will assign service for service provider
    assignServices(body) {

      return this._httpClient.post<any>( this.serviceProviderUrl+'/assignServices', body )

    }

    //the foolwoing function will fetch services assigned to a service provider
    getAssignedServices(body) {
      
      return this._httpClient.post<any>( this.serviceProviderUrl+'/getAssignedServices', body )

    }
    
    //the following function will unassign service for service provider
    unassignService(body) {

      return this._httpClient.post<any>( this.serviceProviderUrl+'/unassignService', body )

    }
 
}