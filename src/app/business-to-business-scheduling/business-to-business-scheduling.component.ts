import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BranchService } from 'src/service/branch.service';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { WebsiteDataService } from 'src/service/website-data.service';
import { APIResponse } from 'src/utils/app-enum';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import { Subscription } from 'rxjs';
import { ServiceService } from 'src/service/service.service';

declare var google: any;

@Component({
  selector: 'app-business-to-business-scheduling',
  templateUrl: './business-to-business-scheduling.component.html',
  styleUrls: ['./business-to-business-scheduling.component.css']
})

export class BusinessToBusinessSchedulingComponent implements OnInit {

  @ViewChild('search') searchElementRef: ElementRef

  serviceProvidersServices: any

  displayDate: boolean = false
  displayTime: boolean = false
  displaySp: boolean = false

  //popup
  openRecord = false

  //locations
  place: any
  placeSelected: boolean = false
  zoom: number = 15
  centerLat: number = 24.7136
  centerLng: number = 46.6753
  selectedLat: number
  selectedLng: number

  branchList: any = []
  serviceSettings: IDropdownSettings = {}
  branchSettings: IDropdownSettings = {}
  spSettings: IDropdownSettings = {}
  records: any[] = []; // Array to store the records
  currentPage = 0; // Current page index
  pageSize = 1; // Number of records to display per page
  allServices: any = []

  allSP: any = []
  currentRecord: any = {}

  //the following displays allowed headers for excel sheet
  allowedHeaders = ['Name', 'Phone', 'Gender', 'District', 'City', 'Status', 'Member code', 'Policy number', 'Policy Name', 'Network', 'Request date', 'Sent date', 'Call date', 'Vaccine date', 'Provider', 'Request source', 'Region']

  file: File | null = null;
  errorMessage: string | null = null;

  timeSlots: string[] = [] // Array to hold time slots
  preferredTime: any
  preferredDate: any

  preferredService: any
  preferredBranch: any
  preferredServiceProvider: any

  private dataSubscription: Subscription;

  private fetchedData: any = {
    serviceProviders: [],
    appointments: []
  }

  constructor(
    private dataService: WebsiteDataService,
    private _branchService: BranchService,
    private _b2c: BusinessToCustomerSchedulingService,
    private http: HttpClient,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _service: ServiceService,
  ) {

      this.serviceSettings = {
        idField: 'id',
        textField: 'title_arabic',
        allowSearchFilter: true,
        singleSelection: true, // Set to true for single selection
        enableCheckAll: false,
      }

      this.branchSettings = {
        idField: 'id',
        textField: 'title',
        allowSearchFilter: true,
        singleSelection: true, // Set to true for single selection
        enableCheckAll: false,
      }

      this.spSettings = {
        idField: 'id',
        textField: 'title',
        allowSearchFilter: true,
        singleSelection: true, // Set to true for single selection
        enableCheckAll: false,
      }

      for (let hour = 12; hour <= 23; hour++) {

        this.timeSlots.push(this.formatTimeSlot(hour))
  
      }

      //first we will get user location and display on the header
      this.getUserLocation()

  }

