import { Component, ElementRef, OnInit, ViewChild, NgZone, ChangeDetectorRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientUser } from "src/model/common/patient-user.model";
import { PatientsService } from "src/service/patient.service";
import { MapsAPILoader} from '@agm/core';
import * as moment from "moment";
import { NationalIdValidator } from "src/validators/nationalIdValidator";
import Swal from "sweetalert2";
import { HttpClient } from '@angular/common/http';


declare var google: any;
declare var $: any;

@Component({
  selector: 'app-appointments-new',
  templateUrl: './appointments-new.component.html',
  styleUrls: ['./appointments-new.component.css']
})
export class AppointmentsNewComponent implements OnInit {
  @ViewChild('searchSearviceInput') searchSearviceInput? : ElementRef<HTMLInputElement>;
  @ViewChild('searchAddress') searchAddress? : ElementRef<HTMLInputElement>;
  public todayDate : any = moment( new Date(Date.now()) ).format('YYYY-MM-DD');
  public patientList : Array<any> = [];
  public customItemForm : FormGroup;
  public patientForm : FormGroup;
  public personalInfo : FormGroup;
  public isAddingPatient : boolean = false;
  public selection : any = {
    patient : {},
    confirmed : false,
    serviceType : 'other',
    categoryId : -1,
    sectorId : -1,
    service : {},
    services : [],
    isServicesConfirmed : false,
    quote : {},
  };
  public serviceCategories : Array<any> = [];
  public services : Array<any> = [];
  public lat = 23.8859;
  public lng = 45.0792;
  public zoom : number = 8;
  private geoCoder : any = new google.maps.Geocoder;
  public paymentLink : any = '';
  public paymentId: any = '';
  public isCompleted : boolean = false;
  public needConfirmationIds : Array<any> = [ 1117, 1118, 1119, 1120 ];
  public isServiceConfirmed : boolean = false;
  public patientSources : Array<any> = [];
  public toggleHomeVisit : boolean = false;
  public toggleDiscount : boolean = false;
  public homeVistCharges : any = 0;
  public discountCharges: any =0;
  public extraTotal : any = 0;
  public accessLevel : number = 0;
  public patientDependents : Array<any> = [];

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor(
    private cd : ChangeDetectorRef,
    private autoCompleteApi: MapsAPILoader,
    private ngZone: NgZone,
    private fb : FormBuilder,
    private patientService: PatientsService,
    private http: HttpClient
  ) {

    // notValid

    this.patientForm = this.fb.group({
      firstName : ['', [Validators.required]],
      lastName : ['', [Validators.required]],
      mobileNumber : ['', [Validators.required, Validators.pattern( '^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$' )]],
      idType : ['nationalId', [Validators.required]],
      idNumber : ['', [Validators.required]],
      email : ['', [Validators.email]],
      dob : ['', [Validators.required]],
      gender : [ 1, [Validators.required]]
    },{ validators : NationalIdValidator( 'idNumber') });

    this.personalInfo = this.fb.group({
      address : ['', [Validators.required]],
      house : ['', [Validators.minLength(1)]],
      street: ['', [Validators.minLength(4)]],
      city : ['', [Validators.minLength(1)]],
      district : ['', [Validators.minLength(4)]],
      date : ['', [Validators.required]],
      time : ['', [Validators.required]],
      gender : ['', [Validators.required]],
      source : ['', [Validators.required]],
      adminNotes : ['']
    });

    this.customItemForm = this.fb.group({
      items : this.fb.array([])
    });

    this.customItemForm.valueChanges.subscribe({
      next : ( form : any ) => {
        this.calculateExtraItemTotal();
      }
    });
  }

  get items() : FormArray { return this.customItemForm.get('items') as FormArray }
  addItem(){
    this.items.push(
      this.fb.group({
        description : [''],
        price       : ['', [Validators.required]] 
      })
    );
  }
  removeItem( index : number ){ this.items.removeAt(index); this.calculateExtraItemTotal(); }
  calculateExtraItemTotal(){
    this.extraTotal = 0;
    for (let index = 0; index < this.items.value.length; index++) {
      const price : any = this.items.value[index].price || 0;
      if( !['', null, undefined].includes( price ) ){
        this.extraTotal += parseFloat( price );
      }
    }
  }

