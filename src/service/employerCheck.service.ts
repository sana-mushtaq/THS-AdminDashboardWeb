import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class EmployerCheckService {
    private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
    private serverUrl : string = environment.domainName;
    private employerCheckUrl : string = this.serverUrl+'care-provider/check-employer';

    constructor(private _httpClient: HttpClient) {}

    createEmployer( data : any ){
        return this._httpClient.post<any>(this.employerCheckUrl+'/create', data );
    }

    getSingleEmployer( id : string) {
        let params = new HttpParams();
        params = params.append('id', id);
        return this._httpClient.get<any>(this.employerCheckUrl+'/single', { headers: this.httpOptions.headers, params: params });
    }

    getEmployerList() {
        return this._httpClient.get<any>(this.employerCheckUrl+'/list', { headers: this.httpOptions.headers });
    }

    updateEmployer( data : any ){
        return this._httpClient.put<any>(this.employerCheckUrl+'/update', data );
    }

}
