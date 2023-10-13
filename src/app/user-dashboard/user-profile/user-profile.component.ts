import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PatientsService } from 'src/service/patient.service';
import { APIResponse } from 'src/utils/app-enum';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  //html elemets 
  @ViewChild('search') searchElementRef: ElementRef
  @ViewChild('personalInfo') personalInfoHTML?: ElementRef<HTMLDivElement>
  @ViewChild('appointmentInfo') appointmentInfoHTML?: ElementRef<HTMLDivElement>
  displayUserInfo: boolean = true;
  displayAppointmentInfo: boolean = false
  geoCoder: any;
  userId: any
  userData: any
  userDependants: any
  dependantData: any
  userLocations: any
  userAppointments: any

  //location
  searchLocation: string = '';
  zoom: number = 15
  centerLat: number = 24.7136
  centerLng: number = 46.6753
  selectedLat: number
  selectedLng: number
  place: any

  //toggles
  addDependantToggle: boolean = false
  showUserAlreadyExist: boolean = false
  showErrorCreatingDependant: boolean = false
  showErrorUpdatingDependant: boolean = false
  showSuccessUpdatingDependant: boolean = false
  showDependantDetails: boolean = false
  showUserDetails: boolean = false
  showDeleteDependant: boolean = false
  showErrorDeletingDependant: boolean = false
  showLocationMap: boolean = false
  placeSelected: boolean = false
  showErrorUpdatingAddress: boolean = false

  // forms
  public addDependantForm : FormGroup
  public updateDependantForm : FormGroup
  public addressForm : FormGroup

  constructor(
    private renderer: Renderer2,
    private fb : FormBuilder,
    private _patientService: PatientsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router ) { 

      this.addDependantForm = this.fb.group({
  
        email: [' '],
        phone_number: [' '],
        first_name: ['', [ Validators.required ]],
        last_name: [''],
        dob: [''],
        gender: ['', [Validators.required]],
        nationality: ['', [Validators.required]],
        id_type: ['', [Validators.required]],
        id_number: ['', [Validators.required]],
        marital_status: [''],
//        relationship_type: ['', [Validators.required]]

      })

      this.updateDependantForm = this.fb.group({
  
        first_name: ['', [ Validators.required ]],
        last_name: [''],
        dob: [''],
        gender: ['', [Validators.required]],
        nationality: ['', [Validators.required]],
        id_type: ['', [Validators.required]],
        id_number: ['', [Validators.required]],
        marital_status: [''],
        //relationship_type: ['', [Validators.required]]

      })

      this.addressForm = this.fb.group({

        address_name: ['', Validators.required],
        city: [''],
        country: [''],
        latitude: ['', [ Validators.required ]],
        longitude: ['', [ Validators.required ]],
        address_line1: ['', [ Validators.required ]],
        address_line2: ['']

      })

  }

  ngOnInit(): void {

    this.userId = localStorage.getItem("THSUserId")

    if(this.userId !== null) {

      let data = {

        user_id: this.userId
  
      }

      //first we will get user profile information
      this._patientService.getProfileInformation(data).subscribe({
    
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
            
            this.userData = res.data

            if(res.data['saved_location']) {

              this.userLocations = JSON.parse(res.data['saved_location'])

            } else {

              this.userLocations  = []

            }
            
            
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

      //first we will get user profile information
      this._patientService.getDependantsList(data).subscribe({

      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {
          
          this.userDependants= res.data
              
        } 
        
      },
      error: ( err: any ) => {}
  
      })

      this._patientService.getAppointmentList(data).subscribe({
    
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
            
            this.userAppointments =  res.data
            
          }
          
        },
        error: ( err: any ) => {

          console.log(err)

        }
    
      })

      // Use the Google Maps Geocoding API to convert the searchLocation to coordinates
      this.mapsAPILoader.load().then(() => {})
    
    } else {

      this._patientService.logout()

    }

  }

  //the following function will display users or appointments block
  displayBlock(blockTitle) {

    if( blockTitle === 'userInfo') {

      //enable display on div blocks
      this.displayUserInfo = true
      this.displayAppointmentInfo = false

      this.renderer.addClass(this.personalInfoHTML.nativeElement, 'item-selected')
      this.renderer.removeClass(this.appointmentInfoHTML.nativeElement, 'item-selected')

    }

    if( blockTitle === 'appointmentInfo') {

      //enable display on div blocks
      this.displayUserInfo = false
      this.displayAppointmentInfo = true

      this.renderer.removeClass(this.personalInfoHTML.nativeElement, 'item-selected')
      this.renderer.addClass(this.appointmentInfoHTML.nativeElement, 'item-selected')

    }
  
  }

  //we will display add dependant block
  addDependant() {

    this.addDependantToggle = true

  }

  //reset form and hide block of add dependant
  discardAddDependant() {

    this.addDependantForm.reset()
    this.addDependantToggle = false

  }

  //in this function we will create dependant
  createDependant() {

    this.addDependantForm.get('email').patchValue('')

    if (this.addDependantForm.invalid) {
      // Display error messages

      if (this.addDependantForm.get('first_name').invalid) {
      
        this.addDependantForm.get('first_name').setErrors({ invalidFName: true })

      }
      
      if (this.addDependantForm.get('gender').invalid) {
      
        this.addDependantForm.get('gender').setErrors({ invalidGender: true })
      
      }
  
      if (this.addDependantForm.get('nationality').invalid) {
      
        this.addDependantForm.get('nationality').setErrors({ invalidNationality: true })

      }
  
      if (this.addDependantForm.get('id_type').invalid) {

          this.addDependantForm.get('id_type').setErrors({ invalidIdType: true })

      }

      if (this.addDependantForm.get('id_number').invalid) {

        this.addDependantForm.get('id_number').setErrors({ invalidIdNumber: true })

      }

    } else {

        let idType = this.addDependantForm.get('id_number').value
        let ifSaudiId = this.validateNationalId(idType)
    
        if(this.addDependantForm.get('id_type').value === 'national_id' && ifSaudiId === -1) {

            this.addDependantForm.get('id_number').setErrors({ invalidIdNumber: true })

        } else if(this.addDependantForm.get('id_type').value !== 'national_id' && ifSaudiId === 1) {

            this.addDependantForm.get('id_type').setErrors({ invalidIdType: true })
            this.addDependantForm.get('id_number').setErrors({ invalidIdNumber: true })
        } 

        else {
         //if user verifcation is valid then we will create a dependant
         let data = {

          primary_user_id: this.userId,
          email: this.addDependantForm.get('email').value,
          phone_number: this.addDependantForm.get('phone_number').value,
          first_name: this.addDependantForm.get('first_name').value,
          last_name: this.addDependantForm.get('last_name').value,
          dob: this.addDependantForm.get('dob').value,
          gender: this.addDependantForm.get('gender').value,
          nationality: this.addDependantForm.get('nationality').value,
          id_type: this.addDependantForm.get('id_type').value,
          id_number: this.addDependantForm.get('id_number').value,
          marital_status: this.addDependantForm.get('marital_status').value,
         // relationship_type: this.addDependantForm.get('relationship_type').value

        }

        this._patientService.createDependent(data).subscribe({

          next : ( res : any ) => {

            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              this.userDependants.push(res.data)
              this.addDependantToggle = false
              this.addDependantForm.reset()

            } else {

              //if it is unable to add category data it will return an error
              this.showErrorCreatingDependant = true

            }
            
          },

          error: ( err: any ) => {
            
            this.showErrorCreatingDependant = true

          }

        })

      }

      /*
       //now we will send 6 digits random code to user's valid phone number
       this._patientService.verifyPatient(data).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            //if user verifcation is valid then we will create a dependant
            let data = {

              primary_user_id: this.userId,
              email: this.addDependantForm.get('email').value,
              phone_number: this.addDependantForm.get('phone_number').value,
              first_name: this.addDependantForm.get('first_name').value,
              last_name: this.addDependantForm.get('last_name').value,
              dob: this.addDependantForm.get('dob').value,
              gender: this.addDependantForm.get('gender').value,
              nationality: this.addDependantForm.get('nationality').value,
              id_type: this.addDependantForm.get('id_type').value,
              id_number: this.addDependantForm.get('id_number').value,
              marital_status: this.addDependantForm.get('marital_status').value,
             // relationship_type: this.addDependantForm.get('relationship_type').value

            }

            this._patientService.createDependent(data).subscribe({

              next : ( res : any ) => {

                //in case of success the api returns 0 as a status code
                if( res.status === APIResponse.Success ) {

                  this.userDependants.push(res.data)
                  this.addDependantToggle = false
                  this.addDependantForm.reset()

                } else {

                  //if it is unable to add category data it will return an error
                  this.showErrorCreatingDependant = true

                }
                
              },

              error: ( err: any ) => {
                
                this.showErrorCreatingDependant = true

              }

            })
             

          } else {
  
            this.showUserAlreadyExist = true

          }
          
        },
        error: ( err: any ) => {
  
          this.showUserAlreadyExist = true
  
        }
    
      })
      */

    }

  }

  handleCancelClick(): void {}

  //alert continue button handler
  handleContinueClick(): void {

    this.showUserAlreadyExist = false
    this.showErrorCreatingDependant = false
    this.showErrorUpdatingDependant = false
    this.showErrorDeletingDependant = false
    this.showErrorUpdatingAddress = false
    this.showSuccessUpdatingDependant = false

  }

  //this will show dependent details popup
  showDependant(index) {

    this.dependantData = this.userDependants[index]
    
    //dob conversion
    const dateTimeString = this.dependantData.dob
    const dateObject = new Date(dateTimeString)

    const year = dateObject.getUTCFullYear()
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0')
    const day = String(dateObject.getUTCDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    // Assign the formatted string to the dob property (not as a new Date)
    this.dependantData.dob = formattedDate;
    this.updateDependantForm.patchValue(this.dependantData)
    this.showDependantDetails = true

  }

  showUser() {
    
    this.dependantData = this.userData
    
    //dob conversion
    const dateTimeString = this.dependantData.dob
    const dateObject = new Date(dateTimeString)

    const year = dateObject.getUTCFullYear()
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0')
    const day = String(dateObject.getUTCDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    // Assign the formatted string to the dob property (not as a new Date)
    this.dependantData.dob = formattedDate;
    this.updateDependantForm.patchValue(this.dependantData)
    this.showUserDetails = true

  }

  //this will show dependent details popup and reset form data
  discardUpdateDependant() {

    this.showDependantDetails = false
    this.showUserDetails = false
    this.dependantData = {}
    this.updateDependantForm.reset()

  }

  //this will update dependant data
  updateDependant() {

    this.updateDependantForm.patchValue(this.dependantData)
    if (this.updateDependantForm.invalid) {

      // Display error messages
      if (this.updateDependantForm.get('first_name').invalid) {
      
        this.updateDependantForm.get('first_name').setErrors({ invalidFName: true })

      }
      
      if (this.updateDependantForm.get('gender').invalid) {
      
        this.updateDependantForm.get('gender').setErrors({ invalidGender: true })
      
      }
  
      if (this.updateDependantForm.get('nationality').invalid) {
      
        this.updateDependantForm.get('nationality').setErrors({ invalidNationality: true })

      }
  
      if (this.updateDependantForm.get('id_type').invalid) {

          this.updateDependantForm.get('id_type').setErrors({ invalidIdType: true })

      }

      if (this.updateDependantForm.get('id_number').invalid) {

        this.updateDependantForm.get('id_number').setErrors({ invalidIdNumber: true })

      }

      /*if (this.updateDependantForm.get('relationship_type').invalid) {

        this.updateDependantForm.get('relationship_type').setErrors({ invalidRelationshipType: true })

      }*/

    } else {

        //first we will check id validator
        let idType = this.updateDependantForm.get('id_number').value
        let ifSaudiId = this.validateNationalId(idType)

        if(this.updateDependantForm.get('id_type').value === 'national_id' && ifSaudiId === -1) {
        
            this.updateDependantForm.get('id_number').setErrors({ invalidIdNumber: true })

        } else if(this.updateDependantForm.get('id_type').value !== 'national_id' && ifSaudiId === 1) {
   
            this.updateDependantForm.get('id_type').setErrors({ invalidIdType: true })
            this.updateDependantForm.get('id_number').setErrors({ invalidIdNumber: true })

   
        } else {
          let data = {

            user_id: this.dependantData.id,
            first_name: this.updateDependantForm.get('first_name').value,
            last_name: this.updateDependantForm.get('last_name').value,
            dob: this.updateDependantForm.get('dob').value,
            gender: this.updateDependantForm.get('gender').value,
            nationality: this.updateDependantForm.get('nationality').value,
            id_type: this.updateDependantForm.get('id_type').value,
            id_number: this.updateDependantForm.get('id_number').value,
            marital_status: this.updateDependantForm.get('marital_status').value,
            //relationship_type: this.updateDependantForm.get('relationship_type').value
  
          }
  
          this._patientService.updateDependent(data).subscribe({
  
            next : ( res : any ) => {
  
              //in case of success the api returns 0 as a status code
              if( res.status === APIResponse.Success ) {
  
                this.showDependantDetails = false
                this.showUserDetails = false
  
                this.dependantData = {}
                this.updateDependantForm.reset()
  
              //  this.showSuccessUpdatingDependant = true
  
              } else {
  
                //if it is unable to add category data it will return an error
                this.showErrorUpdatingDependant = true
  
              }
              
            },
  
            error: ( err: any ) => {
              
              this.showErrorUpdatingDependant = true
  
            }
  
          })
  
        }

    }

  }

  confirmDeleteDependant() {

    this.showDependantDetails = false
    this.showUserDetails = false

    this.showDeleteDependant = true

  }

  cancelDeleteDependant() {

    this.showDeleteDependant = false

  }

  deleteDependant() {

    //here we will delete dependant and its details
    this.showDeleteDependant = false
    this.showDependantDetails = false
    this.showUserDetails = false


    let data = {

      user_id: this.dependantData.id

    }

    this._patientService.deleteDependent(data).subscribe({

      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {

          this.userDependants = this.userDependants.filter(user => {

            return user.id !== this.dependantData.id

          })

          this.dependantData = {}

        } else {

          //if it is unable to add category data it will return an error
          this.showErrorDeletingDependant = true

        }
        
      },

      error: ( err: any ) => {
        
        this.showErrorDeletingDependant = true

      }

    })

  }

  //this will open location block
  addLocation() {

    this.getUserLocation()
    this.showLocationMap = true

    setTimeout( ()=> {

      this.initializeAutocompleteAndConfirm()

    }, 200)

  }

  getUserLocation() {

    if (navigator.geolocation) {
    
      navigator.geolocation.getCurrentPosition( ( position ) => {
    
        // Set the center of the map to the user's current location
        this.centerLat = position.coords.latitude
        this.centerLng = position.coords.longitude

        // Set the marker's initial position to the user's current location
        this.selectedLat = position.coords.latitude
        this.selectedLng = position.coords.longitude

        // Get the location name using the Google Maps Places API
        const geocoder = new google.maps.Geocoder()
        const latlng = { lat: this.centerLat, lng: this.centerLng }
    
        geocoder.geocode({ location: latlng }, (results, status) => {

          if (status === google.maps.GeocoderStatus.OK) {
          
            if (results[0]) {
          
      
              const addressComponents = results[0].address_components

              for (const component of addressComponents) {

                if (component.types.includes("locality")) {

                  const cityName = component.long_name

                  this.addressForm.get('city').setValue( cityName )

                  return cityName // You can use the cityName as needed

                }

                 // Check for the country component
                if (component.types.includes("country")) {
                  
                  this.addressForm.get('country').setValue( component.long_name )
                
                }

              }

              // You can use the locationName as needed
            } else {
          
              console.error("No results found.")
          
            }
          
          } else {
          
            console.error("Geocoder failed due to: " + status)
          
          }

        })

      })
    
    } else {
    
      console.error("Geolocation is not supported by this browser.");
    
    }
  
  }

  // Method to initialize Autocomplete and map when the button is clicked
  initializeAutocompleteAndConfirm() {
  
    // Use this.searchAddress.nativeElement instead of #search
    const input = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement)

    input.addListener('place_changed', () => {

      this.ngZone.run(() => {

        this.place = input.getPlace()
        this.placeSelected = true; // Set the flag to indicate a place has been selected
      
      })

    })

  }

  onConfirmLocation() {

    if (this.place.geometry && this.place.geometry.location) {
      
      this.selectedLat = this.place.geometry.location.lat()
      this.selectedLng = this.place.geometry.location.lng()
  
    }

    this.centerLat = this.selectedLat
    this.centerLng = this.selectedLng

    this.placeSelected = false

     // Get the location name using the Google Maps Places API
     const geocoder = new google.maps.Geocoder()
     const latlng = { lat: this.centerLat, lng: this.centerLng }
 
     geocoder.geocode({ location: latlng }, (results, status) => {

       if (status === google.maps.GeocoderStatus.OK) {
       
         if (results[0]) {
       
   
           const addressComponents = results[0].address_components

           for (const component of addressComponents) {

             if (component.types.includes("locality")) {

               const cityName = component.long_name

               this.addressForm.get('city').setValue( cityName )

               return cityName // You can use the cityName as needed

             }

              // Check for the country component
             if (component.types.includes("country")) {
               
               this.addressForm.get('country').setValue( component.long_name )
             
             }

           }

           // You can use the locationName as needed
         } else {
       
           console.error("No results found.")
       
         }
       
       } else {
       
         console.error("Geocoder failed due to: " + status)
       
       }

     })

  }

  onMapClick(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

  }

  onMarkerDragEnd(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    // Update the center of the map to the dragged marker's position
    this.centerLat = this.selectedLat;
    this.centerLng = this.selectedLng;

  }

  discardAddress() {

    this.addressForm.reset()
    this.showLocationMap = false
    this.getUserLocation()

  }

  //here we will store user added address in the database
  createAddress() {

   
    this.addressForm.get('latitude').setValue( this.selectedLat )
    this.addressForm.get('longitude').setValue( this.selectedLng )


    //get city & country from address longitude & latitude

    if (this.addressForm.invalid) {

      // Display error messages
      if (this.addressForm.get('address_name').invalid) {
      
        this.addressForm.get('address_name').setErrors({ invalidAddressName: true })

      }

      if (this.addressForm.get('address_line1').invalid) {
      
        this.addressForm.get('address_line1').setErrors({ invalidAddressLine1: true })

      }

      if (this.addressForm.get('latitude').invalid) {
      
        this.addressForm.get('latitude').setErrors({ invalidLocation: true })

      }

      if (this.addressForm.get('longitude').invalid) {
      
        this.addressForm.get('longitude').setErrors({ invalidLocation: true })

      }

    } else {

        //we will perform some actions to store user location
        let data = {

          user_id: this.userId,
          address: {

            address_name: this.addressForm.get('address_name').value,
            city: this.addressForm.get('city').value,
            country: this.addressForm.get('country').value,
            latitude: this.addressForm.get('latitude').value,
            longitude: this.addressForm.get('longitude').value,
            address_line1: this.addressForm.get('address_line1').value,
            address_line2: this.addressForm.get('address_line2').value
  
          }

        }

        this._patientService.createAddress(data).subscribe({

          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              this.showLocationMap = false
              this.userLocations.push(data.address)
              this.addressForm.reset()

            } else {
    
              //if it is unable to add category data it will return an error
              this.showErrorUpdatingAddress = true
              
            }
            
          },
    
          error: ( err: any ) => {
            
            this.showErrorUpdatingAddress = true

          }
    
        })

    }

  }

  //this will splice location 
  removeAddress(index) {

    let address = this.userLocations
    address.splice(index,1)
    
    let data = {

      user_id: this.userId,
      saved_location: JSON.stringify(address)

    }

    this._patientService.updateAddress(data).subscribe({

      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {
          
          this.userLocations = address
    
        } else {

          //if it is unable to add category data it will return an error
          this.showErrorUpdatingAddress = true
          
        }
        
      },

      error: ( err: any ) => {
        
        this.showErrorUpdatingAddress = true

      }

    })

  }

  logout() {

    this._patientService.logout()

  }

  navigate(link) {

    this.router.navigate([link])
  
  }

  navigateToLogin() {

    if(this.userId !== null) {

      this.router.navigate(['/user/profile'])

    } else {

      this.router.navigate(['/login'])

    }

  }

  goToServices() {

    this.router.navigate(['/'])

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

}
