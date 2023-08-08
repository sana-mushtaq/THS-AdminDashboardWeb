
import { Injectable } from "@angular/core"
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment"

@Injectable({ providedIn: "root" })

export class ServicecategoryService {

    private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
    private serverUrl : string = environment.domainName
    private serviceCategoryUrl : string = this.serverUrl+'dashboard/servicecategory'

    constructor(private _httpClient: HttpClient) {}

    //the following function will fetch all the branches from the backend
    getCategoryList() {
        
      return this._httpClient.get<any>( this.serviceCategoryUrl+'/getCategoryList')

    }

    //the following function will create service category based on the parameters recieved
    createCategory(body) {

      return this._httpClient.post<any>( this.serviceCategoryUrl+'/createCategory', body)

    }

    //the following function will delete service category based on the parameters recieved
    deleteCategory(body) {

      return this._httpClient.post<any>( this.serviceCategoryUrl+'/deleteCategory', body)

    }

    //the following function will update service category based on the parameters recieved
    updateCategoryStatus(body) {

      return this._httpClient.post<any>( this.serviceCategoryUrl+'/updateCategoryStatus', body)

    }

    //the following function will update service category based on the parameters recieved
    updateCategory(body) {

      return this._httpClient.post<any>( this.serviceCategoryUrl+'/updateCategory', body)

    }

}