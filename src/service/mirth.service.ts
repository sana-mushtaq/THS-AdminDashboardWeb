import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class MirthService {

  private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
  private serverUrl : string = environment.domainName;
  private mirthUrl : string = this.serverUrl+'mirth/appointment-request';

  constructor(private _httpClient: HttpClient) {}

  getAllRequest( options : any ){
    let params = new HttpParams();
    params = params.append('pageNumber', options.pageNumber );
    params = params.append('pageSize', options.pageSize );
    params = params.append('search', options.search );
    return this._httpClient.get<any>(this.mirthUrl+'/get-all-requests', {params: params, headers : this.httpOptions.headers});
  }

  getSingleRequest( id : any ){
    let params = new HttpParams();
    params = params.append('request_id', id );
    return this._httpClient.get<any>(this.mirthUrl+'/get-single-requests', {params: params, headers : this.httpOptions.headers});
  }

  createAppointment(  body : any ){
    return this._httpClient.post<any>(this.mirthUrl+'/create-appointment', body ); 
  }
}
