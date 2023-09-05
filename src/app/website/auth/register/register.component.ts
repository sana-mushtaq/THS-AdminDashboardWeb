import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { AppService } from 'src/service/app.service';
import { APIResponse } from 'src/utils/app-enum';
import { PatientsService } from 'src/service/patient.service';

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

  constructor(
    private fb : FormBuilder,
    private renderer: Renderer2,
    private _appService: AppService,
    private _patientService: PatientsService) {

      this.accountDetailsForm = this.fb.group({
  
        email: ['', [ Validators.required, Validators.email ]],
        phone_number: ['', [Validators.required, /*Validators.pattern('^(966|\\+966|0)(5|6|9)[0-9]{8}$')*/]],
        password: ['', [ Validators.required, Validators.minLength(8) ]],
        confirm_password: ['', [ Validators.required, Validators.minLength(8) ]]
 
      })
      
      this.accountSetupForm = this.fb.group({

        first_name: ['', [ Validators.required, Validators.minLength(4) ]],
        last_name: [''],
        dob: [''],
        gender: ['', [Validators.required]],
        nationality: ['', [Validators.required]],
        id_type: ['', [Validators.required]],
        id_number: ['', [Validators.required]],
        marital_status: ['']

      })
  }
    
  ngOnInit(): void {
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
            localStorage.setItem("THSUserId", JSON.stringify(this.userData))
            localStorage.setItem('THSToken',  res.data.token)

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

