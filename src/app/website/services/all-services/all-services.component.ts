import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { APIResponse } from 'src/utils/app-enum';
import { WebsiteDataService } from 'src/service/website-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/utils/util.service';

declare var google: any;

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.css']
})
export class AllServicesComponent implements OnInit {

  data$ = this.dataService.data$;

    //html elemets 
  @ViewChild('search') searchElementRef: ElementRef
  
  userCurrentLocation: boolean = false
  selectMapLocation: boolean = false
  zoom: number = 15
  centerLat: number = 24.7136
  centerLng: number = 46.6753
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
    ) { 

      this.addressForm = this.fb.group({

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
  
  }
  
  ngAfterViewInit(): void {

   this.getComponentData()
 
  }
  
  getComponentData() {

    // This is where you should place your component-specific initialization code
    // that relies on the fetched data from dataService
    this.dataService.data$.subscribe((res) => {

      if (res) {
      
        // ... handle the received data here
        this.allCategories = res.categories
        this.allServices = res.services
        this.branch_id = res.branch
        //top 4 categories
        this.topCategories = this.allCategories.filter(category => {

          return category['top'] === 1

        })

        this.topCategories.slice(0, 4)

        /* Temporary hold */
        this.allServices.forEach(s => {

          s.top = 1

        })

        // now we will filter all top Services and assign them to TopServices object with respect to each category
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

      }

    })
    
  }

  getUserLocation() {

    
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
                return cityName // You can use the cityName as needed

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
  
      console.error("Geolocation is not supported by this browser.")
  
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
      this.addressForm.reset()

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
  
}
