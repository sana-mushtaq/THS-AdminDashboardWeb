import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { PatientsService } from 'src/service/patient.service';
import { WebsiteDataService } from 'src/service/website-data.service';
import { APIResponse } from 'src/utils/app-enum';
import { UtilService } from 'src/utils/util.service';
import { GoSellService } from 'src/service/go-sell.service';
declare const goSell: any; // Declare goSell to avoid TypeScript errors

@Component({
  selector: 'app-checkout-appointment',
  templateUrl: './checkout-appointment.component.html',
  styleUrls: ['./checkout-appointment.component.css']
})
export class CheckoutAppointmentComponent implements OnInit {

  errorOccured: boolean = false

  cartData: any = []
  userId: any
  total: number = 0
  total_inc_cost: number = 0
  userDependants: any = []
  userData: any
  discountType: number = -1
  promoApplied: boolean = false
  invalidPromoMessage: boolean = false
  discountAmount: string = ''

  vatApplied = -1
  constructor(
    private _utilService: UtilService,
    private router: Router,
    private _patientService: PatientsService,
    private _b2c: BusinessToCustomerSchedulingService,
    private dataService: WebsiteDataService,
    private goSellService: GoSellService
  ) { }

  ngOnInit(): void {

    this.getComponentData()

  }

  getComponentData() {
    
    this.cartData = this._utilService.getCartData()

    if(!this.cartData || this.cartData.length === 0) {

      this.router.navigate(['/medical-services'])

    }

    this.cartData.forEach(cartItem => {

      cartItem['user_id'] = null

    })

    //in this component we will check if sevices are provided by same gender or not
    //first of all we will check if user is logged in or not, if he is logged in then we will identofy
    this.userId = localStorage.getItem("THSUserId")

    if(this.userId !== null) {
      //check dependants and whether services match with service provider or not
       //first we will get user profile information
        let data = {

          user_id: this.userId
    
        }

        this._patientService.getProfileInformation(data).subscribe({
    
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {
              
              this.userData = res.data
              
              this.userDependants[0] = res.data
              
              this.cartData.forEach(cartItem => {

                cartItem['user_id'] = this.userDependants[0].id

              })

              this.getTotal()

              
            } else {
    
              //if system is unable to get user infomration then we will remove items from local storage and naviaget user back to login screen
              this._patientService.logout()
  
            }
            
          },
          error: ( err: any ) => {
  
            //if system is unable to get user infomration then we will remove items from local storage and naviaget user back to login screen
            this._patientService.logout()
          
          }
      
        })

        this._patientService.getDependantsList(data).subscribe({

        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
              
            res.data.forEach(dependant => {

              this.userDependants.push(dependant)

            })
                
          } 
          
        },
        error: ( err: any ) => {}
    
        })

        //after getting dependants, we have to check if a particular service is provided by servoce provider and his gender matches with 
        this.dataService.data$.subscribe((res) => {

          if (res) {

            // ... handle the received data here
            let services = res.services
            let filteredServices = []

            this.cartData.forEach(cartItem => {

              let temp = services.filter(service => {

                return service.id === cartItem.id

              })

              if( temp.length > 0 ) {

                filteredServices.push(temp[0])
                
              }

            })
          }
    
        })

    }

  }

  getTotal() {

    //calculate total

    if(this.cartData.length>0) {

      this.total = this.cartData.map(cart => {

        return cart.price
  
      }).reduce((a, b)=>{
  
        return a+b
  
      })

      if(!this.userData.id_number.startsWith("1")) {

        const taxRate = 0.15;
        const taxAmount = this.total * taxRate;
  
        this.total_inc_cost =  Math.round(this.total + taxAmount);

        this.vatApplied = 1
  
      } else {

        this.total_inc_cost =  Math.round(this.total);

        this.vatApplied = 0

      }

      let dicountStorage = {

        discountType: null,
        discountAmount: null,
        vatApplied: this.vatApplied

      }
      //pk_test_IHFiBNWxlPU29hm0bA7s5c1e
      localStorage.setItem("THSDiscount", JSON.stringify(dicountStorage));

      goSell.config({
        containerID: "root",
        gateway: {
          publicKey: "pk_live_wb840JAXOaMqcFUtzQePS53Z",
          merchantId: null,
          language: "en",
          contactInfo: true,
          supportedCurrencies: "SAR",
          supportedPaymentMethods: "all",
          saveCardOption: false,
          customerCards: true,
          notifications: "standard",
          callback: (response) => {
            console.log("response", response);
          },
          onClose: () => {
            console.log("onClose Event");
          },
          backgroundImg: {
            url: "imgURL",
            opacity: "0.5",
          },
          labels: {
            cardNumber: "Card Number",
            expirationDate: "MM/YY",
            cvv: "CVV",
            cardHolder: "Name on Card",
            actionButton: "Pay",
          },
          style: {
            base: {
              color: "#535353",
              lineHeight: "18px",
              fontFamily: "sans-serif",
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "rgba(0, 0, 0, 0.26)",
                fontSize: "15px",
              },
            },
            invalid: {
              color: "red",
              iconColor: "#fa755a ",
            },
          },
        },
        customer: {
          id: null,
          first_name: this.userData.first_name,
          middle_name: "",
          last_name: this.userData.last_name,
          email: this.userData.email,
          phone: {
            country_code: "966",
            number: this.userData.phone_number,
          },
        },
        order: {
          amount: this.total_inc_cost.toString(),
          currency: "SAR",
          /*items: [
            {
              id: 1,
              name: "item1",
              description: "item1 desc",
              quantity: "1",
              amount_per_unit: "00.000",
              discount: {
                type: "P",
                value: "10%",
              },
              total_amount: "000.000",
            },
            {
              id: 2,
              name: "item2",
              description: "item2 desc",
              quantity: "2",
              amount_per_unit: "00.000",
              discount: {
                type: "P",
                value: "10%",
              },
              total_amount: "000.000",
            },
            {
              id: 3,
              name: "item3",
              description: "item3 desc",
              quantity: "1",
              amount_per_unit: "00.000",
              discount: {
                type: "P",
                value: "10%",
              },
              total_amount: "000.000",
            },
          ],*/
          shipping: null,
          taxes: null,
        },
        transaction: {
          mode: "charge",
          charge: {
            saveCard: false,
            threeDSecure: true,
            description: "",
            statement_descriptor: "",
            hashstring:"",
            metadata: {},
            receipt: {
              email: false,
              sms: true,
            },
            redirect:"http://taib.sa"+"/checkout/payment-confirmation/?order-currency=SAR&order-total="+this.total_inc_cost+"&lang=en",
            post: null,
          },
        },
      });

    } else {

      this.total = 0
      this.router.navigate(['/medical-services'])
      

    }

  }

  removeFromCart(index) {

    this._utilService.removeFromCart(index)
    this.cartData.splice(index,1)
    this.getTotal()

  }

  //this function will crete an appointment
  payAndBook() {

    let services = this.cartData

    let data = {

      services: services,
      userData: this.userData,
      total_inc_cost: this.total_inc_cost

    }

    this._b2c.generatePaymentLink(data).subscribe({
      
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {

          //after fetching all service providers we will now check if their gender match with selected user or not 
        
          let data = {

            userData: this.userDependants,
            paymentURL: res.data.paymentLink,
          
          }

          localStorage.setItem("THSAppointmentRequest", JSON.stringify(data))

          window.open(res.data.paymentLink,"_self");

        } else {

          this.errorOccured = true
      
        }
        
      },
      error: ( err: any ) => {
        
        console.log(err)

      }
  
    }) 