  ngOnInit(): void { 

    $(".onlyadmin").removeClass("dclass");
    $('.onlyservicerequests').show();
    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    });
    $(".dropdown-check-list").hover(function () {
      $("#items").toggle();
    });

    //this will be called at first to get a list of branches
    this.getBranchList()

    this.mapsAPILoader.load().then(() => {})

    let sa =  {
      user_id: 1

    }

    this._b2c.getSocketData(sa).subscribe({
      
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {

          //after fetching all service providers we will now check if their gender match with selected user or not 
          this.fetchedData = res.data

        } else {

       
        }
        
      },
      error: ( err: any ) => {
        
        console.log(err)

      }
  
    }) 

    this.getServiceList()

    this.records = JSON.parse(localStorage.getItem("THS_B2B")) || [];

  }

  onChangeAddress() {

    const value : string = (this.searchElementRef.nativeElement.value as string).trim();
    // FROM GOOGLE MAP
    if( value.includes('google.com/maps/place/')) {

      let params = value.substring( (value.indexOf( "@" )+1), (value.indexOf( "/data" ) - 4));
      let coords = params.split(',');
      let lat : any = coords[0];
      let lng : any = coords[1];

      if( lat != '' && lng != '' ) {

        this.selectedLat = Number(lat)
        this.selectedLng = Number(lng)
        this.centerLat = Number(lat)
        this.centerLng = Number(lng)

        this.getAddress( this.selectedLat, this.selectedLng)

      }

    }
    // FROM WHATSAPP LOCATION
    else if( value.includes('google.com/maps')) {

      let params = value.substring((value.indexOf( "q=" )+2), value.length)
      let latlngString = params.substring( 0, params.indexOf( "&z=" ))

      let lat : any = latlngString.substring(0, params.indexOf( "%2C" ))
      let lng : any = latlngString.substring(params.indexOf( "%2C" )+3, latlngString.length)

      if(lat != '' && lng != '') {

        this.selectedLat = Number(lat)
        this.selectedLng = Number(lng)
        this.centerLat = Number(lat)
        this.centerLng = Number(lng)
        
        this.getAddress( this.selectedLat, this.selectedLng)

      }

    }

  }
   
  getAddress( latitude : any, longitude : any ){

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, ( results : Array<any>, status : any) => {
      
      if( status == 'OK' ){
      
        if( results.length > 0 ){
      
          this.searchElementRef.nativeElement.value = results[0].formatted_address;

        } else{
          
          Swal.fire('No result found');

        }
      
      } else{
      
        Swal.fire( 'Error', 'Geocoder failed due to: ' + status, 'error');
      
      }

    });

  }

  //the following function will fetch a list of services from backend
  getServiceList() {

      //now we will get a list of categories from the backend
      this._service.getServiceList().subscribe({
    
        next : ( res : any ) => {
    
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {
    
            this.allServices = res.data
    
          }
          
        },
        error: ( err: any ) => {
    
          console.log(err)
    
        }
      
      })
      
  }

  getBranchList() {

    //now we will get a list of branches from the backend
    this._branchService.getBranchList().subscribe({
   
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.branchList = res.data

        } else {

          //if it is unable to get branch data it will return an error
          Swal.fire(res.message)

        }
        
      },
      error: ( err: any ) => {

        console.log(err)

      }
   
    })

  }

  getSp(){

    let data ={

      branch_id: this.preferredBranch,
      service_id: this.preferredService
    }

      //now we will get a list of branches from the backend
      this._b2c.fetchb2bServiceProviders(data).subscribe({
   
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {
  
            console.log(this.allSP)
            this.allSP = res.data
  
          } else {
  
            //if it is unable to get branch data it will return an error
            Swal.fire(res.message)
  
          }
          
        },
        error: ( err: any ) => {
  
          console.log(err)
  
        }
     
      })

  }
  
  //the following will display b2b service.
  newAppointment() {


  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Use sheet_to_json with header option set to 1 to get the header row
      const rawHeaders: any = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      })[0];

      // Cast rawHeaders to an array of strings and trim spaces
      const headers: string[] = rawHeaders.map(header => (header as string).trim());


      if (this.validateHeaders(headers)) {
        // Headers are valid, you can proceed with further processing
        console.log('Headers are valid.');

        // Use sheet_to_json with header option set to 1 to get the data rows
        const dataRows: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        // Iterate through data rows
        for (const row of dataRows) {
          // Handle empty columns by converting them to empty strings
          const record: any = {};
          for (const [index, header] of dataRows[0].entries()) {
            const cellValue = row[index] || ''; // Convert undefined or null to empty string
            record[header] = cellValue;
          }
          this.records.push(record);
        }

        this.records.splice(0,1)


        localStorage.setItem("THS_B2B", JSON.stringify(this.records));

      } else {
        // Headers are not valid
        Swal.fire("Invalid headers in the Excel file.")

        console.error('Invalid headers in the Excel file.');
      }
    };

    reader.readAsBinaryString(file);

    
  }

  validateHeaders(headers: string[]): boolean {

    // Check if the headers in the Excel file match the allowed headers
    return this.allowedHeaders.every(header => headers.includes(header));
  
  }

  get totalRecords(): number {
    return this.records.length;
  }

  onNext(): void {
    if (this.currentPage < this.totalRecords - 1) {
      this.currentPage++;
    }
  }

  onPrevious(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  formatTimeSlot(hour: number): string {

    const amPm = hour >= 12 ? 'pm' : 'am'

    const formattedHour = hour > 12 ? hour - 12 : hour
  
    return `${formattedHour === 0 ? 12 : formattedHour}:00${amPm}`

  }

  setPreferredTimeSlot(time) {

    this.preferredTime = time

  }

  setPreferredDate(date){

    this.displayTime = false
    if(this.preferredBranch && this.preferredService) {

      this.preferredDate = date.value

      this.getAvailableTimeSlots()


    } else {

      Swal.fire("Select branch and service")

    }

  }

  setPreferredBranch(item) {

    this.preferredBranch = item.id

    if(this.preferredBranch && this.preferredService) {

      this.getSp()
      this.displaySp = true
      this.displayDate = true

    }

    this.displayTime = false
    this.getAvailableTimeSlots()

  }

  setPreferredService(item) {

    this.preferredService = item.id

    if(this.preferredBranch && this.preferredService) {

      this.getSp()
      this.displaySp = true
      this.displayDate = true

    }

    this.displayTime = false
    this.getAvailableTimeSlots()

  }

  unsetPreferredBranch(item) {

    this.preferredBranch = null

    this.displayTime = false
  }

  unsetPreferredService(item) {

    this.preferredService = null
    this.displayTime = false
  }

  createAppointment(record) {

    if(!this.preferredDate || !this.preferredTime) {
      
      Swal.fire("Select branch and service")
    
    }

    if(!this.preferredService) {
   
      Swal.fire("Select branch and service")

    }

    if(!this.preferredBranch) {
      
      Swal.fire("Select branch and service")

    }

    if(this.preferredDate && this.preferredTime &&  this.preferredService && this.preferredBranch) {

      let fetchService = this.allServices.filter( service => {

        return service.id === this.preferredService

      })

      let category_id = fetchService[0].category_id
      let service_name = fetchService[0].title
      let admin_notes = (document.getElementById("adminNotes") as any).value

      if(record['Gender'] && (record['Gender']) === 'male') {

        record['Gender'] = 1

      }

      if(record['Gender'] && (record['Gender']) === 'female') {

        record['Gender'] = 2

      }

      let data = {

        service_name: service_name,
        service_id: this.preferredService,
        branch_id: this.preferredBranch,
        scheduled_date: this.preferredDate,
        scheduled_time: this.preferredTime,
        category_id: category_id,
        userData: JSON.stringify(record),
        admin_notes: admin_notes,
        service_provide_id: this.preferredServiceProvider

      }

      this._b2c.createB2B(data).subscribe({
    
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
  
            this.preferredDate = null
            this.preferredTime = null
            this.preferredService = null
            this.preferredBranch = null
            this.preferredServiceProvider = null

            let index = this.records.indexOf(record)
            this.records.splice(index,1);

            localStorage.setItem("THS_B2B", JSON.stringify(this.records));

            (document.getElementById("adminNotes") as any).value = '';
            (document.getElementById("date") as any).value = '';

            this.openRecord = false
            this.displayTime = false

            Swal.fire("Appointment created successfully")
  
          } else {

            Swal.fire("An error occurred while creating an appointment")
         
          }
          
        },
        error: ( err: any ) => {
          
          console.log(err)
  
        }
    
      })



    }

  }

  downloadTemplate(): void {
    const templateFileName = 'b2b.xlsx'; // Replace with your template file name

    // Construct the template file URL
    const templateUrl = `./assets/template/${templateFileName}`;

    // Fetch the template file using HttpClient
    this.http.get(templateUrl, { responseType: 'blob' }).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = window.URL.createObjectURL(blob);

      // Set the anchor's attributes for downloading
      a.href = objectUrl;
      a.download = templateFileName;

      // Trigger the click event to start the download
      a.click();

      // Clean up by revoking the object URL
      window.URL.revokeObjectURL(objectUrl);
    });
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

        this.currentRecord['Latitude'] = this.selectedLat
        this.currentRecord['Longitude'] = this.selectedLat

        // Get the location name using the Google Maps Places API
        const geocoder = new google.maps.Geocoder()
        const latlng = { lat: this.centerLat, lng: this.centerLng }
    
        geocoder.geocode({ location: latlng }, (results, status) => {

          if (status === google.maps.GeocoderStatus.OK) {
          
            if (results[0]) {
          
              const locationName = results[0].formatted_address

              this.currentRecord['Location'] = locationName
      
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

  onMapClick(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    this.currentRecord['Latitude'] = this.selectedLat
    this.currentRecord['Longitude'] = this.selectedLat

     // Get the location name using the Google Maps Places API
     const geocoder = new google.maps.Geocoder()
     const latlng = { lat: this.centerLat, lng: this.centerLng }
 
     geocoder.geocode({ location: latlng }, (results, status) => {

       if (status === google.maps.GeocoderStatus.OK) {
       
         if (results[0]) {
       
           const locationName = results[0].formatted_address

           this.currentRecord['Location'] = locationName
   
         } else {
       
           console.error("No results found.")
       
         }
       
       } else {
         
         console.error("Geocoder failed due to: " + status)
       
       }

     })

  }

  onMarkerDragEnd(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    // Update the center of the map to the dragged marker's position
    this.centerLat = this.selectedLat
    this.centerLng = this.selectedLng

    this.placeSelected = true

    this.currentRecord['Latitude'] = this.selectedLat
    this.currentRecord['Longitude'] = this.selectedLat

     // Get the location name using the Google Maps Places API
     const geocoder = new google.maps.Geocoder()
     const latlng = { lat: this.centerLat, lng: this.centerLng }
 
     geocoder.geocode({ location: latlng }, (results, status) => {

       if (status === google.maps.GeocoderStatus.OK) {
       
         if (results[0]) {
       
           const locationName = results[0].formatted_address

           this.currentRecord['Location'] = locationName
   
         } else {
       
           console.error("No results found.")
       
         }
       
       } else {
         
         console.error("Geocoder failed due to: " + status)
       
       }

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

     // Get the location name using the Google Maps Places API
     const geocoder = new google.maps.Geocoder()
     const latlng = { lat: this.centerLat, lng: this.centerLng }
 
     geocoder.geocode({ location: latlng }, (results, status) => {

       if (status === google.maps.GeocoderStatus.OK) {
       
         if (results[0]) {
       
           const locationName = results[0].formatted_address

           this.currentRecord['Location'] = locationName
   
         } else {
       
           console.error("No results found.")
       
         }
       
       } else {
         
         console.error("Geocoder failed due to: " + status)
       
       }

     })

  } 

  onMapClick1(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    this.currentRecord['Latitude'] = this.selectedLat
    this.currentRecord['Longitude'] = this.selectedLat

     // Get the location name using the Google Maps Places API
     const geocoder = new google.maps.Geocoder()
     const latlng = { lat: this.centerLat, lng: this.centerLng }
 
     geocoder.geocode({ location: latlng }, (results, status) => {

       if (status === google.maps.GeocoderStatus.OK) {
       
         if (results[0]) {
       
           const locationName = results[0].formatted_address

           this.currentRecord['Location'] = locationName
   
         } else {
       
           console.error("No results found.")
       
         }
       
       } else {
         
         console.error("Geocoder failed due to: " + status)
       
       }

     })

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
        this.place.setCenter(this.place.geometry.location);
        this.place.setZoom(15); // You can adjust the zoom level as needed
      }
    
    })

  })

  }

  openRecordDetail(record) {

    this.currentRecord = record
    this.openRecord = true

    setTimeout(()=>{

      this.initializeAutocompleteAndConfirm()

    }, 500)

  }

  getAvailableTimeSlots() {
    
    const serviceId = this.preferredService

    let spData  = {

      service_id: serviceId,
      branch_id: this.preferredBranch

    }

    this._b2c.getServiceProviderService(spData).subscribe({

      next : ( ress : any ) => {

        //in case of success the api returns 0 as a status code
        if( ress.status === APIResponse.Success ) {

          //after fetching all service providers we will now check if their gender match with selected user or not 
          this.serviceProvidersServices = ress.data        
            // Get all service providers for the selected service
          const sps = this.serviceProvidersServices.filter(sps => {
            return sps.service_id === serviceId;
          });

          // Convert the selected date to "YYYY-MM-DD" format
          const formattedSelectedDate = this.preferredDate;

  
          let day = formattedSelectedDate
    
          // Create an array to map the day index to its name
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
          // Create a new Date object from the selected date
          const dateObject = new Date(day);
    
          // Get the day index (0 for Sunday, 1 for Monday, etc.)
          const dayIndex = dateObject.getDay();
    
          // Get the day name from the dayNames array using the day index
          const dayName = dayNames[dayIndex].toLowerCase();

          console.log(formattedSelectedDate)

          let uniqueScheduledTimes = this.fetchedData.appointments
          .filter(app => {
            // Check if app.serviceAssigneeId is not null and there's a matching sp in sps
            return (
              app.serviceAssigneeId !== null &&
              sps.some(sp => sp.user_id === app.serviceAssigneeId) &&
              sps.some(sp => sp[dayName] !== 0) &&
              app.serviceDate === formattedSelectedDate
            );
          }).map(app => {
            // Convert the database time format (e.g., "2023-09-04T19:00:00.000Z") to time slots format (e.g., "4:00pm")
            const dbTime = app.serviceTime;
            const [hours, minutes] = dbTime.split(':');
            const ampm = hours >= 12 ? 'pm' : 'am';
            const formattedTime = `${(hours % 12) || 12}:${minutes}${ampm}`;
            return formattedTime;
          });

          uniqueScheduledTimes = new Set(uniqueScheduledTimes);
 
          // Count the occurrences of each time slot
          const timeSlotCounts = {};
 
          uniqueScheduledTimes.forEach(time => {
          
            timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
        
          });

          console.log(uniqueScheduledTimes)
          // Filter the time slots where all service providers are booked
          const filteredTimeSlots = Object.keys(timeSlotCounts).filter(time => {
          
            return timeSlotCounts[time] === sps.length;
          
          });

          console.log(filteredTimeSlots)
          // Function to check if a time slot is available
          const isTimeSlotAvailable = (timeSlot: string) => {
            return !filteredTimeSlots.includes(timeSlot);
          };
      
          this.timeSlots = [];
          // Generate time slots and filter unavailable ones
          for (let hour = 12; hour <= 23; hour++) {
            const timeSlot = this.formatTimeSlot(hour);
            if (isTimeSlotAvailable(timeSlot)) {
              this.timeSlots.push(timeSlot);
            }
          }

          this.displayTime = true

        } else {}
        
      },
      error: ( err: any ) => {
        
        console.log(err)

      }
  
    }) 

  }

  // Assuming selectedDate is a Date object
  formatSelectedDate(selectedDate: Date) {

    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`

  }

  setServiceProvider(event) {

    this.preferredServiceProvider = event.target.value
    this.displayTime = false
    this.getAvailableTimeSlots()
  }

}
