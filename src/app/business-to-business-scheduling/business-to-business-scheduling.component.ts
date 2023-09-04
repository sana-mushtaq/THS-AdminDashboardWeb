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

declare var google: any;

@Component({
  selector: 'app-business-to-business-scheduling',
  templateUrl: './business-to-business-scheduling.component.html',
  styleUrls: ['./business-to-business-scheduling.component.css']
})

export class BusinessToBusinessSchedulingComponent implements OnInit {

  @ViewChild('search') searchElementRef: ElementRef

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
  records: any[] = []; // Array to store the records
  currentPage = 0; // Current page index
  pageSize = 1; // Number of records to display per page
  allServices: any = []

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

  constructor(
    private dataService: WebsiteDataService,
    private _branchService: BranchService,
    private _b2c: BusinessToCustomerSchedulingService,
    private http: HttpClient,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {

      this.serviceSettings = {
        idField: 'id',
        textField: 'title',
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

      for (let hour = 12; hour <= 23; hour++) {

        this.timeSlots.push(this.formatTimeSlot(hour))
  
      }

      //first we will get user location and display on the header
      this.getUserLocation()

   }

  ngOnInit(): void { 

     //this will be called at first to get a list of branches
     this.getBranchList()

     this.mapsAPILoader.load().then(() => {})

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
        this.allServices = res.services
            
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

      } else {
        // Headers are not valid

        alert('Invalid headers in the Excel file.')
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

    this.preferredDate = date.value

  }

  setPreferredBranch(item) {

    this.preferredBranch = item.id

  }

  setPreferredService(item) {

    this.preferredService = item.id

  }

  unsetPreferredBranch(item) {

    this.preferredBranch = null

  }

  unsetPreferredService(item) {

    this.preferredService = null

  }

  createAppointment(record) {

    if(!this.preferredDate || !this.preferredTime) {

      alert('Select appointment date & time')

    }

    if(!this.preferredService) {

      alert('Select service')

    }

    if(!this.preferredBranch) {

      alert('Select branch')

    }

    if(this.preferredDate && this.preferredTime &&  this.preferredService && this.preferredBranch) {

      let fetchService = this.allServices.filter( service => {

        return service.id === this.preferredService

      })

      let category_id = fetchService[0].category_id
      let service_name = fetchService[0].title
      let admin_notes = (document.getElementById("adminNotes") as any).value

      if(record['Gender'] && (record['Gender']).toLowerCase === 'male') {

        record['Gender'] = 1

      }

      if(record['Gender'] && (record['Gender']).toLowerCase === 'female') {

        record['Gender'] = 2

      }


      let data = {

        service_name: service_name,
        service_id: this.preferredService,
        branch_id: this.preferredBranch,
        scheduled_date: this.preferredDate,
        scheduled_time: this.preferredTime,
        category_id: category_id,
        userData: record,
        admin_notes: admin_notes

      }

      this._b2c.createB2B(data).subscribe({
    
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
  
            this.preferredDate = null
            this.preferredTime = null
            this.preferredService = null
            this.preferredBranch = null

            let index = this.records.indexOf(record)
            this.records.splice(index,1);

            (document.getElementById("adminNotes") as any).value = '';
            (document.getElementById("date") as any).value = '';
            
            alert('Appointment successfully created')
  
          } else {
  
            alert("An error occurred while creating an appointment")
         
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

}