/*
    let preferredDateTime = sessionStorage.getItem("THSPaylaod")
    
    let data = {

      preferredDateTime: preferredDateTime,
      cartData: this.cartData,
      users: this.userDependants
      
    }

    this._b2c.businessToCustomerAppointment(data).subscribe({
        
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {

          //after fetching all service providers we will now check if their gender match with selected user or not 
          

        } else {

       
        }
        
      },
      error: ( err: any ) => {
        
        console.log(err)

      }
  
    }) 
  */

  }

  verifyDiscount() {

    let promoValue = (document.getElementById("coupon_code") as any).value

    let params = {
      "promoCode": promoValue
    }

    this._b2c.verifyDiscount(params).subscribe(
    (response: any) => {

      if(response.status == APIResponse.Success) {

        let promos = response.promoList
        let filteredPromo = response.promoList.filter(promo => {

          return promo.promoCode === promoValue

        })
         
        if(filteredPromo.length>0) {

          if(!this.promoApplied) {

            this.invalidPromoMessage = false

            //we will check if promo code is active or not
            if(filteredPromo[0].isActive === 0) {

              //apply the discount here
              let appliedDiscount = this.total
  
              let promoAmount = parseInt(filteredPromo[0].promoValue);

              let dicountStorage = {

                discountType: filteredPromo[0].promoType,
                discountAmount: filteredPromo[0].promoValue,
                vatApplied: this.vatApplied

              }
              
              localStorage.setItem("THSDiscount", JSON.stringify(dicountStorage))
  
              //this will deduct SAR in type is 1
              if(filteredPromo[0].promoType === 1) {
  
                this.discountType = 1
                appliedDiscount = appliedDiscount - promoAmount
                this.total = appliedDiscount

                let idType =this.userData.id_number
                let ifSaudiId = this.validateNationalId(idType)
        
                if(ifSaudiId === -1  || ifSaudiId === 2) {

                  const taxRate = 0.15;
                  const taxAmount = this.total * taxRate;
            
                  this.total_inc_cost =  Math.round(this.total + taxAmount);

                  this.discountAmount = `SAR ${promoAmount}`

                } else {
          
                  this.total_inc_cost =  Math.round(this.total);
          
                  this.discountAmount = `SAR ${promoAmount}`
                }
  
              }
              //if type is 2 then percentage will get deduct
              if(filteredPromo[0].promoType === 2) {
                
                this.discountType = 2
                appliedDiscount = appliedDiscount - ((appliedDiscount ) * (promoAmount / 100))
                this.total = appliedDiscount

                if(!this.userData.id_number.startsWith("1")) {

                  const taxRate = 0.15;
                  const taxAmount = this.total * taxRate;
            
                  this.total_inc_cost =  Math.round(this.total + taxAmount);

                  this.discountAmount = `${promoAmount}%`
            
                } else {
          
                  this.total_inc_cost =  Math.round(this.total);

                  this.discountAmount = `${promoAmount}%`
          
                }

              }
  
              //this.discountCost = appliedDiscount;
              //this.discountPercent = promoAmount;
              this.promoApplied = true
  
            } else {
              
              this.invalidPromoMessage = true
          
            }
              
          }

        } else {

          this.invalidPromoMessage = true

        }

      } else {


      }
      
      },
      (err) => {
   
      }
    );


  }

  handleCancelClick() { }
  
  handleContinueClick(): void {

    this.errorOccured = false
    window.location.reload()

  }

  validateNationalId(id) {

    const type = id.substr(0, 1)
    const _idLength = 10
    const _type1 = '1'
    const _type2 = '2'
    let sum = 0

    id = id.trim()
    
    if (isNaN(parseInt(id)) || (id.length !== _idLength) || (type !== _type2 && type !== _type1)) {
    
      return -1
    
    }
    for (let num = 0; num < 10; num++) {
    
      const digit = Number(id[num])
    
      if (num % 2 === 0) {
    
        const doubled = digit * 2
        const ZFOdd = `00${doubled}`.slice(-2)
        sum += Number(ZFOdd[0]) + Number(ZFOdd[1])
    
      } else {
    
        sum += digit
    
      }
    
    }
    
    return (sum % 10 !== 0) ? -1 : Number(type)

  }

  openLightBox(): void {

    
    let data = {

      userData: this.userDependants,
      paymentURL: "",
    
    }

    localStorage.setItem("THSAppointmentRequest", JSON.stringify(data))

    
    this.goSellService.openLightBox();
  }

}
