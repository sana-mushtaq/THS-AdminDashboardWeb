import { Injectable } from "@angular/core"
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: "root" })

export class BranchService {

    private httpOptions : any  = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
    private serverUrl : string = environment.domainName
    private branchUrl : string = this.serverUrl+'dashboard/branch'

    constructor(private _httpClient: HttpClient) {}

    //the following function will fetch all the branches from the backend
    getBranchList() {
        
      return this._httpClient.get<any>( this.branchUrl+'/getBranchList' )

    }

    //the following function will add a new branch in the system based on the parameters recieved
    createBranch(body) {

      return this._httpClient.post<any>( this.branchUrl+'/createBranch', body )

    }

    //the following function will update branch status based on the paramameters recieved
    updateBranch(body) {

      return this._httpClient.post<any>( this.branchUrl+'/updateBranch', body )

    }

    //the following function will update branch status based on the paramameters recieved
    updateBranchStatus(body) {

      return this._httpClient.post<any>( this.branchUrl+'/updateBranchStatus', body )

    }

    //the following function will delete branch based on the parameters received
    deleteBranch(body) {

      return this._httpClient.post<any>( this.branchUrl+'/deleteBranch', body )

    }

}