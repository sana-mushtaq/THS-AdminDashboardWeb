import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { APIResponse } from 'src/utils/app-enum';
import { WebsiteDataService } from 'src/service/website-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/utils/util.service';
import { environment } from 'src/environments/environment'
import { PatientsService } from 'src/service/patient.service';
import { Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LanguageService } from 'src/service/language.service';
import { DOCUMENT } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.css']
})
export class AllServicesComponent implements OnInit {

  // Define variables for controlling the number of items to display.
  itemsToShowInitially = 3;
  itemsToLoadMore = 3;
  displayedCategories: any[] = [];

  showErrorUpdatingAddress: boolean = false

  private initializationSubject = new Subject<void>()

  public serverUrl : string = environment.domainName
  
  data$ = this.dataService.data$;
  location$ = this.dataService.location$;

    //html elemets 
  @ViewChild('search') searchElementRef: ElementRef
  
  userCurrentLocation: boolean = false
  selectMapLocation: boolean = false
  zoom: number = 15
  centerLat: number = 0
  centerLng: number = 0
  selectedLat: number
  selectedLng: number
  locationName: string
  cityName: string
  place: any
  placeSelected: boolean = false
  addNewAddressToggle: boolean = false

  userAddress: any
  branch_id: any

  //services 
  allServices: any
  allCategories: any
  topCategories: any
  topServices: any = {}

  cartData: any = []
  cartLength: number = 0; // Store the cart length here

  userId: any
  userLocations: any = []
  changed: boolean = false

  showCheckoutButton: any;

  // forms
  public addressForm : FormGroup

  constructor(

    private route: ActivatedRoute, 
    private router: Router,
    private dataService: WebsiteDataService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private fb : FormBuilder,
    private _utilService: UtilService,
    private _patientService: PatientsService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    public languageService: LanguageService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    ) { 

      this.addressForm = this.fb.group({

        address_name: ['', Validators.required],
        city: [''],
        country: [''],
        latitude: ['', [ Validators.required ]],
        longitude: ['', [ Validators.required ]],
        address_line1: ['', [ Validators.required ]],
        address_line2: ['']

      })

      this.cartData = this._utilService.getCartData()

  }

