import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { Router } from '@angular/router';
import { AppService } from 'src/service/app.service';
import { PatientsService } from 'src/service/patient.service';
import { APIResponse } from 'src/utils/app-enum';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  @ViewChild('forgotPassword') forgotPasswordsHTML?: ElementRef<HTMLDivElement>
  @ViewChild('otp') otpHTML?: ElementRef<HTMLDivElement>
  @ViewChild('changePassword') changePasswordHTML?: ElementRef<HTMLDivElement>

  userId: any
  email: any

  verificationCode: string | null = null
  verificationCodeInput: string

  showVerificationAlert: boolean = false
  showInvalidPhoneNumber: boolean = false
  showUserDoesNotExist: boolean = false
  errorChangingPassword: boolean = false
  passwordChanged: boolean = false

  // forms
  public forgotPasswordForm : FormGroup
  public changePasswordForm : FormGroup

  constructor( 
    private router: Router,
    private fb : FormBuilder,
    private renderer: Renderer2,
    private _appService: AppService,
    private _patientService: PatientsService ) {

      this.forgotPasswordForm = this.fb.group({
  
        phone_number: ['', [Validators.required, Validators.pattern('^(966|\\+966|0)(5|6|9)[0-9]{8}$')]],

      })

      this.changePasswordForm = this.fb.group({
  
        password: ['', [ Validators.required, Validators.minLength(8) ]],
        confirm_password: ['', [ Validators.required, Validators.minLength(8) ]]
  
      })
    
   }

  ngOnInit(): void {
  }

  sendSMS() {

    if (this.forgotPasswordForm.invalid) {

      // Display error messages
      if (this.forgotPasswordForm.get('phone_number').invalid) {
      
        this.forgotPasswordForm.get('phone_number').setErrors({ invalidPhoneNumber: true })
      
      }


    } else {

      let data  = {

        phone_number: this.forgotPasswordForm.get('phone_number').value
      
      } 

       //now we will send 6 digits random code to user's valid phone number
       this._patientService.verifyIfPatientExists(data).subscribe({
  
        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

              // Perform your account details processing here
              let verification_code = this.generateRandomCode()
              let phone_number = res.data.mobileNumber
              this.email = res.data.email
              this.userId = res.data.patientId

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
                    this.renderer.addClass(this.forgotPasswordsHTML.nativeElement, 'hide')
                    this.renderer.removeClass(this.otpHTML.nativeElement, 'hide')
                    this.renderer.addClass(this.changePasswordHTML.nativeElement, 'hide')

                  } else {
          
                    this.showInvalidPhoneNumber = true

                  }
                  
                },
                error: ( err: any ) => {
          
                  this.showInvalidPhoneNumber = true
          
                }
            
              })

          } else {
  
            this.showUserDoesNotExist = true

          }
          
        },
        error: ( err: any ) => {
  
          this.showUserDoesNotExist = true
  
        }
    
      })

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

    return this.verificationCode

  }

  verifyCode() {

    //here we will check if verification code is equal to verification code input
    if( this.verificationCode === this.verificationCodeInput ) {

      //if matches then we will show next block of account creation
       //now we will display relevent div
        //now we will display relevent div
        this.renderer.addClass(this.forgotPasswordsHTML.nativeElement, 'hide')
        this.renderer.addClass(this.otpHTML.nativeElement, 'hide')
        this.renderer.removeClass(this.changePasswordHTML.nativeElement, 'hide')


    } else {
      
      //if verification code is wrong then a popup will be displayed to user
      this.showVerificationAlert = true

    }

  }

  changeUserPassword() {

    if (this.changePasswordForm.invalid) {

      // Display error messages
      if (this.changePasswordForm.get('password').invalid) {
      
        this.changePasswordForm.get('password').setErrors({ invalidPassword: true })

      }
  
      if (this.changePasswordForm.get('confirm_password').invalid) {

          if(this.changePasswordForm.get('confirm_password').value !== this.changePasswordForm.get('password').value) {

            this.changePasswordForm.get('confirm_password').setErrors({ invalidCPasswordNotMatched: true })

          } else {

            this.changePasswordForm.get('confirm_password').setErrors({ invalidCPassword: true })

          }

      }

    } else {

      let data  = {

        password: this.changePasswordForm.get('password').value,
        email: this.email,
        user_id: this.userId
      
      } 

       //now we will send 6 digits random code to user's valid phone number
       this._patientService.changePatientPassword(data).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            this.passwordChanged = true
            

          } else {
  
            this.errorChangingPassword = true

          }
          
        },
        error: ( err: any ) => {
  
          this.errorChangingPassword = true
  
        }
    
      })

    }

  }

  naviagteToLogin() {

    this.router.navigate(['/login'])

  }

  handleCancelClick() {}

  handleContinueClick() {

    this.showVerificationAlert = false
    this.showInvalidPhoneNumber = false
    this.showUserDoesNotExist = false

  }

}
