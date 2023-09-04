import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BusinessToCustomerSchedulingService } from './business-to-customer-scheduling.service';
import { APIResponse } from 'src/utils/app-enum';

@Injectable({
  providedIn: 'root'
})
export class WebsiteDataService {

  private dataSubject = new BehaviorSubject<any>(null)
  public data$ = this.dataSubject.asObservable()
  private categoryId: number
  private serviceId: number
  public cartLengthSubject = new BehaviorSubject<number>(0);
  public cartLength$ = this.cartLengthSubject.asObservable();

  constructor(
    private _b2c: BusinessToCustomerSchedulingService
  ) { 

    const initialCartData = JSON.parse(localStorage.getItem('THSCart') || '[]');
    this.cartLengthSubject.next(initialCartData.length);

  }

  setData(data: any) {
    
    this.dataSubject.next(data)

  }

  setCategoryId(id) {

    this.categoryId = id

  }

  getCategoryId() {

    return this.categoryId

  }
 
  setServiceId(id) {

    this.serviceId = id

  }

  getServiceId() {

    return this.serviceId
  
  }

  getData(data) {
    
      //when we have user location, we wil fetch its nearest branch and its related services
      this._b2c.businessToCustomerRequest(data).subscribe({
    
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
  
            this.setData(res.data)
  
            this.data$.subscribe((data) => {
  
           })          
  
          } else {
  
         
          }
          
        },
        error: ( err: any ) => {
          
          console.log(err)
  
        }
    
      })
    
  }

  updateCartLength() {
    const cartData = JSON.parse(localStorage.getItem('THSCart') || '[]');
    this.cartLengthSubject.next(cartData.length);
  }
  
}