  ngOnInit() {

    //first we will get user location and display on the header
    this.getUserLocation()
  
    // Use the Google Maps Geocoding API to convert the searchLocation to coordinates
    this.mapsAPILoader.load().then(() => {})

    this.dataService.cartLength$.subscribe(length => {
      this.cartLength = length;
    });


    this.userId = localStorage.getItem("THSUserId")

    if(this.userId !== null) {

      let data = {

        user_id: this.userId

      }
      //first we will get user profile information
      this._patientService.getUserLocations(data).subscribe({
      
        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            if(res.data['saved_location']) {

              this.userLocations = JSON.parse(res.data['saved_location'])

            } else {

              this.userLocations  = []

            }

           

          }
          
        },
        error: ( err: any ) => {

        }
    
      })

    }
  
  }
  
  ngAfterViewInit(): void {

    this.getComponentData()
  }
  
  getComponentData() {

    this.changed = false
    // This is where you should place your component-specific initialization code
    // that relies on the fetched data from dataService

    let data = {

      user_latitude: this.centerLat,
      user_longitude: this.centerLng
    
    }

    let sessionDate = {

      latitude: this.centerLat,
      longitude: this.centerLng

    }
    sessionStorage.setItem('userLocation', JSON.stringify(sessionDate))

    this.dataService.getData(data)

    this.dataService.data$.subscribe((res) => {

        if (res && res !== null && res.services && res.services.length>0) {

          this.allServices = []
          this.allCategories = []
          this.topCategories = []
          this.topServices= []
          this.displayedCategories = []

          // ... handle the received data here
          this.allCategories = res.categories
          this.allServices = res.services

          this.allServices = this.allServices.filter(service => {

            return service.primary_service_id === null
          
          })

          if(res.branchFound && res.branchFound === 'none') {

            localStorage.setItem("showCheckout", "true");

          } else {
           
            localStorage.removeItem("showCheckout");
          }
  
          this.branch_id = res.branch
          
          localStorage.setItem("THSBranch", this.branch_id)


          //top 4 categories
          this.topCategories = this.allCategories.filter(category => {
  
            return category['top'] === 1
  
          })
  
          this.allCategories.forEach(category => {

            let services = this.allServices.filter(service => {
            
              return service.top === 1 && service.category_id === category.id
            
            })
            
            let id = category.id.toString()
            this.topServices[id] = {
  
              category_data: category,
              services: services,
  
            }
  
  
          })
          this.topServices = Object.values(this.topServices)

          this.topServices.sort((a, b) => {
            const numServicesA = a.services.length;
            const numServicesB = b.services.length;
          
            if (numServicesA < numServicesB) {
              return 1; // B comes before A
            } else if (numServicesA > numServicesB) {
              return -1; // A comes before B
            } else {
              return 0; // No change in order
            }
          });

          this.displayedCategories = this.topServices.slice(0, this.itemsToShowInitially);
        } else {

          this.allServices = []
          
        }

    })
    
  }

  sessionStorageExixst() {

    let session = sessionStorage.getItem('userLocation')

    if(session === undefined || session === null || session === 'undefined') {

      return false

    } else {

      return true

    }

  }

  getUserLocation() {

    if(this.sessionStorageExixst()) {

      let session = JSON.parse(sessionStorage.getItem('userLocation'))

      // Set the center of the map to the user's current location
      this.centerLat = session.latitude
      this.centerLng = session.longitude

      // Set the marker's initial position to the user's current location
      this.selectedLat = session.latitude
      this.selectedLng = session.longitude

      this.getComponentData()
      

      let data = {

        user_address: this.userAddress,
        branch_id: this.branch_id

      }

      localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))

      // Get the location name using the Google Maps Places API
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat: this.centerLat, lng: this.centerLng }
  
      geocoder.geocode({ location: latlng }, (results, status) => {

        if (status === google.maps.GeocoderStatus.OK) {
        
          if (results[0]) {
        
            const locationName = results[0].formatted_address
            this.locationName = locationName
       
            this.userAddress = {
              
              latitude: this.selectedLat,
              longitude: this.selectedLng,
              address_line1: locationName,
              address_line2: ''

            }

            let data = {

              user_address: this.userAddress,
              branch_id: this.branch_id
            }

            localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))

            const addressComponents = results[0].address_components

            for (const component of addressComponents) {

              if (component.types.includes("locality")) {

                const cityName = component.long_name

                this.cityName = cityName

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

    } else {

      if (navigator.geolocation) {
  
        const options = {
          enableHighAccuracy: true, // Request higher accuracy
          timeout: 5000,            // Maximum time to wait for a result
          maximumAge: 0             // Don't use cached data
        }
    
        navigator.geolocation.getCurrentPosition((position) => {
          
          // Set the center of the map to the user's current location
          this.centerLat = position.coords.latitude
          this.centerLng = position.coords.longitude
    
          // Set the marker's initial position to the user's current location
          this.selectedLat = position.coords.latitude
          this.selectedLng = position.coords.longitude
    
          this.userAddress = {
            
            latitude: this.selectedLat,
            longitude: this.selectedLng,
            address_line1: '',
            address_line2: ''
    
          }
    
          sessionStorage.setItem('userLocation', JSON.stringify(this.userAddress))
    
          this.getComponentData()

          let data = {
    
            user_address: this.userAddress,
            branch_id: this.branch_id
          }
    
          localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))
    
          // Get the location name using the Google Maps Places API
          const geocoder = new google.maps.Geocoder()
          const latlng = { lat: this.centerLat, lng: this.centerLng }
      
          geocoder.geocode({ location: latlng }, (results, status) => {
    
            if (status === google.maps.GeocoderStatus.OK) {
            
              if (results[0]) {
            
                const locationName = results[0].formatted_address
                this.locationName = locationName
           
                this.userAddress = {
                  
                  latitude: this.selectedLat,
                  longitude: this.selectedLng,
                  address_line1: locationName,
                  address_line2: ''
    
                }
    
                let data = {
    
                  user_address: this.userAddress,
                  branch_id: this.branch_id
                }
    
                localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))
    
                const addressComponents = results[0].address_components
    
                for (const component of addressComponents) {
    
                  if (component.types.includes("locality")) {
    
                    const cityName = component.long_name
    
                    this.cityName = cityName
    
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
    
        }, (error) => {
    
          console.error("Error getting location:", error)
    
        }, options)
    
    
      } else {
      
          this.allServices = []
          console.error("Geolocation is not supported by this browser.")
      
        }
    
    }
  
  }

  //the following function will diplay user location popup
  showCurrentLocation() {

    this.userCurrentLocation = true

  }

  openMap() {

    this.selectMapLocation = true
    this.userCurrentLocation = false

    setTimeout( ()=> {

      this.initializeAutocompleteAndConfirm()

    }, 200)

  }

  onMapClick(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    this.placeSelected = true

    this.userAddress = {
              
      latitude: this.selectedLat,
      longitude: this.selectedLng,
      address_line1: this.locationName,
      address_line2: ''

    }
    sessionStorage.setItem('userLocation', JSON.stringify(this.userAddress))

    let data = {

      user_address: this.userAddress,
      branch_id: this.branch_id
    }

    localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))

  }

  onMarkerDragEnd(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    // Update the center of the map to the dragged marker's position
    this.centerLat = this.selectedLat
    this.centerLng = this.selectedLng

    this.placeSelected = true

    this.userAddress = {
              
      latitude: this.selectedLat,
      longitude: this.selectedLng,
      address_line1: this.locationName,
      address_line2: ''

    }

    let data = {

      user_address: this.userAddress,
      branch_id: this.branch_id
    }

    localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))

  }

  // Method to initialize Autocomplete and map when the button is clicked
  initializeAutocompleteAndConfirm() {

    // Use this.searchAddress.nativeElement instead of #search
    const input = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement)

    input.addListener('place_changed', () => {

      this.ngZone.run(() => {

        this.place = input.getPlace()
        this.placeSelected = true; // Set the flag to indicate a place has been selected

        if (this.place.geometry && this.place.geometry.location) {
          this.selectedLat = this.place.geometry.location.lat();
          this.selectedLng = this.place.geometry.location.lng();

          this.centerLat = this.selectedLat
          this.centerLng = this.selectedLng
          
          // Set the map center to the selected location

         // const newCenter = new google.maps.LatLng(this.selectedLat, this.selectedLng); // San Francisco
          //this.place.setCenter(newCenter);


          //this.place.setCenter(this.place.geometry.location);
         // this.place.setZoom(15); // You can adjust the zoom level as needed
        }

      
      })

    })

  }

  onConfirmLocation() {

    if (this.place && this.place.geometry && this.place.geometry.location) {
      
      this.selectedLat = this.place.geometry.location.lat()
      this.selectedLng = this.place.geometry.location.lng()
  
    }

    this.centerLat = this.selectedLat
    this.centerLng = this.selectedLng

    this.placeSelected = false
    this.getComponentData()

    // Get the location name using the Google Maps Places API
    const geocoder = new google.maps.Geocoder()
    const latlng = { lat: this.centerLat, lng: this.centerLng }

    geocoder.geocode({ location: latlng }, (results, status) => {

      if (status === google.maps.GeocoderStatus.OK) {
      
        if (results[0]) {
      
          const locationName = results[0].formatted_address
          this.locationName = locationName
      
          this.userAddress = {
            
            latitude: this.selectedLat,
            longitude: this.selectedLng,
            address_line1: locationName,
            address_line2: ''

          }

          let data = {

            user_address: this.userAddress,
            branch_id: this.branch_id
          }

          localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))

          const addressComponents = results[0].address_components

          for (const component of addressComponents) {

            if (component.types.includes("locality")) {

              const cityName = component.long_name

              this.cityName = cityName

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

    if(this.userId) {

      this.addNewAddress()

    } else {

      this.selectMapLocation = false
      this.userCurrentLocation = false

    }

  }
  
  addNewAddress() {

    this.selectMapLocation = false
    this.userCurrentLocation = false
    this.addNewAddressToggle = true
  
  }

  createAddress() {

    this.addressForm.get('latitude').setValue( this.selectedLat )
    this.addressForm.get('longitude').setValue( this.selectedLng )

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
     
      this.userAddress = this.addressForm.value

      let data = {

        user_address: this.userAddress,
        branch_id: this.branch_id
      }

      localStorage.setItem("THSAppointmentAddress", JSON.stringify(data))

      this.selectMapLocation = false
      this.userCurrentLocation = false
      this.addNewAddressToggle = false
      //this.addressForm.reset()


      if(this.userId !== null) {

        //we will perform some actions to store user location
        let address_data = {

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

        this._patientService.createAddress(address_data).subscribe({

          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              this.userLocations.push(address_data.address)
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

  }

  discardAddress() {

    this.addressForm.reset()
    this.selectMapLocation = false
    this.userCurrentLocation = false
    this.addNewAddressToggle = false

  }

  navigateToCategory(categoryId) {

    let category = this.allCategories.filter(c => {

      return c.id === categoryId

    })

    // Set the category ID in the service and navigate to the dynamic category URL
    this.dataService.setCategoryId(category[0].id);

    // Use the Router service to navigate to the dynamic category URL with query parameter
    this.router.navigate(['/medical-category', category[0].url])

  }

  navigateToService(serviceId) {

    let service = this.allServices.filter(s => {

      return s.id === serviceId

    })

    // Set the category ID in the service and navigate to the dynamic category URL
    this.dataService.setServiceId(service[0].id);

    // Use the Router service to navigate to the dynamic category URL with query parameter
    this.router.navigate(['/medical-services', service[0].id])

  }

  showMore(url) {

    this.router.navigate(['/medical-category', url])

  }

  openMenu() {

    document.getElementById("menuBar").style.width = '100%'

  }

  closeMenu() {

    document.getElementById("menuBar").style.width = '0%'

  }

  setCurrentLocation( location ) {

    this.selectedLat = location.latitude
    this.selectedLng = location.longitude
    this.centerLat = location.latitude
    this.centerLng = location.longitude

    this.locationName = location.location

    this.getComponentData()


  }
  
  navigateToDashboard() {

    if(this.userId !== null) {

      this.router.navigate(['/user/profile'])

    } else {

      this.router.navigate(['/login'])

    }

  }

  navigate(link) {

    this.closeMenu()
    this.router.navigate([link])

  }

  closeMap() {

    this.selectMapLocation = false
  }

  navigateToLogin() {

    if(this.userId !== null) {

      this.router.navigate(['/user/profile'])

    } else {

      this.router.navigate(['/login'])

    }

  }

  handleCancelClick(): void {}

  //alert continue button handler
  handleContinueClick(): void {

    this.showErrorUpdatingAddress = false

  }

  loadMoreCategories() {
    // Load more categories when "Load More" button is clicked
    const currentLength = this.displayedCategories.length;
    const remainingCategories = this.topServices.slice(currentLength, currentLength + this.itemsToLoadMore);
    this.displayedCategories = [...this.displayedCategories, ...remainingCategories];
  }

  switchLanguage(lang: string) {

    this.languageService.setLanguage(lang);
    this.onLanguageChange(lang);
    this.closeMenu()
  }

  onLanguageChange(language: string) {

    const currentLanguage = this.languageService.getCurrentLanguage();
    const body = document.getElementsByTagName('body')[0];
  
    if (language === 'ar') {
      body.setAttribute('dir', 'rtl');
      body.classList.add('web-font-ar');
      body.classList.remove('web-font');
    } else {
      body.setAttribute('dir', 'ltr');
      body.classList.add('web-font');
      body.classList.remove('web-font-ar');
    }
  }

}
