import { Injectable } from "@angular/core"
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class MedicaltagService {

  private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
  private serverUrl : string = environment.domainName
  private serviceCategoryUrl : string = this.serverUrl+'dashboard/medicaltag'

  constructor(private _httpClient: HttpClient) {}

  //the following function will fetch all the branches from the backend
  getTagList() {
        
    return this._httpClient.get<any>( this.serviceCategoryUrl+'/getTagList')

  }

  //the following function will create service category based on the parameters recieved
  createTag(body) {

    return this._httpClient.post<any>( this.serviceCategoryUrl+'/createTag', body)

  }

  //the following function will delete service category based on the parameters recieved
  deleteTag(body) {

    return this._httpClient.post<any>( this.serviceCategoryUrl+'/deleteTag', body)

  }

  //the following function will update service category based on the parameters recieved
  updateTag(body) {

    return this._httpClient.post<any>( this.serviceCategoryUrl+'/updateTag', body)
  }
}
