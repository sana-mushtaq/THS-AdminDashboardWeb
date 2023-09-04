import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { PatientsService } from 'src/service/patient.service';
import { WebsiteDataService } from 'src/service/website-data.service';
import { APIResponse } from 'src/utils/app-enum';
import { UtilService } from 'src/utils/util.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  
})

export class CartComponent implements OnInit {

  wrongService: boolean = false
  loginAlert: boolean = false

  cartData: any = []
  userId: any
  total: number = 0
  userDependants: any = []
  userData: any
  serviceProvidersServices: any
  servicesSelected: any = {}

  //service time slots 
  timeSlots: string[] = []
  
  constructor(
    private _utilService: UtilService,
    private router: Router,
    private _patientService: PatientsService,
    private _b2c: BusinessToCustomerSchedulingService,
    private dataService: WebsiteDataService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    this.getComponentData()
  
  }

  getComponentData() {
    
    this.cartData = this._utilService.getCartData()

    if(!this.cartData || this.cartData.length === 0) {

      this.router.navigate(['/medical-services'])

    }

    //in this component we will check if sevices are provided by same gender or not
    //first of all we will check if user is logged in or not, if he is logged in then we will identofy
    this.userId = localStorage.getItem("THSUserId")

    if(this.userId !== null) {

      //check dependants and whether services match with service provider or not
      //first we will get user profile information
      let data = {

        user_id: this.userId
    
      }

      this.cartData.forEach(cartItem => {

        cartItem['user'] = this.userData
  
      })

      this._utilService.addToCart(this.cartData)

      this._patientService.getProfileInformation(data).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
            
            this.userData = res.data
            this.userDependants[0] = res.data
            
            this.cartData.forEach(cartItem => {

              cartItem['user'] = this.userDependants[0]

            })

            this._utilService.addToCart(this.cartData)
            
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
            console.log(this.userDependants)
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

          let spData  = {

            services: filteredServices,
            patients: this.userDependants

          }
  
          this._b2c.checkServiceProviderEligibilty(spData).subscribe({
      
            next : ( ress : any ) => {
      
              //in case of success the api returns 0 as a status code
              if( ress.status === APIResponse.Success ) {

                //after fetching all service providers we will now check if their gender match with selected user or not 
                this.serviceProvidersServices = ress.data

              } else {
      
              
              }
              
            },
            error: ( err: any ) => {
              
              console.log(err)
      
            }
        
          }) 
  
        }
  
      })

    }

    this.getTotal()

  }

  getTotal() {

    //calculate total

    if(this.cartData.length>0) {

      this.total = this.cartData.map(cart => {

        return cart.price
  
      }).reduce((a, b)=>{
  
        return a+b
  
      })
  
    } else {

      this.total = 0
      this.router.navigate(['/medical-services'])

    }

  }

  checkout() {

    //first we will check if user id exists or not
    if(!this.userId) {

      this.loginAlert = true

    } else {

      //here we will navigate user to service provider and schedule settings
      this.verifyServiceProviderGender()

    }

  }

  removeFromCart(index) {

    this._utilService.removeFromCart(index)
    this.cartData.splice(index,1)
    this.getTotal()

  }

  //here we will verify service provider gender wr.t. patient
  verifyServiceProviderGender() {

    //lets start with one patient and one service only
    this.cartData.forEach(cartItem => {

      //here we will check and choose for each services and gender
      let patient = cartItem.user.id

      let patientGender = this.userDependants.filter(pid => {

        return pid.id === patient

      })

      if(patientGender.length>0){

        patientGender = patientGender[0].gender

        let serviceId = cartItem.id
        let service = this.serviceProvidersServices[serviceId]
        let spGender = service.map(g => g.gender)
        let spGenderSet = [...new Set(spGender)]

        if(spGenderSet.includes(patientGender)) {
  
          //if it includes patient gender then we will store all service providers w.r.t object
          this.servicesSelected[serviceId] = {
  
            patient_gender: patientGender,
            service_id: serviceId
  
          }
          
          this.router.navigate(['/checkout/schedule'])
  
        } else {
    
          this.wrongService = true

        }

      } else {

        this.wrongService = true
        
      }


    })
 
  }

  changeDependant(dependant, index) {

    //this will change user dependant
    let userData = this.userDependants.filter (uid => {

      return uid.id === parseInt(dependant.value)

    })

    this.cartData[index].user = userData[0]
    this._utilService.addToCart(this.cartData)

  }

  // Inside your component class
  toggleDescription(cartIndex: number) {

    this.cartData[cartIndex].showFullDescription = !this.cartData[cartIndex].showFullDescription

  }

  handleCancelClick(): void {

    this.wrongService = false
    this.loginAlert = false

  }

  //alert continue button handler
  handleContinueClick(): void {

    this.router.navigate(['/login'])

  }

  handleContinueClickService(): void {

    this.wrongService = false
    this.loginAlert = false

  }

}
