import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class PatientsService {

    private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
    private serverUrl : string = environment.domainName;
    private patientUrl : string = this.serverUrl+'care-provider/patients';

    constructor(private _httpClient: HttpClient) {}

    search( query : string ){
        return this._httpClient.post<any>(this.patientUrl+'/search', { query : query } );
    }

    getPatientDependents( patientId : any ){
        let params = new HttpParams();
        params = params.append('patientId', patientId );
        return this._httpClient.get<any>(this.patientUrl+'/get-patient-dependents', {params: params, headers : this.httpOptions.headers});
    }

    create( data : string ){
        return this._httpClient.post<any>(this.patientUrl+'/create', data );
    }

    serviceCategories( body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/service-categories', body );
    }

    getServicesByCategory( body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/services-by-category', body );
    }

    searchServicesByType( body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/search-services-by-type', body );
    }

    getQuote(  body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/get-appointment-quote', body ); 
    }

    createAppointment(  body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/create-appointment', body ); 
    }

    createPayment(  body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/create-payment', body ); 
    }

    verifyPayment(  body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/verify-payment', body ); 
    }

    sendSMS(  body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/send-sms', body ); 
    }

    getPatientSources(){
        return this._httpClient.get<any>(this.patientUrl+'/get-patient-sources' ); 
    }

    approveManualPayment( body : any ){
        return this._httpClient.post<any>(this.patientUrl+'/approve-manual-payment', body ); 
    }
}
