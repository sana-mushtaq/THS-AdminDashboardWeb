import { Component, ElementRef, OnInit, ViewChild, NgZone, ChangeDetectorRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientUser } from "src/model/common/patient-user.model";
import { PatientsService } from "src/service/patient.service";
import { MapsAPILoader} from '@agm/core';
import * as moment from "moment";
import { NationalIdValidator } from "src/validators/nationalIdValidator";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { MirthService } from "src/service/mirth.service";
import { HttpClient } from '@angular/common/http';

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-third-party-request-appointments-new',
  templateUrl: './third-party-request-appointments-new.html',
  styleUrls: ['./third-party-request-appointments-new.css']
})
export class ThirdPartyRequestsAppointmentsNewComponent implements OnInit {
  @ViewChild('searchSearviceInput') searchSearviceInput? : ElementRef<HTMLInputElement>;
  @ViewChild('searchAddress') searchAddress? : ElementRef<HTMLInputElement>;
  public todayDate : any = moment( new Date(Date.now()) ).format('YYYY-MM-DD');
  public patientList : Array<any> = [];
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
  public appointmentRequest : any = {};

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor(
    private cd : ChangeDetectorRef,
    private autoCompleteApi: MapsAPILoader,
    private ngZone: NgZone,
    private fb : FormBuilder,
    private patientService: PatientsService,
    private route : ActivatedRoute,
    private mirthServices : MirthService,
    private http: HttpClient
  ) {

    this.route.params.subscribe({
      next : ( params : any) => {
        const id = params?.id || null;
        this.getRequest(id);
      }
    });
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
  }

  getRequest( id : any ){
    this.mirthServices.getSingleRequest( id ).subscribe({
      next : ( res : any ) => {
        if( res.request.length > 0 ){
          this.appointmentRequest = res.request[0];
          this.onSearchPatient(this.appointmentRequest.mobileNumber);
        }else{
          Swal.fire('Error', 'Request not found', 'error' );
        }
      },
      error: ( err : any ) => { Swal.fire('Error', err.error.message, 'error' ); }
    });
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

    this.patientService.getPatientSources().subscribe({
      next : ( res : any )=>{
        this.patientSources = res.result;
        this.patientSources = this.patientSources.filter( (item) => item.sourceName=='Bupa');
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
   * ON Select Service
   *******************************************************************/
  onSelectSevice( service : any ){
    service.primaryPatientId = this.selection.patient.userId;
    service.patientId = this.selection.patient.userId;
    service.patientName = this.selection.patient.firstName+' '+this.selection.patient.lastName;
    service.price = 0;
    this.selection.services.push( service );
    this.selection.isServicesConfirmed = true;
    this.isServiceConfirmed = true;
    console.log( this.selection );
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
    let vat = 0;

    if( this.selection.services.length == 0 ){
      return 0;
    }
    
    switch ( type ) {
      case 'vat':
        return Math.round(0);

      case 'final':
        return Math.round(this.getCalculation('vat', total)+total);

      default:
        break;
    }
    return 0;
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
  }

  onConfirmPatient(){
    this.selection.confirmed = true;
    this.onSelectSevice( JSON.parse(this.appointmentRequest.speciality) );
    this.lat = parseFloat(this.appointmentRequest.latitude);
    this.lng = parseFloat(this.appointmentRequest.longitude);
    this.getAddress( this.lat, this.lng);
    this.personalInfo.get('source').patchValue( this.patientSources[0].sourceId );
    this.personalInfo.get('date').patchValue( this.appointmentRequest.visitDate );
    this.personalInfo.get('time').patchValue( this.appointmentRequest.visitTime );
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
      gender : this.personalInfo.get('gender').value,
      source : this.personalInfo.get('source').value,
      request_no_bupa: this.appointmentRequest.requestNoBupa,
      adminNotes : this.personalInfo.get('adminNotes').value,
      lat : this.lat,
      lng : this.lng,
    };

    this.mirthServices.createAppointment( data ).subscribe({
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