  ngOnInit() {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });

    let sessionInfo = localStorage.getItem("SessionDetails");
    if( sessionInfo ){
      this.accessLevel = JSON.parse( sessionInfo ).accessLevel || 0;
    }

    if( this.accessLevel == 1 ){
      $(".onlyadmin").removeClass("dclass");
      $('.onlyservicerequests').show();
      $(".nav-link").click(function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
      });
      $(".dropdown-check-list").hover(function () {
        $("#items").toggle();
      });
    }else{
      $('.onlylabmenu').removeClass('dclass');
    }

    // $("input.timepicker").timepicker({
    //   timeFormat: "hh:mm p",
    //   interval: 15,
    // });
    // Get Categories
    this.getCategories();

    this.patientService.getPatientSources().subscribe({
      next : ( res : any )=>{
        this.patientSources = res.result;
      }
    });


    //searchAddress
    this.autoCompleteApi.load().then(() => {
      const input = new google.maps.places.Autocomplete(this.searchAddress?.nativeElement);
      input.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: any = input.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.personalInfo.get('address')?.setValue( place.formatted_address );
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  onChangeAddress(){
    const value : string = (this.searchAddress.nativeElement.value as string).trim();
    // FROM GOOGLE MAP
    if( value.includes('google.com/maps/place/') ){
      let params = value.substring( (value.indexOf( "@" )+1), (value.indexOf( "/data" ) - 4));
      let coords = params.split(',');
      let lat : any = coords[0];
      let lng : any = coords[1];

      if( lat != '' && lng != '' ){
        this.lat = Number( lat );
        this.lng = Number( lng );
        this.getAddress( this.lat, this.lng);
      }
    }
    // FROM WHATSAPP LOCATION
    else if( value.includes('google.com/maps') ){
      let params = value.substring( (value.indexOf( "q=" )+2), value.length );
      let latlngString = params.substring( 0, params.indexOf( "&z=" ) );

      let lat : any = latlngString.substring( 0, params.indexOf( "%2C" ) );
      let lng : any = latlngString.substring( params.indexOf( "%2C" )+3, latlngString.length );

      if( lat != '' && lng != '' ){
        this.lat = Number( lat );
        this.lng = Number( lng );
        this.getAddress( this.lat, this.lng);
      }
    }
  }

  public onMapReady( map : any ) {
    map.addListener("click", ( e : any ) => {
      this.lat = e.latLng.lat(); 
      this.lng = e.latLng.lng();
      this.cd.detectChanges();
      this.getAddress(this.lat, this.lng);
    });
  }

  onMarkerDragEnd( event : any ){
    this.lat = event.coords.lat; 
    this.lng = event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  getAddress( latitude : any, longitude : any ){
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, ( results : Array<any>, status : any) => {
      if( status == 'OK' ){
        if( results.length > 0 ){
          this.personalInfo.get('address')?.setValue( results[0].formatted_address );
          this.searchAddress.nativeElement.value = results[0].formatted_address;
        }else{
          Swal.fire('No result found');
        }
      }else{
        Swal.fire( 'Error', 'Geocoder failed due to: ' + status, 'error');
      }
    });
  }

  /*******************************************************************
   * ON CHANGE SERVICE TYPT
   *******************************************************************/
  onChangeServiceType( input : any ){
    // if( input.value == 'other' ){
    //   this.selection.services = [];
    // }
    // else if( this.selection.serviceType == 'other' && ['lab-package', 'lab-individual'].includes( input.value )){
    //   this.selection.services = [];
    // }
    this.selection.serviceType = input.value;
    this.getCategories();
  }

  /*******************************************************************
   * ON SEARCH SERVICES BY TYPE [Packages/Individual/Other]
   *******************************************************************/
  onSearchSevice(){
    const value : string =  this.searchSearviceInput?.nativeElement.value || '';
    if( value.trim() != '' ){
      // Unselect Category & empty services
      this.selection.categoryId = -1;
      this.selection.sectorId = -1;
      this.services = [];
      // Search Searvices
      this.patientService.searchServicesByType( { 
        query : value,
        type : this.selection.serviceType 
      } ).subscribe({
        next  : ( res : any ) => {
          this.services = res.services;
        },
        error : ( err : any ) => { Swal.fire("Error", err.error.message, "error"); }
      });
    }
  }

  /*******************************************************************
   * ON Select Service
   *******************************************************************/
  onSelectSevice( service : any ){
    let notValid : Array<any> = ['', null, undefined, false, 0, '0'];
    if( !notValid.includes( service.name ) && !notValid.includes( service.price ) && !notValid.includes( service.id )  ){
      service.primaryPatientId = this.selection.patient.userId;
      service.patientId = this.selection.patient.userId;
      service.patientName = this.selection.patient.firstName+' '+this.selection.patient.lastName;
      this.selection.services.push( service );
    }else{
      Swal.fire('Invalid service or this service is incomplete');
    }
    this.isServiceConfirmed = false;
  }
 
  onRemoveService( index : number ){
    this.selection.services.splice( index, 1 );
  }

  getSelectedServicesTotal(){
    let total = 0;
    for (let index = 0; index < this.selection.services.length; index++) {
      const service = this.selection.services[index];
      total += service.price;
    }

    total = total - this.discountCharges;
    return total;
  }

  getCalculation( type : any, total : any ){
    let homeVisit = ( ['', 0, '0'].includes(this.homeVistCharges) ) ? 0 : parseFloat( this.homeVistCharges );
    
    let discount = ( ['', 0, '0'].includes(this.discountCharges) ) ? 0 : parseFloat( this.discountCharges );

    let vat = 0;

    if( this.selection.services.length == 0 ){
      return 0;
    }
    

    let isResident : boolean = false;
    if( ( this.selection.patient.idType == '' || this.selection.patient.idType == 'nationalId' ) && this.selection.patient.nationalId.length > 0 && this.selection.patient.nationalId[0] == '1' ){
      isResident = true;
    }
    
    if( !isResident ){ 
      vat = 15;
    }

    switch ( type ) {
      case 'vat':
        return Math.round((parseFloat(total)+homeVisit+parseFloat(this.extraTotal)) * (vat / 100));

      case 'final':
        return Math.round(this.getCalculation('vat', total)+total+homeVisit+parseFloat(this.extraTotal));

      default:
        break;
    }
    return 0;
  }

  onConfirmService(){
    let message : string = 'Service : '+this.selection.service.name+'\n';
    message += 'Patient Name: '+this.selection.patient.firstName+' '+this.selection.patient.lastName+'\n';
    message += 'Address: '+this.personalInfo.get('address')?.value+'\n';
    message += 'Service Date: '+this.personalInfo.get('date')?.value+'\n';
    message += 'Service Time: '+this.personalInfo.get('time')?.value+'\n';
    message += 'Service Price: '+this.selection.service.price+'\n';
    this.copyMessage( message );
    this.isServiceConfirmed = true;
  }

  /*******************************************************************
   * GET CATEGORIES
   *******************************************************************/
  getCategories(){
    this.serviceCategories = [];

    this.patientService.serviceCategories( { type : this.selection.serviceType } ).subscribe({
      next : ( res : any ) => {
        this.serviceCategories = res.categories;
        if( this.serviceCategories.length > 0 ){
          this.getServiceByCategory( this.serviceCategories[0].id, this.serviceCategories[0]?.sectorId || null );
        }
      },
      error : ( err : any ) => { Swal.fire("Error.", err.error.message, "error"); }
    });
  }
  /*******************************************************************
   * GET SERVICES BY CATEGORIES
   *******************************************************************/
  getServiceByCategory( id : any, sectorId : any = null ){
    if( this.searchSearviceInput?.nativeElement ){
      this.searchSearviceInput.nativeElement.value = '';
    }
    this.services = [];
    this.selection.categoryId = id;
    this.selection.sectorId = sectorId;

    this.patientService.getServicesByCategory( { 
      catId : this.selection.categoryId, 
      sectorId : this.selection.sectorId,
      type : this.selection.serviceType 
    } ).subscribe({
      next  : ( res : any ) => {
        this.services = res.services;
      },
      error : ( err : any ) => { Swal.fire("Error.", err.error.message, "error"); }
    });
  }
  /*******************************************************************
   * ON SEARCH PATIENT
   *******************************************************************/
  onSearchPatient( query : string ){
    if ( query.trim() == "" || query.trim().length < 9 ) {
      Swal.fire("Error.", "Please enter a valid mobile number or National ID!", "error");
      return;
    } 

    this.onReset();

    this.patientService.search( query ).subscribe({
      next : ( res : any ) => {
        this.patientList = PatientUser.getPatientList( res );
        if( this.patientList.length == 0 ){
          this.isAddingPatient = true;
          Swal.fire('<p style="font-size:18px; line-height:25px">No patient found for "'+query+'" against mobile number or National ID. You can add this as new patient</p>');
        }
      },
      error: ( err : any ) => { Swal.fire("Error.", err.error.message, "error"); }
    });
  }
  /*******************************************************************
   * ON SELECT PATIENT
   *******************************************************************/
  onSelectPatient( patient : any ){
    let gender = { "Male" : 1, "Female" : 2, "Any" : 3 };
    this.selection.patient = patient;
    this.personalInfo.reset({
      gender : gender[patient?.gender] || 3,
      source : ''
    });

    this.selection.confirmed = false;
    this.selection.service = {};
    this.selection.categoryId = -1;
    this.selection.services = [];
    this.selection.isServicesConfirmed=false;
    this.selection.quote = {};

    this.paymentLink = "";
    this.paymentId = "";
    this.isCompleted = false; // Is Appointment has been created
    this.isServiceConfirmed = false;
    this.homeVistCharges = 0;
    this.toggleHomeVisit = false;
    this.toggleDiscount = false;
    this.patientDependents = [];
    this.getPatientDependents( patient.userId );
  }

  getPatientDependents( patientId : any ){
    this.patientService.getPatientDependents( patientId ).subscribe({
      next : ( res : any ) => { 
        this.patientDependents = PatientUser.getPatientList( res );
      },
      error: ( err : any ) => { Swal.fire("Error.", err.error.message, "error"); }
    });
  }

  onChangeServicePatient( serviceIndex : any, event : any ){
    let patient : Array<any> = this.patientDependents.filter( ( patient : any ) => patient.userId == event.target.value );
    this.selection.services[serviceIndex].patientId = event.target.value;
    if( patient.length > 0 ){
      this.selection.services[serviceIndex].patientName = patient[0].firstName+' '+patient[0].lastName;
    }
  }

  onReset(){
    this.patientForm.reset({ gender : 1, idType : 'nationalId' });
    this.personalInfo.reset();
    this.isAddingPatient = false;
    // RESET PATIENT SELECTION
    this.selection.patient = {};
    this.selection.confirmed = false;
    
    this.selection.categoryId = -1;
    // RESET SERVICES
    this.isServiceConfirmed = false;
    this.selection.isServicesConfirmed = false;
    this.selection.service = {};
    this.selection.services = [];
    // RESET QUOTE
    this.selection.quote = {};
    // RESET PAYMENT INFO
    this.paymentLink = "";
    this.paymentId = "";
    this.isCompleted = false;

    this.customItemForm = this.fb.group({
      items : this.fb.array([])
    });
    this.extraTotal = 0;

    this.discountCharges = 0;
  }

  onCreatePatient(){
    if( this.patientForm.invalid ){
      this.patientForm.markAllAsTouched();
      return;
    }

    this.patientService.create( this.patientForm.value ).subscribe({
      next : ( res : any ) => {
        let data : any = this.patientForm.value;
        data.userId = res.patientId;
        data.gender = ( data.gender == 1 || data.gender == "1" ) ? "Male" : "Female";
        data.emailId = data.email;
        delete data.email;
        data.nationalId = data.idNumber;
        delete data.idNumber;
        this.patientList.push( data );
        this.onReset();
        Swal.fire("Success", res.message, "success");
      },
      error : ( err : any) => { Swal.fire("Error", err.error.message, "error"); }
    });
  }

  onSubmit(){

    let serviceDate = moment(this.personalInfo.get('date').value, "YYYY-MM-DD").format("DD/MM/YYYY");
    let serviceTime = moment(this.personalInfo.get('time').value, ["HH:mm"]).format("h:mm A");

    let data = { 
      date : serviceDate,
      time : serviceTime,
      address : this.personalInfo.get('address').value,
      patient : this.selection.patient,
      services : this.selection.services,
      type    : this.selection.serviceType,
      homeVisit : this.homeVistCharges,
      extraTotal : this.extraTotal,
      discount: this.discountCharges
    };
    
    this.patientService.getQuote( data ).subscribe({
      next  : ( res : any ) => { 
        this.selection.quote = res.quote; 
        this.paymentLink = res.link;
        this.paymentId = res.paymentId;
        this.onCreateAppointment();
      },
      error : ( err : any ) => { Swal.fire("Error", err.error.message, 'error' ); }
    });
  }

  onCreateAppointment(){
    let data = { 
      date : this.personalInfo.get('date').value,
      time : this.personalInfo.get('time').value,
      address : this.personalInfo.get('address').value,
      patient : this.selection.patient,
      service : this.selection.services,
      type    : this.selection.serviceType,
      price   : this.selection.quote?.total || this.getCalculation('final', this.getSelectedServicesTotal()),
      paymentLink : this.paymentLink,
      paymentId : this.paymentId,
      gender : this.personalInfo.get('gender').value,
      source : this.personalInfo.get('source').value,
      adminNotes : this.personalInfo.get('adminNotes').value,
      lat : this.lat,
      lng : this.lng,
    };

    this.patientService.createAppointment( data ).subscribe({
      next  : ( res : any ) => {
        Swal.fire("Success", res.message, 'success' );
        this.isCompleted = true;
      },
      error : ( err : any ) => { Swal.fire("Error", err.error.message, 'error' ); }
    });
  }

  onSendSMS(){
    this.patientService.sendSMS( { phone : this.selection.patient.mobileNumber, url : this.paymentLink } ).subscribe({
      next : ( res : any ) => { 
        Swal.fire('Success', res.message, 'success' );
      },
      error: ( err : any ) => { 
        console.log(err);
        Swal.fire('Error', err.error.message, 'error'); 
      }
    });
  }

  // COPY TO CLIPBOARD
  copyMessage( val: string, type : any = '' ){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    if( type == 'iban' ){
      this.onCreateAppointment();
    }else{
      Swal.fire('Success', 'Copied to clipboard', 'success');
    }
  }
}
