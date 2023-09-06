import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { APIResponse } from 'src/utils/app-enum';
import { PatientsService } from 'src/service/patient.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userId: any
  rememberMe: boolean = false
  credentialsError: boolean = false

  errorMessage: string = ''
  
  // forms
  public credentialsForm : FormGroup

  constructor (
    private fb : FormBuilder,
    private _patientService: PatientsService,
    private router: Router ) {

    this.credentialsForm = this.fb.group({
  
      mobileNumber: ['', [ Validators.required]],
      password: ['', [ Validators.required]],

    })

   }

  ngOnInit(): void { 

    this.userId = localStorage.getItem("THSUserId")

    if(this.userId !== null) { 

      this.router.navigate(['/user/profile'])


    }

  }

  //this function will authenticate and log in user
  login() {

    if (this.credentialsForm.invalid) {

      // Display error messages
      if (this.credentialsForm.get('mobileNumber').invalid) {
      
        this.credentialsForm.get('mobileNumber').setErrors({ invalidMobile: true })

      }
      
      if (this.credentialsForm.get('password').invalid) {
      
        this.credentialsForm.get('password').setErrors({ invalidPassword: true })

      }

    } else {

      //if form is valid then we will log in user
      let data  = {

        mobileNumber: this.credentialsForm.get('mobileNumber').value,      
        password: this.credentialsForm.get('password').value,      

      } 

       //now we will send 6 digits random code to user's valid phone number
       this._patientService.signInWithEmailAndPassword(data).subscribe({
  
        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            localStorage.setItem("THSUserId", JSON.stringify(res.data.result))
            
            if( this.rememberMe ) {

              localStorage.setItem('THSToken',  res.data.token)
  
            }
          
            this.router.navigate(['/user/profile'])

          } else {
  
            this.errorMessage = res.message
            this.credentialsError = true

          }
          
        },
        error: ( err: any ) => {
  
          this.errorMessage = err.message
          this.credentialsError = true
  
        }
    
      })

    }

  }

  naviagateToForgetPassword() {

    this.router.navigate(['/forget-password'])

  }

  naviagateToRegister() {

    this.router.navigate(['/register'])

  }

}

/* TO BE REPLACED LATER
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { APIResponse } from 'src/utils/app-enum';
import { PatientsService } from 'src/service/patient.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rememberMe: boolean = false
  credentialsError: boolean = false

  errorMessage: string = ''
  
  // forms
  public credentialsForm : FormGroup

  constructor (
    private fb : FormBuilder,
    private _patientService: PatientsService ) {

    this.credentialsForm = this.fb.group({
  
      email: ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required]],

    })

   }

  ngOnInit(): void { }

  //this function will authenticate and log in user
  login() {

    if (this.credentialsForm.invalid) {

      // Display error messages
      if (this.credentialsForm.get('email').invalid) {
      
        this.credentialsForm.get('email').setErrors({ invalidEmail: true })

      }
      
      if (this.credentialsForm.get('password').invalid) {
      
        this.credentialsForm.get('password').setErrors({ invalidPassword: true })

      }

    } else {

      //if form is valid then we will log in user
      let data  = {

        email: this.credentialsForm.get('email').value,      
        password: this.credentialsForm.get('password').value,      

      } 

       //now we will send 6 digits random code to user's valid phone number
       this._patientService.signInWithEmailAndPassword(data).subscribe({
  
        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            localStorage.setItem("THSUserId", JSON.stringify(res.data.result))
            
            if( this.rememberMe ) {

              localStorage.setItem('THSToken',  res.data.token)
  
            }
          
          } else {
  
            this.errorMessage = res.message
            this.credentialsError = true

          }
          
        },
        error: ( err: any ) => {
  
          this.errorMessage = err.message
          this.credentialsError = true
  
        }
    
      })

    }

  }

}


*/