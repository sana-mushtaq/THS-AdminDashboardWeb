import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { APIResponse } from 'src/utils/app-enum';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {

  public paymentStatus : boolean = true
  public verified: boolean = false
  public paymentCaptured: boolean = false

  cartData: any
  appointmentId: any
  name: any
  time: any
  date: any

  //in this component we will generate an appointment
  constructor(
    private route: ActivatedRoute,
    private _b2c: BusinessToCustomerSchedulingService,
    private router: Router,
  ) { 

    this.route.queryParams.subscribe( (params : any) => {
    
      const id : string = params['tap_id'] || ''

      if(['', undefined, null].includes( id.trim())) {
    
        this.paymentStatus = false

      } else {
        
        let data = {

          tap_id: id

        }
  
        /*this._b2c.verifyPaymentStatus(data).subscribe({
              
          next : ( ress : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( ress.status === APIResponse.Success ) {
    
              //if payment is captured then we wil generate an appointment by passing data
              if(ress.payment.status === 'CAPTURED') {

                let appointmentRequest = JSON.parse(localStorage.getItem("THSAppointmentRequest"))
                let payload =  JSON.parse(localStorage.getItem("THSPaylaod"))
                let address = JSON.parse(localStorage.getItem("THSAppointmentAddress"))
                let discount = JSON.parse(localStorage.getItem("THSDiscount"))
                let multiAppointment = JSON.parse(localStorage.getItem("THSMultiAppointment"))
                
                multiAppointment = multiAppointment.filter(app => {

                  return app !==null
                })

                this.cartData = payload.cartData
                this.date = payload.preferredDate
                this.time = payload.preferredTime
                this.name = `${appointmentRequest.userData[0].first_name} ${appointmentRequest.userData[0].last_name} `

                let request = {

                  userData: appointmentRequest.userData,
                  branch_id: address.branch_id,
                  scheduled_date: payload.preferredDate,
                  scheduled_time: payload.preferredTime,
                  cartData: payload.cartData,
                  payment_method: 'tap payments',
                  payment_id: ress.payment.id,
                  payment_status: 'CAPTURED',
                  payment_url: appointmentRequest.paymentURL,
                  longitude: address.user_address.longitude,
                  latitude: address.user_address.latitude,
                  location: `${address.user_address.address_line1} ${address.user_address.address_line2}`,
                  patient_note: payload.patient_note,
                  patient_source_id: 4,
                  additional_items: null,
                  discount_type: discount.discountType,
                  discount_amount: discount.discountAmount,
                  vat_applied: discount.vatApplied,
                  active_offer_id: null,
                  invoice_total: ress.payment.amount,
                  operator_note: null,
                  insurance_id: null,
                  is_insured: false,
                  insurance_provider_id: null,
                  category_id: payload.cartData[0].category_id,
                  multiAppointment: multiAppointment,
                  sourceRef: 'Website'
                
                }

                this._b2c.businessToCustomerAppointment(request).subscribe({
      
                  next : ( res : any ) => {
            
                    //in case of success the api returns 0 as a status code
                    if( res.status === APIResponse.Success ) {
            
                      //if payment is captured then we wil generate an appointment by passing data
                    
                      this.appointmentId = res.data
                      this.paymentCaptured = true
                      this.verified = true

                    } else {
            
                      this.paymentCaptured = false
                      this.verified = true
                      
                    }
                    
                  },
                  error: ( errr: any ) => {
                    
                    console.log(errr)
            
                  }
              
                }) 

              }
    
            } else {
    
          
            }
            
          },
          error: ( err: any ) => {
            
            console.log(err)
    
          }
      
        }) */
        
      this._b2c.verifyAppointment(data).subscribe({
      
          next : ( resss : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( resss.status === APIResponse.Success ) {
    
              if(resss.data.length>0) {

                this.router.navigate(['/'])

              } else {
                   
                this._b2c.verifyPaymentStatus(data).subscribe({
              
                  next : ( ress : any ) => {

                    //in case of success the api returns 0 as a status code
                    if( ress.status === APIResponse.Success) {
            
                      //if payment is captured then we wil generate an appointment by passing data
                      if(ress.payment.status === 'CAPTURED') {

                        this._b2c.verifyPaymentStatus(data).subscribe({
              
                          next : ( ress : any ) => {
                    
                            //in case of success the api returns 0 as a status code
                            if( ress.status === 200 ) {
                    
                              let appointmentRequest = JSON.parse(localStorage.getItem("THSAppointmentRequest"))
                              let payload =  JSON.parse(localStorage.getItem("THSPaylaod"))
                              let address = JSON.parse(localStorage.getItem("THSAppointmentAddress"))
                              let discount = JSON.parse(localStorage.getItem("THSDiscount"))
                              let multiAppointment = JSON.parse(localStorage.getItem("THSMultiAppointment"))
                              let branch = JSON.parse(localStorage.getItem("THSBranch"))
                              multiAppointment = multiAppointment.filter(app => {
              
                                return app !==null
                              })
              
                              this.cartData = payload.cartData
                              this.date = payload.preferredDate
                              this.time = payload.preferredTime
                              this.name = `${appointmentRequest.userData[0].first_name} ${appointmentRequest.userData[0].last_name} `
              
                              let request = {
              
                                userData: appointmentRequest.userData,
                                branch_id: branch,
                                scheduled_date: payload.preferredDate,
                                scheduled_time: payload.preferredTime,
                                cartData: payload.cartData,
                                payment_method: 'tap payments',
                                payment_id: ress.payment.id,
                                payment_status: 'CAPTURED',
                                payment_url: appointmentRequest.paymentURL,
                                longitude: address.user_address.longitude,
                                latitude: address.user_address.latitude,
                                location: `${address.user_address.address_line1} ${address.user_address.address_line2}`,
                                patient_note: payload.patient_note,
                                patient_source_id: 4,
                                additional_items: null,
                                discount_type: discount.discountType,
                                discount_amount: discount.discountAmount,
                                vat_applied: discount.vatApplied,
                                active_offer_id: null,
                                invoice_total: ress.payment.amount,
                                operator_note: null,
                                insurance_id: null,
                                is_insured: false,
                                insurance_provider_id: null,
                                category_id: payload.cartData[0].category_id,
                                multiAppointment: multiAppointment,
                                sourceRef: 'Website'
                              
                              }
              
                              this._b2c.businessToCustomerAppointment(request).subscribe({
                    
                                next : ( res : any ) => {
                          
                                  //in case of success the api returns 0 as a status code
                                  if( res.status === APIResponse.Success ) {
                          
                                    //if payment is captured then we wil generate an appointment by passing data
                                  
                                    this.appointmentId = res.data
                                    this.paymentCaptured = true
                                    this.verified = true

                                    localStorage.removeItem("THSAppointmentRequest")
                                    localStorage.removeItem("THSPaylaod")
                                    localStorage.removeItem("THSAppointmentAddress")
                                    localStorage.removeItem("THSCart")
                                    localStorage.removeItem("THSDiscount")
                                    localStorage.removeItem("THSMultiAppointment")
                                    
                                  } else {
                          
                                    this.paymentCaptured = false
                                    this.verified = true
                                    
                                  }
                                  
                                },
                                error: ( errr: any ) => {
                                  
                                  console.log(errr)
                          
                                }
                            
                              }) 
                            } else {
                    
                              this.paymentCaptured = false
                              this.verified = true
                          
                            }
                            
                          },
                          error: ( err: any ) => {
                            
                            console.log(err)
                            this.paymentCaptured = false
                            this.verified = true
                          }
                      
                        }) 
                                  
                      } else {

                        this.paymentCaptured = false
                        this.verified = true

                      }
            
                    } else {
            
                      this.paymentCaptured = false
                      this.verified = true

                  
                    }
                    
                  },
                  error: ( err: any ) => {
                    
                    console.log(err)
            
                    this.paymentCaptured = false
                    this.verified = true


                    let appointmentRequest = JSON.parse(localStorage.getItem("THSAppointmentRequest"))
                    let payload =  JSON.parse(localStorage.getItem("THSPaylaod"))
                    let address = JSON.parse(localStorage.getItem("THSAppointmentAddress"))
                    let discount = JSON.parse(localStorage.getItem("THSDiscount"))
                    let multiAppointment = JSON.parse(localStorage.getItem("THSMultiAppointment"))
                    
                    multiAppointment = multiAppointment.filter(app => {
    
                      return app !==null
                    })
    
                    this.cartData = payload.cartData
                    this.date = payload.preferredDate
                    this.time = payload.preferredTime
                    this.name = `${appointmentRequest.userData[0].first_name} ${appointmentRequest.userData[0].last_name} `
    
                    let request = {
    
                      userData: appointmentRequest.userData,
                      branch_id: address.branch_id,
                      scheduled_date: payload.preferredDate,
                      scheduled_time: payload.preferredTime,
                      cartData: payload.cartData,
                      payment_method: 'tap payments',
                      payment_id: id,
                      payment_status: 'CAPTURED',
                      payment_url: appointmentRequest.paymentURL,
                      longitude: address.user_address.longitude,
                      latitude: address.user_address.latitude,
                      location: `${address.user_address.address_line1} ${address.user_address.address_line2}`,
                      patient_note: payload.patient_note,
                      patient_source_id: 4,
                      additional_items: null,
                      discount_type: discount.discountType,
                      discount_amount: discount.discountAmount,
                      vat_applied: discount.vatApplied,
                      active_offer_id: null,
                      invoice_total: 200,
                      operator_note: null,
                      insurance_id: null,
                      is_insured: false,
                      insurance_provider_id: null,
                      category_id: payload.cartData[0].category_id,
                      multiAppointment: multiAppointment,
                      sourceRef: 'Website'
                    
                    }
    
                    this._b2c.businessToCustomerAppointment(request).subscribe({
          
                      next : ( res : any ) => {
                
                        //in case of success the api returns 0 as a status code
                        if( res.status === APIResponse.Success ) {
                
                          //if payment is captured then we wil generate an appointment by passing data
                        
                          this.appointmentId = res.data
                          this.paymentCaptured = true
                          this.verified = true

                          localStorage.removeItem("THSAppointmentRequest")
                          localStorage.removeItem("THSPaylaod")
                          localStorage.removeItem("THSAppointmentAddress")
                          localStorage.removeItem("THSCart")
                          localStorage.removeItem("THSDiscount")
                          localStorage.removeItem("THSMultiAppointment")
                          
                        } else {
                
                          this.paymentCaptured = false
                          this.verified = true
                          
                        }
                        
                      },
                      error: ( errr: any ) => {
                        
                        console.log(errr)
                
                      }
                  
                    }) 

                    
                  }
              
                }) 

              }
    
            } else {
    
              this.router.navigate(['/'])
           
            }
            
          },
          error: ( err: any ) => {
            
            console.log(err)
    
          }
      
      }) 
    
      }
    
    })

  }

  ngOnInit(): void {}

  naviagteToHome() {

    this.router.navigate(['/'])

  }
  
}
