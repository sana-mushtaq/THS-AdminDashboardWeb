import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { AppService } from 'src/service/app.service';
import { APIResponse } from 'src/utils/app-enum';
import { PatientsService } from 'src/service/patient.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/service/language.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MedicaltagService } from 'src/service/medicaltag.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  @ViewChild('account_details') accountDetailsHTML?: ElementRef<HTMLDivElement>
  @ViewChild('account_confirmation') accountConfirmationHTML?: ElementRef<HTMLDivElement>
  @ViewChild('account_setup') accountSetupHTML?: ElementRef<HTMLDivElement>

  verificationCode: string | null = null
  verificationCodeInput: string
  showVerificationAlert: boolean = false
  showInvalidPhoneNumber: boolean = false
  showErrorCreatingUser: boolean = false
  showUserAlreadyExist: boolean = false

  // forms
  public accountDetailsForm : FormGroup
  public accountSetupForm : FormGroup

  // userdata
  userData: any
  currentImage = 'assets/images/web/register.svg'
  currentTitle = 'Simple steps to start your healing journey'
  currentDesc = 'More than 100 home medical services for you and your family.'

  //medicalTags
  medicalTags: any = []
  medicalTagListEn: any = []
  medicalTagListAr: any = []
  medicalTagSettingsEn: IDropdownSettings = {}
  medicalTagSettingsAr: IDropdownSettings = {}
  userMedicalTags: any = []
  modelMedicalTag: any = []

  constructor(
    private fb : FormBuilder,
    private renderer: Renderer2,
    private _appService: AppService,
    private _patientService: PatientsService,
    private router: Router,
    public languageService: LanguageService,
    private _medicalTagService: MedicaltagService,
    ) {

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

      this.accountDetailsForm = this.fb.group({
  
        email: ['', [ Validators.required, Validators.email ]],
        phone_number: ['', [Validators.required, Validators.pattern(/^(966|\+966|0)?(5|9)[0-9]{8}$/) ]],
        password: ['', [ Validators.required, Validators.minLength(8) ]],
        confirm_password: ['', [ Validators.required, Validators.minLength(8) ]]
 
      })
      
      this.accountSetupForm = this.fb.group({

        first_name: ['', [ Validators.required]],
        last_name: [''],
        dob: [''],
        gender: ['', [Validators.required]],
        nationality: ['', [Validators.required]],
        id_type: ['', [Validators.required]],
        id_number: ['', [Validators.required]],
        marital_status: ['']

      })

      const currentLanguage = this.languageService.getCurrentLanguage();
    
      if (currentLanguage === 'ar') {

        this.currentTitle = 'خطوات بسيطة لتبدأ رحلتك العلاجية'
        this.currentDesc = 'أكثر من 100 خدمة طبية منزلية لك ولعائلتك.'
      }

  }
    
  ngOnInit(): void {

     //fetch all medical tags stored by operations
     this._medicalTagService.getTagList().subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {
          
          this.medicalTags = res.data
          this.medicalTagListEn = this.medicalTags
          this.medicalTagListAr = this.medicalTags
          
        }
        
      },
      error: ( err: any ) => {
      
      }
  
    })
    
  }

  restrictInput(event: any) {
  
    const input = event.key;
    const phoneControl = this.accountDetailsForm.get('phone_number');
  
    if (!/^\d$/.test(input)) {
  
      event.preventDefault();
  
    } else if (phoneControl.value === '966' && input !== '5') {
  
      event.preventDefault();
  
    }
  
  }
  
  //here we will generate 6 digit random code to be use for verification purposes
  generateRandomCode() {

    const codeLength = 6
    const min = Math.pow(10, codeLength - 1)
    const max = Math.pow(10, codeLength) - 1
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min

    this.verificationCode = randomCode.toString().padStart(codeLength, '0')
  
    // Clear the code after 10 minutes
    setTimeout(() => {

      this.verificationCode = null


    }, 10 * 60 * 1000) // 10 minutes in milliseconds

    console.log(this.verificationCode)
    return this.verificationCode

  }

  accountDetails() {

    if (this.accountDetailsForm.invalid) {

      // Display error messages
      if (this.accountDetailsForm.get('email').invalid) {
      
        this.accountDetailsForm.get('email').setErrors({ invalidEmail: true })

      }
      
      if (this.accountDetailsForm.get('phone_number').invalid) {
      
        this.accountDetailsForm.get('phone_number').setErrors({ invalidPhoneNumber: true })
      
      }
  
      if (this.accountDetailsForm.get('password').invalid) {
      
        this.accountDetailsForm.get('password').setErrors({ invalidPassword: true })

      }
  
      if (this.accountDetailsForm.get('confirm_password').invalid) {

          if(this.accountDetailsForm.get('confirm_password').value !== this.accountDetailsForm.get('password').value) {

            this.accountDetailsForm.get('confirm_password').setErrors({ invalidCPasswordNotMatched: true })

          } else {

            this.accountDetailsForm.get('confirm_password').setErrors({ invalidCPassword: true })

          }

      }

    } else {
      
      let data  = {

        phone_number: this.accountDetailsForm.get('phone_number').value,
        email: this.accountDetailsForm.get('email').value
      
      } 

       //now we will send 6 digits random code to user's valid phone number
       this._patientService.verifyPatient(data).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

              // Perform your account details processing here
              let verification_code = this.generateRandomCode()
              let phone_number = this.accountDetailsForm.get('phone_number').value
              let data = {

                text: `Your 6 digits verification code is ${verification_code}`,
                number: phone_number,

              }
              //now we will send 6 digits random code to user's valid phone number
              this._appService.sendSMS(data).subscribe({
          
                next : ( ress : any ) => {
          
                  //in case of success the api returns 0 as a status code
                  if( ress.status === APIResponse.Success ) {

                    //now we will display relevent div
                    this.renderer.addClass(this.accountDetailsHTML.nativeElement, 'hide')
                    this.renderer.removeClass(this.accountConfirmationHTML.nativeElement, 'hide')
                    this.renderer.addClass(this.accountSetupHTML.nativeElement, 'hide')

                  } else {
          
                    this.showInvalidPhoneNumber = true

                  }
                  
                },
                error: ( err: any ) => {
          
                  this.showInvalidPhoneNumber = true
          
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

    }
    
  }

  verifyCode() {

    //here we will check if verification code is equal to verification code input
    if( this.verificationCode === this.verificationCodeInput ) {

      //if matches then we will show next block of account creation
       //now we will display relevent div
        //now we will display relevent div
        this.renderer.addClass(this.accountDetailsHTML.nativeElement, 'hide')
        this.renderer.addClass(this.accountConfirmationHTML.nativeElement, 'hide')

        this.currentImage = 'assets/images/web/accountDetails.svg'
        this.currentTitle = 'High qualified medical staff'
        this.currentDesc = 'For all home medical care services for you and your family in one place.'


        const currentLanguage = this.languageService.getCurrentLanguage();

      if (currentLanguage === 'ar') {

        this.currentTitle = 'فريق طبي ذو كفاءة عالية'
        this.currentDesc = 'لجميع خدمات الرعاية الطبية المنزلية لك ولعائلتك في مكان واحد.'
      }

        this.renderer.removeClass(this.accountSetupHTML.nativeElement, 'hide')


    } else {
      
      //if verification code is wrong then a popup will be displayed to user
      this.showVerificationAlert = true

    }

  }

  handleCancelClick(): void {}

  //alert continue button handler
  handleContinueClick(): void {

    this.showVerificationAlert = false
    this.showInvalidPhoneNumber = false
    this.showErrorCreatingUser = false
    this.showUserAlreadyExist = false

  }

  accountSetup() {

    if (this.accountSetupForm.invalid) {

      // Display error messages
      if (this.accountSetupForm.get('first_name').invalid) {
      
        this.accountSetupForm.get('first_name').setErrors({ invalidFName: true })

      }
      
      if (this.accountSetupForm.get('gender').invalid) {
      
        this.accountSetupForm.get('gender').setErrors({ invalidGender: true })
      
      }
  
      if (this.accountSetupForm.get('nationality').invalid) {
      
        this.accountSetupForm.get('nationality').setErrors({ invalidNationality: true })

      }
  
      if (this.accountSetupForm.get('id_type').invalid) {

          this.accountSetupForm.get('id_type').setErrors({ invalidIdType: true })

      }

      if (this.accountSetupForm.get('id_number').invalid) {

        this.accountSetupForm.get('id_number').setErrors({ invalidIdNumber: true })

      }

    } else {

        let idType = this.accountSetupForm.get('id_number').value
        let ifSaudiId = this.validateNationalId(idType)
    
        if(this.accountSetupForm.get('id_type').value === 'national_id' && ifSaudiId === -1) {

            this.accountSetupForm.get('id_number').setErrors({ invalidIdNumber: true })

        } else if(this.accountSetupForm.get('id_type').value !== 'national_id' && ifSaudiId === 1) {

            this.accountSetupForm.get('id_type').setErrors({ invalidIdType: true })
            this.accountSetupForm.get('id_number').setErrors({ invalidIdNumber: true })
        } 

        else {

          //if details are correct then we will combine details & register user in out system
          let data = {

            email: this.accountDetailsForm.get('email').value,
            phone_number: this.accountDetailsForm.get('phone_number').value,
            password: this.accountDetailsForm.get('password').value,
            first_name: this.accountSetupForm.get('first_name').value,
            last_name: this.accountSetupForm.get('last_name').value,
            dob: this.accountSetupForm.get('dob').value,
            gender: this.accountSetupForm.get('gender').value,
            nationality: this.accountSetupForm.get('nationality').value,
            id_type: this.accountSetupForm.get('id_type').value,
            id_number: this.accountSetupForm.get('id_number').value,
            marital_status: this.accountSetupForm.get('marital_status').value

          }

          this._patientService.registerUser(data).subscribe({

            next : ( res : any ) => {

              //in case of success the api returns 0 as a status code
              if( res.status === APIResponse.Success ) {

                this.userData =  res.data.result
                localStorage.setItem("THSUserId", JSON.stringify(this.userData.id))
                localStorage.setItem('THSToken',  res.data.token)

                this.router.navigate(['/user/profile'])

              } else {

                //if it is unable to add category data it will return an error
                this.showErrorCreatingUser = true

              }
              
            },

            error: ( err: any ) => {
              
              this.showErrorCreatingUser = true

            }

          })

        }

    }
    
  }

  naviagteToLogin() {

    this.router.navigate(['/login'])

  }

  naviagteToHome() {

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

}

