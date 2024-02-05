import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PatientsService } from 'src/service/patient.service';
import { MedicaltagService } from 'src/service/medicaltag.service';
import { APIResponse } from 'src/utils/app-enum';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LanguageService } from 'src/service/language.service';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { formatDate } from "@angular/common";
import { AppService } from 'src/service/app.service'
import { environment } from 'src/environments/environment'

declare var google: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public serverUrl : string = environment.domainName

  cancelHour: number = 0;
  rescheduleHour: number = 0;

  //html elemets 
  @ViewChild('search') searchElementRef: ElementRef
  @ViewChild('personalInfo') personalInfoHTML?: ElementRef<HTMLDivElement>
  @ViewChild('appointmentInfo') appointmentInfoHTML?: ElementRef<HTMLDivElement>
  @ViewChild('upcomingApp') upcomingAppHTML?: ElementRef<HTMLDivElement>
  @ViewChild('pastApp') pastAppHTML?: ElementRef<HTMLDivElement>
  @ViewChild('fileInput') fileInput: ElementRef;
  
  displayUserInfo: boolean = true
  displayAppointmentInfo: boolean = false
  displayUpcomingInfo: boolean = false
  displayPastInfo: boolean = false
  addInsuranceForm: boolean = false
  editInsuranceForm: boolean = false

  geoCoder: any;
  userId: any
  userData: any
  userDependants: any
  dependantData: any
  userLocations: any
  userAppointments: any
  userUpcomingAppointments: any
  userPastAppointments: any

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
  showAppointmentCancelationMessage: boolean = false
  showAppointmentCancelationConfimationMessage: boolean = false
  showAppointmentCancelMessage: boolean = false
  showAppointmentUpdateMessage: boolean = false
  showAppointmentAfterUpdateMessage: boolean = false
  fileUpdatedSuccessfully: boolean = false
  fileNotUpdatedSuccessfully: boolean = false
  currentAppointmentFilesToggle: boolean = false

  displayRescheduleAppointment: boolean = false
  reviewToggle: boolean = false

  // forms
  public addDependantForm : FormGroup
  public updateDependantForm : FormGroup
  public addressForm : FormGroup

  //medicalTags
  medicalTags: any = []
  medicalTagListEn: any = []
  medicalTagListAr: any = []
  medicalTagSettingsEn: IDropdownSettings = {}
  medicalTagSettingsAr: IDropdownSettings = {}
  userMedicalTags: any = []
  modelMedicalTag: any = []

  selectedAppointment: any = {}
  allCurrentAppointmentData: any = {}

  currentAppointmentFiles: any = []

   //calendar
   currentDate: Date = new Date();
   currentWeek: Date[] = [];
   currentMonthAndYear: string = "";
 
   selectedDate: Date | null = null;
 
   serviceProvidersServices: any;
 
   //date & time to store in local storage
   preferredTime: any;
   preferredDate: any;
 
   weekDays: any = [];
 
   private fetchedData: any = {
     serviceProviders: [],
     appointments: [],
   };
 
  timeSlots: string[] = []; // Array to hold time slots

  questionnaireForm: FormGroup;

  stars: boolean[][] = [];

  accountType:any="";


  insuranceForm: FormGroup;
  updateInsuranceForm : FormGroup
  dataFields = [
    { name: 'PolicyNumber', placeholder: 'Enter Policy Number', validators: [Validators.required, Validators.maxLength(250)] },
    { name: 'InsuranceCompanyName', placeholder: 'Enter Insurance Company Name', validators: [Validators.required, Validators.maxLength(250)] },
    { name: 'InsuranceCompanyNameAr', placeholder: 'Enter Insurance Company Name (Arabic)', validators: [Validators.required, Validators.maxLength(250)] },
    { name: 'ClassName', placeholder: 'Enter Class Name', validators: [Validators.required] },
    { name: 'Gender', placeholder: 'Select Gender', validators: [Validators.required] },
    { name: 'DeductibleRate', placeholder: 'Enter Deductible Rate', validators: [Validators.required] },
    { name: 'MaxLimit', placeholder: 'Enter Max Limit', validators: [Validators.required] },
    { name: 'BeneficiaryType', placeholder: 'Select Beneficiary Type', validators: [Validators.required] },
    { name: 'BeneficiaryTypeId', placeholder: 'Enter Beneficiary Type Id', validators: [Validators.required] },
    { name: 'BeneficiaryNumber', placeholder: 'Enter Beneficiary Number', validators: [Validators.required, Validators.maxLength(50)] },
    { name: 'IdentityNumber', placeholder: 'Enter Identity Number', validators: [Validators.required] },
    { name: 'BeneficiaryName', placeholder: 'Enter Beneficiary Name', validators: [Validators.required, Validators.maxLength(250)] },
    { name: 'InceptionDate', placeholder: 'Enter Inception Date', validators: [Validators.required] },
    { name: 'PolicyHolder', placeholder: 'Enter Policy Holder', validators: [Validators.required, Validators.maxLength(250)] },
    { name: 'InsurancePoIicyExpiryDate', placeholder: 'Enter Insurance Policy Expiry Date', validators: [Validators.required] },
  ];

  currentInsuranceUser: any = {}

  displayPatientNotes: boolean = false;

  constructor(
    private renderer: Renderer2,
    private fb : FormBuilder,
    private _patientService: PatientsService,
    private _medicalTagService: MedicaltagService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    public languageService: LanguageService,
    private _b2c: BusinessToCustomerSchedulingService,
    private _appService: AppService ) { 

      //this will be used for dropdown settings
      this.medicalTagSettingsEn = {
        idField: 'id',
        textField: 'title',
        allowSearchFilter: false,
        enableCheckAll: false
      }

      //this will be used for dropdown settings
      this.medicalTagSettingsAr = {
        idField: 'id',
        textField: 'title_arabic',
        allowSearchFilter: false,
        enableCheckAll: false
      }

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
        medical_history: ['']

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

      const formGroupConfig = {};

      this.dataFields.forEach(field => {
        formGroupConfig[field.name] = ['', field.validators];
      });

      this.insuranceForm = this.fb.group(formGroupConfig);
      this.updateInsuranceForm = this.fb.group(formGroupConfig);

  }

  ngOnInit(): void {

    this.fetchHours();
    this.userId = localStorage.getItem("THSUserId")

    if(this.userId !== null) {

      let data = {

        user_id: this.userId
  
      }

      //fetch all medical tags stored by operations
      this._medicalTagService.getTagList().subscribe({
    
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {
            
            this.medicalTags = res.data
            
          }
          
        },
        error: ( err: any ) => {
        
        }
    
      })

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
            
            this.userUpcomingAppointments = this.userAppointments.filter(app => {
              const appointmentDate = new Date(app.serviceDate);
              const appointmentTime = app.serviceTime ? new Date(`1970-01-01T${app.serviceTime}Z`) : new Date(0);
          
              // Combine date and time to get the full appointment date and time
              const appointmentDateTime = new Date(appointmentDate.getTime() + appointmentTime.getTime());
          
              // Get current date and time
              const currentDate = new Date();
          
              // Check if appointment date and time is greater than current date and time
              if (appointmentDateTime > currentDate) {
                  // If the appointment date and time is in the future, it's an upcoming appointment
                  return true;
              }
          
              // Exclude appointments with status 2 (assuming 2 means completed/cancelled)
              return false;
          });
          

            this.userPastAppointments = this.userAppointments.filter(app => {

              return new Date(app.serviceDate) < new Date() || app.appointmentStatus === 2

            })

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

    const currentLanguage = this.languageService.getCurrentLanguage();

    // Initialize the form
    this.questionnaireForm = this.fb.group({
      questions: this.fb.array([]),
    });

    // Add questions based on language
    this.addQuestionsBasedOnLanguage(currentLanguage);

  }

  private addQuestionsBasedOnLanguage(currentLanguage: string): void {
    if (currentLanguage === 'en') {
      this.addQuestion('The service was provided and the appointment was scheduled within an appropriate period of time');
      this.addQuestion('Appointment duration/service delivery date');
      this.addQuestion('The specialist is qualified');
      this.addQuestion('The specialist treatment');
    }

    if (currentLanguage === 'ar') {
      this.addQuestion('تم تقديم الخدمة وجدولة الموعد خلال مدة زمنية مناسبة');
      this.addQuestion('مدة الموعد / موعد تقديم الخدمة');
      this.addQuestion('الأخصائي متمكن');
      this.addQuestion('تعامل الأخصائي');
    }
  }

  //the following function will display users or appointments block
  displayBlock(blockTitle) {

    if( blockTitle === 'userInfo') {

      //enable display on div blocks
      this.displayUserInfo = true
      this.displayAppointmentInfo = false
      this.displayUpcomingInfo = false
      this.displayPastInfo = false

      this.renderer.addClass(this.personalInfoHTML.nativeElement, 'item-selected')
      this.renderer.removeClass(this.appointmentInfoHTML.nativeElement, 'item-selected')
      this.renderer.removeClass(this.upcomingAppHTML.nativeElement, 'item-selected')
      this.renderer.removeClass(this.pastAppHTML.nativeElement, 'item-selected')

    }

    if( blockTitle === 'appointmentInfo') {

      //enable display on div blocks
      this.displayUserInfo = false
      this.displayAppointmentInfo = true
      this.displayUpcomingInfo = true
      this.displayPastInfo = false

      this.renderer.removeClass(this.personalInfoHTML.nativeElement, 'item-selected')
      this.renderer.addClass(this.appointmentInfoHTML.nativeElement, 'item-selected')
      this.renderer.addClass(this.upcomingAppHTML.nativeElement, 'item-selected')
      this.renderer.removeClass(this.pastAppHTML.nativeElement, 'item-selected')

    }

    if( blockTitle === 'upcomingInfo') {

      //enable display on div blocks
      this.displayUserInfo = false
      this.displayAppointmentInfo = true
      this.displayUpcomingInfo = true
      this.displayPastInfo = false

      this.renderer.removeClass(this.personalInfoHTML.nativeElement, 'item-selected')
      this.renderer.addClass(this.appointmentInfoHTML.nativeElement, 'item-selected')
      this.renderer.addClass(this.upcomingAppHTML.nativeElement, 'item-selected')
      this.renderer.removeClass(this.pastAppHTML.nativeElement, 'item-selected')

    }

    if( blockTitle === 'pastInfo') {

      //enable display on div blocks
      this.displayUserInfo = false
      this.displayAppointmentInfo = true
      this.displayUpcomingInfo = false
      this.displayPastInfo = true

      this.renderer.removeClass(this.personalInfoHTML.nativeElement, 'item-selected')
      this.renderer.addClass(this.appointmentInfoHTML.nativeElement, 'item-selected')
      this.renderer.removeClass(this.upcomingAppHTML.nativeElement, 'item-selected')
      this.renderer.addClass(this.pastAppHTML.nativeElement, 'item-selected')

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
          medical_history: this.userMedicalTags.toString()
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

    }

  }

  handleCancelClick(): void {

    
    this.showUserAlreadyExist = false
    this.showErrorCreatingDependant = false
    this.showErrorUpdatingDependant = false
    this.showErrorDeletingDependant = false
    this.showErrorUpdatingAddress = false
    this.showSuccessUpdatingDependant = false
    this.showAppointmentCancelationMessage = false
    this.showAppointmentCancelationConfimationMessage = false
    this.showAppointmentCancelMessage = false
    this.showAppointmentUpdateMessage = false
    this.showAppointmentAfterUpdateMessage = false
    this.fileUpdatedSuccessfully = false
    this.fileNotUpdatedSuccessfully = false
    this.currentAppointmentFilesToggle = false

    this.selectedAppointment = {}

  }

  //alert continue button handler
  handleContinueClick(): void {

    this.showUserAlreadyExist = false
    this.showErrorCreatingDependant = false
    this.showErrorUpdatingDependant = false
    this.showErrorDeletingDependant = false
    this.showErrorUpdatingAddress = false
    this.showSuccessUpdatingDependant = false
    this.showAppointmentCancelationMessage = false
    this.showAppointmentCancelationConfimationMessage = false
    this.showAppointmentCancelMessage = false
    this.showAppointmentUpdateMessage = false
    this.showAppointmentAfterUpdateMessage = false
    this.fileUpdatedSuccessfully = false
    this.fileNotUpdatedSuccessfully = false
    this.currentAppointmentFilesToggle = false

  }

  //this will show dependent details popup
  showDependant(index) {

    this.userMedicalTags = []
    this.modelMedicalTag = []
    this.dependantData = this.userDependants[index]
    console.log(this.dependantData) //
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

    this.medicalTagListEn = []
    this.medicalTagListAr = []

    if(this.dependantData.medical_history === '') {

      this.dependantData.medical_history = null

    }

    if(!this.dependantData.medical_history) {
     
      this.userMedicalTags = []
      this.modelMedicalTag = []
      this.medicalTagListAr = this.medicalTags
      this.medicalTagListEn = this.medicalTags

    } else {

      this.userMedicalTags = this.dependantData.medical_history.split(",")
      
      let tempMedicalTags = this.userMedicalTags
      tempMedicalTags.forEach(tag => {

        let checkTag = this.medicalTags.filter(el => {

          return el.id === Number(tag)

        }) 

        if(checkTag.length>0) {

          this.modelMedicalTag.push(checkTag[0])
          this.medicalTagListAr = this.medicalTags
          this.medicalTagListEn = this.medicalTags
        }
        

      })

    }

    this.showDependantDetails = true

  }

  showUser() {
    
    this.userMedicalTags = []
    this.modelMedicalTag = []
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

    if(!this.dependantData.medical_history) {

      this.userMedicalTags = []
      this.modelMedicalTag = []
      this.medicalTagListAr = this.medicalTags
      this.medicalTagListEn = this.medicalTags

    } else {

      this.userMedicalTags = this.dependantData.medical_history.split(",")
      
      let tempMedicalTags = this.userMedicalTags
      tempMedicalTags.forEach(tag => {

        let checkTag = this.medicalTags.filter(el => {

          return el.id === Number(tag)

        }) 

        if(checkTag.length>0) {

          this.modelMedicalTag.push(checkTag[0])
          this.medicalTagListAr = this.medicalTags
          this.medicalTagListEn = this.medicalTags
        }
        

      })

    }

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
  updateDependant(type) {

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
            medical_history: this.userMedicalTags.toString()
            //relationship_type: this.updateDependantForm.get('relationship_type').value
  
          }
  
          this._patientService.updateDependent(data).subscribe({
  
            next : ( res : any ) => {
  
              //in case of success the api returns 0 as a status code
              if( res.status === APIResponse.Success ) {

                if(type ==='dependant') {

                  let index = this.userDependants.findIndex(el => el.id === this.dependantData.id) 
                  if( index > -1){
                  
                    this.userDependants[index].medical_history = this.userMedicalTags.toString()
  
                  }
  
                }

                if(type ==='user') {

                  this.userData.medical_history = this.userMedicalTags.toString()

                }

                this.showDependantDetails = false
                this.showUserDetails = false
  
                this.dependantData = {}
                this.updateDependantForm.reset()
                this.userMedicalTags = []
                this.modelMedicalTag = []
  
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

  //the following function will be executed when service provider will be selected
  onTagSelect(item: any) {

    let id = item.id
    this.userMedicalTags.push(id)


  }

  //the following function will be executed when service provider will be deselected
  onTagDeSelect(item: any) {

    this.userMedicalTags = this.userMedicalTags.filter(i => Number(i) !== item.id)

  }

  //to cancel an appointment
  cancelAppointmentConfirmation(appointment: any) {

    this.selectedAppointment = appointment

    //first we will check if there are 24 hours remnaining in appointment
    
    // Combine serviceDate and serviceTime into a single string
    const serviceDateTimeString = `${appointment.serviceDate}T${appointment.serviceTime}`;
    
    const serviceDateTime = new Date(serviceDateTimeString + 'Z') as any;
    const currentDateTime = new Date() as any;
    
    // Calculate the time difference in milliseconds
    let timeDifference = serviceDateTime - currentDateTime;
    
    // Calculate the time difference in hours
    let hoursDifference = timeDifference / (1000 * 60 * 60);

    if(hoursDifference < this.cancelHour) {

      //we will tell user that appointment cannot be canceled
      this.showAppointmentCancelationMessage = true

    } else {

      //if there are more than 24 hours then we will ask for confirmation message
       this.showAppointmentCancelationConfimationMessage = true

    }

  }

  //cancelUserAppointment
  cancelUserAppointment() {

    let data = {

      appointment_id: this.selectedAppointment.appointmentId

    }

    //now we will cancel user appointment
    this._b2c.cancelB2CAppointment(data).subscribe({
              
      next : ( ress : any ) => {

        //in case of success the api returns 0 as a status code
        if( ress.status === APIResponse.Success) {

          this.userUpcomingAppointments = this.userUpcomingAppointments.filter(app => {

            return app.appointmentId !== this.selectedAppointment.appointmentId

          })

          this.selectedAppointment = {}
          this.showAppointmentCancelMessage = true

        }
        
      },
      error: ( err: any ) => {
        
        console.log(err)
        
      }
  
    }) 

  }

  updateAppointmentConfirmation(appointment: any) {

    this.selectedAppointment = appointment;

    // Combine serviceDate and serviceTime into a single string
    const serviceDateTimeString = `${appointment.serviceDate}T${appointment.serviceTime}`;
    
    const serviceDateTime = new Date(serviceDateTimeString);
    console.log(serviceDateTime);
    const currentDateTime = new Date();
    console.log(currentDateTime);
    
    // Calculate the time difference in milliseconds
    let timeDifference = serviceDateTime.getTime() - currentDateTime.getTime();
    
    // Calculate the time difference in hours
    let hoursDifference = timeDifference / (1000 * 60 * 60);
    console.log(hoursDifference);

    console.log(this.rescheduleHour);
    if (hoursDifference < this.rescheduleHour) {
        // Tell the user that the appointment cannot be updated
        this.showAppointmentUpdateMessage = true;
    }else {

      //if there are more than 24 hours then we will ask for confirmation message
      //go through the process of appointment re-scheduling
      //first we will fetch all the sub services and related data for the appointment
      
      let data = {

        appointment_id: this.selectedAppointment.appointmentId
  
      }

      this._b2c.getAppointmentData(data).subscribe({
                
        next : ( ress : any ) => {

          //in case of success the api returns 0 as a status code
          if( ress.status === APIResponse.Success) {

            this.allCurrentAppointmentData = ress.data
            
            for (let hour = 12; hour <= 23; hour++) {
              this.timeSlots.push(this.formatTimeSlot(hour));
            }
            this.calculateTimeSlots();

            let sa = {
              user_id: this.userId,
            };

            
            this._b2c.getSocketData(sa).subscribe({

              next: (res: any) => {
                //in case of success the api returns 0 as a status code
                if (res.status === APIResponse.Success) {
                  //after fetching all service providers we will now check if their gender match with selected user or not
                  this.fetchedData = res.data;
                  
                  
                    // ... handle the received data here
                    let services =  this.allCurrentAppointmentData.map((item) => item.serviceId);

                    let filteredServices = [];
      
                    this.allCurrentAppointmentData.forEach((cartItem) => {
                      let temp = services.filter((service) => {
                        return Number(service) === cartItem.serviceId;
                      });
      
                      if (temp.length > 0) {
                        filteredServices.push({
                          id:temp[0]
                        });
                      }
                    });

                    let branch = localStorage.getItem("THSBranch") || 1;
                    
                    if(branch === undefined || branch === 'undefined') {

                      branch = 1;
                    }

                    let spData = {
                      branch: branch,
                      services: filteredServices,
                      patients: this.userDependants,
                    };
      
                    this._b2c.checkServiceProviderEligibilty(spData).subscribe({
                      next: (ress: any) => {
                        //in case of success the api returns 0 as a status code
                        if (ress.status === APIResponse.Success) {
                          //after fetching all service providers we will now check if their gender match with selected user or not
                          this.serviceProvidersServices = ress.data;

                          for (let key in this.serviceProvidersServices) {
                            this.serviceProvidersServices[key].forEach((s) => {
                              s.days = JSON.parse(s.days);
                            });
                          }
      
                          this.selectCurrentDay();
                          this.generateWeek();
                          this.updateCurrentMonthAndYear();
                          this.displayRescheduleAppointment = true

                        } else {
                        }
                      },
                      error: (err: any) => {
                        console.log(err);
                      },
                    });
                                     
                }

              },
              error: (err: any) => {

                console.log(err);

              },

            });
            
          }
          
        },
        error: ( err: any ) => {
          
          console.log(err)
          
        }
    
      }) 

    }

  }

  selectCurrentDay() {
    this.selectDate(new Date());
  }

  generateWeek() {
    this.currentWeek = [];
    const currentDay = this.currentDate.getDay();

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const currentDayIndex = this.currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Reorder the days of the week to start from the current day.
    this.weekDays = [
      ...daysOfWeek.slice(currentDayIndex),
      ...daysOfWeek.slice(0, currentDayIndex),
    ];

    for (let i = 0; i < 7; i++) {
      const day = new Date(this.currentDate);
      day.setDate(this.currentDate.getDate() + i);
      this.currentWeek.push(day);
    }
  }

  updateCurrentMonthAndYear() {
    this.currentMonthAndYear = formatDate(this.currentDate, "MMMM y", "en-US");
  }

  goToNextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeek();
    this.updateCurrentMonthAndYear();
  }

  goToPreviousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeek();
    this.updateCurrentMonthAndYear();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.timeSlots = [];
    this.calculateTimeSlots();
  }

  isPreviousDisabled(): boolean {
    const today = new Date();
    const firstDateOfWeek = this.currentWeek[0];

    return firstDateOfWeek <= today;
  }

  formatTimeSlot(hour: number): string {
    const amPm = hour >= 12 ? "pm" : "am";

    const formattedHour = hour > 12 ? hour - 12 : hour;

    return `${formattedHour === 0 ? 12 : formattedHour}:00${amPm}`;
  }

  //this function will calculate time slots if date is selected
  calculateTimeSlots() {

    this.timeSlots = [];
    // Assuming fetchedData.appointments contains the list of appointments
    if (!this.selectedDate || this.allCurrentAppointmentData.length === 0) {
      // No selected date or no services in cart, return empty time slots
      this.timeSlots = [];
      return;
    }

    this.allCurrentAppointmentData.forEach((data) => {
      
      this.timeSlots = [];

      data["timeSlots"] = []
      
      const formattedSelectedDate = this.formatSelectedDate(this.selectedDate);

      this.setPreferredDate(formattedSelectedDate);

      // Create a list to store time slots to be removed
      const timeSlotsToRemove = [];

      const serviceIds = [data.serviceId];

      // Get all service providers for the selected services
      let sps = serviceIds.map((serviceId) => {
        return this.serviceProvidersServices[serviceId].filter(
          (sp) => sp.service_id === serviceId
        );
      });

        // Flatten the array of arrays into a single array of service providers
        const flattenedProviders = [].concat(...sps);
        sps = flattenedProviders;

        if(sps.length>0){

          let sd = this.formatSelectedDate(this.selectedDate).toString();

          let day = this.selectedDate.toISOString();
          // Create an array to map the day index to its name
          const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
  
          // Create a new Date object from the selected date
          const dateObject = new Date(day);
          // Get the day index (0 for Sunday, 1 for Monday, etc.)
          const dayIndex = dateObject.getDay();
  
          // Get the day name from the dayNames array using the day index
          const dayName = dayNames[dayIndex].toLowerCase();
          // Initialize a variable to store the minimum time
          let minTime = undefined;
          let maxTime = undefined;
  
          // Iterate through the service providers again to find the minimum time for Tuesday
          sps.forEach((s) => {
            // Extract the Tuesday availability from the service provider
            const dayAvailability = s.days[dayName];
  
            // Check if the availability is defined
            if (dayAvailability) {
              // Extract the start time for Tuesday
              const startTime = new Date(
                `1970-01-01T${dayAvailability.start_time}`
              );
  
              // Convert end time to a Date object
              const endTime = new Date(`1970-01-01T${dayAvailability.end_time}`);
  
              // If minTime is undefined or the current start time is earlier than minTime
              if (!minTime || startTime < minTime) {
                minTime = startTime;
              }
  
              if (!maxTime || endTime > maxTime) {
                maxTime = endTime;
              }
            }
          });
  
          this.fetchedData.appointments = this.fetchedData.appointments.filter(
            (app) => {
              return app.serviceAssigneeId !== null;
            }
          );
          sps = sps.filter((s) => {
            return s[dayName] === 1;
          });

          let uniqueScheduledTimes = this.fetchedData.appointments
            .filter((app) => {
              // Check if app.serviceAssigneeId is not null and there's a matching sp in sps
              return (
                sps.some(
                  (sp) => Number(sp.user_id) === Number(app.serviceAssigneeId)
                ) && app.serviceDate === sd
              );
            })
            .map((app) => {
              // Convert the database time format (e.g., "2023-09-04T19:00:00.000Z") to time slots format (e.g., "4:00pm")
              const dbTime = app.serviceTime;
  
              const [hours, minutes] = dbTime.split(":");
              const ampm = hours >= 12 ? "pm" : "am";
              const formattedTime = `${hours % 12 || 12}:${minutes}${ampm}`;
              return formattedTime;
            });
  
          const timeSlotCounts = {};
          uniqueScheduledTimes.forEach((time) => {
            timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
          });
          // Filter the time slots where all service providers are booked
          const filteredTimeSlots = Object.keys(timeSlotCounts).filter((time) => {
            return timeSlotCounts[time] === sps.length;
          });
  
          // Function to check if a time slot is available
          const isTimeSlotAvailable = (timeSlot: string) => {
            return !filteredTimeSlots.includes(timeSlot);
          };
  
          const currentDate = new Date();
          const currentHour = currentDate.getHours();
          const currentDateString = currentDate.toISOString().slice(0, 10); // Get current date in "yyyy-mm-dd" format

          const selectedDate = this.formatSelectedDate(this.selectedDate);
          
          // Calculate 3 hours later from the current time
          const threeHoursLater = new Date(
            currentDate.getTime() + 3 * 60 * 60 * 1000
          );
          const threeHoursLaterHour = threeHoursLater.getHours();
  
          // Calculate 3 hours later from the current time
  
          // Convert minTime and maxTime to hours (as integers)
          const minHour = minTime.getHours();
          const maxHour = maxTime.getHours();
          for (let hour = minHour; hour <= maxHour; hour++) {
            const timeSlot = this.formatTimeSlot(hour);
            // Check if the selectedDate is today
            if (selectedDate === currentDateString) {
              // Calculate the hour 3 hours later for the current day
              const threeHoursLaterCurrent = new Date(
                currentDate.getTime() + 4 * 60 * 60 * 1000
              );
  
              const threeHoursLaterCurrentHour =
                threeHoursLaterCurrent.getHours();
  
              if (hour < threeHoursLaterCurrentHour) {
                continue; // Skip past time slots for today
              } else {
                this.timeSlots.push(timeSlot);
              }
            } else {
              // For future dates, include all time slots
              if (isTimeSlotAvailable(timeSlot)) {
                this.timeSlots.push(timeSlot);
              }
            }
          }
  
          // Remove the time slots that need to be removed
          this.timeSlots = this.timeSlots.filter(
            (slot) => !timeSlotsToRemove.includes(slot)
          );
  
          if(sps.length  === 0) { 
            data["timeSlots"] = []

          }
          else {

            data["timeSlots"] = this.timeSlots;

          }

        }
      
    });

    //  }
  }

  findAllCommonServiceProviders() {

    if (this.allCurrentAppointmentData.length <= 1) {
      // If there's only one service or no services, return an empty array
      return [];
    }

    const serviceIds = this.allCurrentAppointmentData.map((item) => item.serviceId);

    // Find the providers for the first service in the cart
    const providersOfFirstService =
      this.serviceProvidersServices[serviceIds[0]];

    if (!providersOfFirstService) {
      return [];
    }

    // Check if each provider of the first service provides all other services in the cart
    const commonProviders = providersOfFirstService.filter((provider) => {
      return serviceIds.every((serviceId) => {
        const providersForService = this.serviceProvidersServices[serviceId];

        return (
          providersForService &&
          providersForService.some((p) => p.user_id === provider.user_id)
        );
      });
    });

    return commonProviders.map((provider) => provider.user_id);
  }

  isTimeSlotBooked(providerIds: string[], timeSlot: string) {
    return this.fetchedData.appointments.some((appointment) => {
      return (
        providerIds.includes(appointment.serviceAssigneeId) &&
        appointment.serviceTime === timeSlot
      );
    });
  }

  // Assuming selectedDate is a Date object
  formatSelectedDate(selectedDate: Date) {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  setPreferredTimeSlot(time) {
    this.preferredTime = time;
  }

  setPreferredDate(date) {
    this.preferredDate = date;
  }

  setCartDataTimeValue(time) {

    this.preferredTime = time;

  }

  setCartDataDateValue(date) {

    this.preferredDate = date;

  }

  getDate(date1, date2) {

    let expression = false;

    let x = new Date(date1);
  
    if (x?.toDateString() === date2) {
  
      expression = true;
  
    }

    return expression;
  
  }

  updateUserAppointment() {

    let passUsersData = this.userDependants
    passUsersData.unshift(this.userData);

    this.allCurrentAppointmentData.forEach(app => {

      let getUser = passUsersData.filter(u => {

        return u.id === app.patientId

      })

      app['user'] = getUser[0]

    })

    const formattedSelectedDate = this.formatSelectedDate(this.selectedDate);

    this.preferredDate = formattedSelectedDate;

    let data = {

      appointment_id: this.selectedAppointment.appointmentId,
      preferredTime: this.preferredTime,
      preferredDate: this.preferredDate.toString(),
      allAppointmentData: [this.allCurrentAppointmentData],
      userData: passUsersData,
      branch_id: this.selectedAppointment.serviceProviderId,
    

    }

    //now we will cancel user appointment
    this._b2c.updateB2CAppointment(data).subscribe({
              
      next : ( ress : any ) => {

        //in case of success the api returns 0 as a status code
        if( ress.status === APIResponse.Success) {

          this.displayRescheduleAppointment = false
          this.allCurrentAppointmentData = {}
          this.preferredDate = null
          this.preferredTime = null
          this.selectedAppointment = {}
          this.showAppointmentAfterUpdateMessage = true

        }
        
      },
      error: ( err: any ) => {
        
        console.log(err)
        
      }
  
    }) 

  }

  cancelUpdateAppointment() {

    this.handleCancelClick()

  }

  openFileInput() {
    // Trigger click on the hidden file input
    this.fileInput.nativeElement.click();

  }

  addAppointmentFile(event: any, appointment: any) {
    this.selectedAppointment = appointment;

    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      if (fileSizeInMB <= 4) {

        // Display confirmation dialog before proceeding with upload
        const userConfirmation = this.confirmUpload();

        userConfirmation.then((confirmed) => {
          if (!confirmed) {
            // User cancelled the upload
            console.log('User cancelled file upload');
            return;
          }

          // Continue with file upload logic
          this._appService.fileUploadMedicalRecord(selectedFile).subscribe((response: any) => {

            if (response.status == APIResponse.Success) {

              let result = response.message;
              console.log(result);
              let data = {
                appointment_id: appointment.appointmentId,
                file_url: result,
                file_name: selectedFile.name,
                added_by: 'patient'
              };

              this._b2c.medicalRecords(data).subscribe({
                next: (ress: any) => {
                  if (ress.status === APIResponse.Success) {
                    this.selectedAppointment = {};
                    this.fileUpdatedSuccessfully = true;
                  }
                },
                error: (err: any) => {
                  console.log(err);
                  this.fileNotUpdatedSuccessfully = true;
                }
              });

            }

          });

        });

      } else {
        alert('File size exceeds the limit of 4MB.');
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  confirmUpload(): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = window.confirm('Are you sure you want to upload the selected file?');

      resolve(confirmed);
    });
  }

  viewAppointmentFiles(appointment) {

    let data = {

      appointment_id: appointment.appointmentId

    }

    //now we will cancel user appointment
    this._b2c.getMedicalRecords(data).subscribe({
              
      next : ( ress : any ) => {

        //in case of success the api returns 0 as a status code
        if( ress.status === APIResponse.Success) {

          this.currentAppointmentFiles = ress.data
          console.log(this.currentAppointmentFiles);
          this.currentAppointmentFilesToggle = true

          this.selectedAppointment = {}
      
        }
        
      },
      error: ( err: any ) => {
        
        console.log(err)
        
      }
  
    }) 

  }

  closeFiles() {

    this.currentAppointmentFiles = []
    this.currentAppointmentFilesToggle = false

  }

  get questions(): FormArray {
    return this.questionnaireForm.get('questions') as FormArray;
  }

  addQuestion(questionText: string): void {
    const questionGroup = this.fb.group({
      text: questionText,
      rating: [null, Validators.required],
    });

    this.questions.push(questionGroup);
    this.stars.push(Array(5).fill(false));
  }

  onSubmit(): void {
  
    if (this.questionnaireForm.valid) {
  
      let data = {

        appointment_data: JSON.stringify(this.questionnaireForm.value),
        appointment_id: this.selectedAppointment.appointmentId
  
      }
  
      //now we will cancel user appointment
      this._b2c.appointmentReview(data).subscribe({
                
        next : ( ress : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( ress.status === APIResponse.Success) {
            
            let index =  this.userPastAppointments.findIndex(el => el.appointmentId === this.selectedAppointment.appointmentId) 

            if(index > -1) {

              this.userPastAppointments[index].review = this.questionnaireForm.value

            }
            

            this.selectedAppointment = {}
            this.reviewToggle = false
  
          }
          
        },
        error: ( err: any ) => {
          
          console.log(err)
          
        }
    
      }) 
  
    } else {
  
      // Mark the form and controls as dirty to trigger error messages
      this.questionnaireForm.markAllAsTouched();
  
    }
  
  }

  rate(questionIndex: number, starIndex: number): void {
    const ratingControl = this.questions.at(questionIndex).get('rating') as FormControl;
    ratingControl.setValue(starIndex + 1);

    // Update stars array to reflect the selected rating
    this.stars[questionIndex] = Array(5).fill(false).map((_, i) => i <= starIndex);
  }

  openReview(appointment) {

    this.selectedAppointment = appointment
    this.reviewToggle = true
  
  }

  closeReviewPopup() {

    this.reviewToggle = false
    this.selectedAppointment = {}

  }

  //submit insurance form
  submitInsuranceForm() {

    if (this.insuranceForm.valid) {

        let data = {
          user_id: this.currentInsuranceUser.id,
          insurance_data: JSON.stringify(this.insuranceForm.value)
        }
           //first we will get user profile information
           this._patientService.submitInsuranceInformation(data).subscribe({
    
            next : ( res : any ) => {
      
              //in case of success the api returns 0 as a status code
              if( res.status === APIResponse.Success ) {
                
                    
                if(this.accountType === 'user') {

                  this.userData.insurance_data = this.insuranceForm.value

                }

                if(this.accountType === 'dependant') {

                  let index = this.userDependants.findIndex(el => el.id === this.currentInsuranceUser.id) 
                  if( index > -1){
                  
                    this.userDependants[index].insurance_data = this.insuranceForm.value
    
                  }
    
                }

                this.currentInsuranceUser = {};
                this.insuranceForm.reset();
                this.addInsuranceForm = false;
                this.showUserDetails = false;
                this.showDependantDetails = false;
                this.accountType = "";
        
              } else {
    
                this.currentInsuranceUser = {};
                this.insuranceForm.reset();
                this.addInsuranceForm = false;
                this.showUserDetails = false;
                this.showDependantDetails = false;
                this.accountType = "";

              }
          
            },
            error: ( err: any ) => {
    
              console.log(err)
            }
        
          })


    } else {
       // Display error messages
       if (this.insuranceForm.get('PolicyNumber').invalid) {
      
        this.insuranceForm.get('PolicyNumber').setErrors({ invalidPolicyNumber: true })

      }

      if (this.insuranceForm.get('InsuranceCompanyName').invalid) {
      
        this.insuranceForm.get('InsuranceCompanyName').setErrors({ invalidInsuranceCompanyName: true })

      }

      
      if (this.insuranceForm.get('InsuranceCompanyNameAr').invalid) {
      
        this.insuranceForm.get('InsuranceCompanyNameAr').setErrors({ invalidInsuranceCompanyNameAr: true })

      }

      if (this.insuranceForm.get('ClassName').invalid) {
      
        this.insuranceForm.get('ClassName').setErrors({ invalidClassName: true })

      }

      if (this.insuranceForm.get('Gender').invalid) {
      
        this.insuranceForm.get('Gender').setErrors({ invalidGender: true })

      }

      if (this.insuranceForm.get('DeductibleRate').invalid) {
      
        this.insuranceForm.get('DeductibleRate').setErrors({ invalidDeductibleRate: true })

      }

      if (this.insuranceForm.get('MaxLimit').invalid) {
      
        this.insuranceForm.get('MaxLimit').setErrors({ invalidMaxLimit: true })

      }

      if (this.insuranceForm.get('BeneficiaryType').invalid) {
      
        this.insuranceForm.get('BeneficiaryType').setErrors({ invalidBeneficiaryType: true })

      }

      if (this.insuranceForm.get('BeneficiaryTypeId').invalid) {
      
        this.insuranceForm.get('BeneficiaryTypeId').setErrors({ invalidBeneficiaryTypeId: true })

      }

      if (this.insuranceForm.get('BeneficiaryNumber').invalid) {
      
        this.insuranceForm.get('BeneficiaryNumber').setErrors({ invalidBeneficiaryNumber: true })
        
      }

      if (this.insuranceForm.get('IdentityNumber').invalid) {
      
        this.insuranceForm.get('IdentityNumber').setErrors({ invalidIdentityNumber: true })
        
      }

      if (this.insuranceForm.get('InceptionDate').invalid) {
      
        this.insuranceForm.get('InceptionDate').setErrors({ invalidInceptionDate: true })
        
      }

      if (this.insuranceForm.get('PolicyHolder').invalid) {
      
        this.insuranceForm.get('PolicyHolder').setErrors({ invalidPolicyHolder: true })
        
      }

      if (this.insuranceForm.get('InsurancePoIicyExpiryDate').invalid) {
      
        this.insuranceForm.get('InsurancePoIicyExpiryDate').setErrors({ invalidInsurancePoIicyExpiryDate: true })
        
      }

    }

  }

   //submit insurance form
   submitInsuranceFormUpdate() {

    if (this.updateInsuranceForm.valid) {

        let data = {
          user_id: this.currentInsuranceUser.id,
          insurance_data: JSON.stringify(this.updateInsuranceForm.value)
        }
           //first we will get user profile information
           this._patientService.submitInsuranceInformation(data).subscribe({
    
            next : ( res : any ) => {
      
              //in case of success the api returns 0 as a status code
              if( res.status === APIResponse.Success ) {
                
                    
                if(this.accountType === 'user') {

                  this.userData.insurance_data = this.updateInsuranceForm.value

                }

                if(this.accountType === 'dependant') {

                  let index = this.userDependants.findIndex(el => el.id === this.currentInsuranceUser.id) 
                  if( index > -1){
                  
                    this.userDependants[index].insurance_data = this.updateInsuranceForm.value
    
                  }
    
                }

                this.currentInsuranceUser = {};
                this.updateInsuranceForm.reset();
                this.editInsuranceForm = false;
                this.showUserDetails = false;
                this.showDependantDetails = false;
                this.accountType = "";
        
              } else {
    
                this.currentInsuranceUser = {};
                this.updateInsuranceForm.reset();
                this.editInsuranceForm = false;
                this.showUserDetails = false;
                this.showDependantDetails = false;
                this.accountType = "";

              }
          
            },
            error: ( err: any ) => {
    
              console.log(err)
            }
        
          })


    } else {
       // Display error messages
       if (this.updateInsuranceForm.get('PolicyNumber').invalid) {
      
        this.updateInsuranceForm.get('PolicyNumber').setErrors({ invalidPolicyNumber: true })

      }

      if (this.updateInsuranceForm.get('InsuranceCompanyName').invalid) {
      
        this.updateInsuranceForm.get('InsuranceCompanyName').setErrors({ invalidInsuranceCompanyName: true })

      }

      
      if (this.updateInsuranceForm.get('InsuranceCompanyNameAr').invalid) {
      
        this.updateInsuranceForm.get('InsuranceCompanyNameAr').setErrors({ invalidInsuranceCompanyNameAr: true })

      }

      if (this.updateInsuranceForm.get('ClassName').invalid) {
      
        this.updateInsuranceForm.get('ClassName').setErrors({ invalidClassName: true })

      }

      if (this.updateInsuranceForm.get('Gender').invalid) {
      
        this.updateInsuranceForm.get('Gender').setErrors({ invalidGender: true })

      }

      if (this.updateInsuranceForm.get('DeductibleRate').invalid) {
      
        this.updateInsuranceForm.get('DeductibleRate').setErrors({ invalidDeductibleRate: true })

      }

      if (this.updateInsuranceForm.get('MaxLimit').invalid) {
      
        this.updateInsuranceForm.get('MaxLimit').setErrors({ invalidMaxLimit: true })

      }

      if (this.updateInsuranceForm.get('BeneficiaryType').invalid) {
      
        this.updateInsuranceForm.get('BeneficiaryType').setErrors({ invalidBeneficiaryType: true })

      }

      if (this.updateInsuranceForm.get('BeneficiaryTypeId').invalid) {
      
        this.updateInsuranceForm.get('BeneficiaryTypeId').setErrors({ invalidBeneficiaryTypeId: true })

      }

      if (this.updateInsuranceForm.get('BeneficiaryNumber').invalid) {
      
        this.updateInsuranceForm.get('BeneficiaryNumber').setErrors({ invalidBeneficiaryNumber: true })
        
      }

      if (this.updateInsuranceForm.get('IdentityNumber').invalid) {
      
        this.updateInsuranceForm.get('IdentityNumber').setErrors({ invalidIdentityNumber: true })
        
      }

      if (this.updateInsuranceForm.get('InceptionDate').invalid) {
      
        this.updateInsuranceForm.get('InceptionDate').setErrors({ invalidInceptionDate: true })
        
      }

      if (this.updateInsuranceForm.get('PolicyHolder').invalid) {
      
        this.updateInsuranceForm.get('PolicyHolder').setErrors({ invalidPolicyHolder: true })
        
      }

      if (this.updateInsuranceForm.get('InsurancePoIicyExpiryDate').invalid) {
      
        this.updateInsuranceForm.get('InsurancePoIicyExpiryDate').setErrors({ invalidInsurancePoIicyExpiryDate: true })
        
      }

    }

  }

  discardInsuranceForm() {

    this.currentInsuranceUser = {};
    this.insuranceForm.reset();
    this.addInsuranceForm = false;
    this.editInsuranceForm = false;
    this.updateInsuranceForm.reset();
    this.showUserDetails = false;
    this.showDependantDetails = false;
    this.accountType = "";
  }
  
  setCurrentInsuranceForm(userData, type) {

    this.showUserDetails = false;
    this.showDependantDetails = false;
    this.currentInsuranceUser = userData;
    this.addInsuranceForm = true;

    this.accountType = type

  }
  
  setCurrentInsuranceFormUpdate(userData, type) {

    this.showUserDetails = false;
    this.showDependantDetails = false;
    this.currentInsuranceUser = userData;
    this.updateInsuranceForm.patchValue(JSON.parse(userData.insurance_data))
    this.editInsuranceForm = true;

    this.accountType = type

  }

  openPatientNotes(appointment) {
    this.selectedAppointment = appointment;
    this.displayPatientNotes = true;
  }

  closePatientNotes() {
    this.displayPatientNotes = false;
    this.selectedAppointment = {};
  }

  saveSpNotes() {

      let data = {
        patientNotes: this.selectedAppointment.patientNotes,
        appointment_id: this.selectedAppointment.appointmentId
      }

        this._b2c.updatePatientNotes(data).subscribe({
              
          next : ( ress : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( ress.status === APIResponse.Success) {
    
              let index =  this.userUpcomingAppointments.findIndex(el => el.appointmentId === this.selectedAppointment.appointmentId) 

              if(index > -1) {

                this.userUpcomingAppointments[index].patientNotes = this.selectedAppointment.patientNotes

              }
              
              this.displayPatientNotes = false;
              this.selectedAppointment = {};
    
            }
            
          },
          error: ( err: any ) => {
            
            console.log(err)
            
          }
      
        }) 
    

  }

  closeReschedule(){
    this.displayRescheduleAppointment = false;
    this.selectedAppointment = {}
  }


  fetchHours() {

    let data = { 
      "post": "post"
    }
      //now we will get a list of branches from the backend
      this._appService.fetchAppHours(data).subscribe({
  
        next : ( res : any ) => {
          console.log(res);
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {
            
            this.cancelHour = res.data[0].cancel
            this.rescheduleHour = res.data[0].reschdule
  
          } else {
  
           
          }
          
        },
        error: ( err: any ) => {
  
          console.log(err)
  
        }
      
      })

  }

} 