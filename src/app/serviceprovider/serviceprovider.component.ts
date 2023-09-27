import { Component, OnInit } from '@angular/core';
import { APIResponse, PractiseUserRoles } from 'src/utils/app-enum';
import { AppService } from 'src/service/app.service';
import { PractiseUser } from 'src/model/common/practise-user.model';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceproviderService } from 'src/service/serviceprovider.service';
import { BranchService  } from 'src/service/branch.service'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ServiceService } from 'src/service/service.service';

@Component({
  selector: 'app-serviceprovider',
  templateUrl: './serviceprovider.component.html',
  styleUrls: ['./serviceprovider.component.css']
})
export class ServiceproviderComponent implements OnInit {

  serviceProviderList: any = []
  serviceProviderListAssigned: any = []
  serviceProviderAssignedServices: any = []

   //multiselect dropdown settings
   spList = []
   spSettings: IDropdownSettings = {}
   spListRenderer: boolean = false
   selectedSPs = []
 
   //multiselect dropdown settings
   serviceList = []
   serviceListFiltered = []
   serviceSettings: IDropdownSettings = {}
   serviceListRenderer: boolean = false
   selectedServiceSps = []
   
  //create a variable branch of type array
  branchList: any = []

  practiseUsers: any = []
  addNewServiceProviderToggle: Boolean = false

  editServiceProviderToggle: boolean = false
    
  //this will be used for the currently selected service on frontend
  selectedServiceProvider: any = {}
  
  selectedServiceProviderIndex: number = -1

  assignServiceProviderToggle: Boolean = false
  serviceProviderServiceToggle: Boolean = false
  serviceProviderAvailabilityToggle: Boolean = false

  public addServiceProviderForm : FormGroup
  public editServiceProviderForm : FormGroup


  //service provider availablility
  spAvailabilities: any = {}

  constructor(
    private _appService: AppService,
    private _serviceProvider: ServiceproviderService,
    private fb : FormBuilder,
    private _branchService: BranchService,
    private _service: ServiceService,
  ) {

    this.getPractiseUserList(PractiseUserRoles.All);

    //this will be called at first to get a list of branches
    this.getBranchList()

    //this will be calledl to fetch a list of services on page load
    this.getServiceList()
    
    this.addServiceProviderForm = this.fb.group({

      'first_name': ['', [ Validators.required, Validators.minLength(4) ]],
      'last_name': [''],
      'phone_number':['', [ Validators.required, Validators.minLength(9) ]], 
      'email': ['', [ Validators.required, Validators.email ]],
      'gender': [2, [ Validators.required ]],
      'nationality': [''],
      'password': ['', [ Validators.required ]],
      'medical_license': [''],
      'medical_license_expiry_date': [''],
      'branch_id' : ['', [ Validators.required ]],

    })

    this.editServiceProviderForm = this.fb.group({

      'firstName': ['', [ Validators.required, Validators.minLength(4) ]],
      'lastName': [''],
      'gender': [2, [ Validators.required]],
      'nationality': [''],
      'medicalLicenseNo': [''],
      'medicalLicenseExpiryDate': [''],
      'serviceProviderId' : [''],

    })

     //this will be used for dropdown settings
     this.spSettings = {
      idField: 'id',
      textField: 'fullName',
      allowSearchFilter: true
    }

    this.serviceSettings = {
      idField: 'id',
      textField: 'title_arabic',
      allowSearchFilter: true
    }

    //fi

    /* TO BE REPLACED LATER
    this.addServiceProviderForm = this.fb.group({

      'first_name': ['', [ Validators.required, Validators.minLength(4) ]],
      'last_name': [''],
      'dob': [''],
      'phone_number':['', [ Validators.required, Validators.minLength(9) ]], 
      'email': ['', [ Validators.required, Validators.email ]],
      'gender': [2, [ Validators.required]],
      'nationality': ['', [ Validators.required]],
      'marital_status': [''],
      'address': ['', [ Validators.required, Validators.minLength(4) ]],
      'profile_image': [''],
      'id_type': ['', [ Validators.required]],
      'id_number': ['', [ Validators.required]],
      'password': ['', [ Validators.required]],
      'type': ['', [ Validators.required]],
      'start_time': ['', [ Validators.required]],
      'end_time': ['', [ Validators.required]],
      'location': [''],
      'medical_license': [''],
      'medical_license_expiry_date': [''],
      'branch_id' : ['', [ Validators.required]],

    })*/
    
   }

  ngOnInit(): void {
    $('#nav_settings').addClass('active');
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
  }

  getPractiseUserList(userRole) {

    this._appService.getPractiseUserForSector(userRole).subscribe((response: any) => {
    
      if (response.status == APIResponse.Success) {
    
        this.practiseUsers = response.userList
    
      } else {
    
        console.log("server error");
    
      }
    
    }, err => {
    
      console.log("server error");
    
    });
  
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

  getServiceList() {

    //now we will get a list of services from the backend
    this._service.getServiceListToAssign().subscribe({

      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.serviceList = res.data

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

  editServiceProvider(user, pcIndex) {

    this.assignServiceData( user, pcIndex )
    this.editServiceProviderToggle = true

  }

  deleteServiceProvider(user, pcIndex) {

    this.assignServiceData( user, pcIndex )
    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, this user will be deleted`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete Service Provider'
    
    })
    .then( (confirmation) => {
    
      if (confirmation.isConfirmed) {

        let data = {

          user_id: user.parctiseUserId

        }

        //now we will delete category information from the database
        this._serviceProvider.deleteServiceProvider(data).subscribe({
  
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.practiseUsers.splice(this.selectedServiceProviderIndex, 1)
              this.unassignServiceData()
              
              Swal.fire(res.message)

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

    })

  }

  //the following function will close add new catgeory pop up
  closeEditServiceProvider() {

    this.editServiceProviderToggle = false
    this.unassignServiceData()
    this.editServiceProviderForm.reset()

  }

  //the following function will update service and its data
  updateServiceProvider() {

    //now we will assign the data of currentService to editServiceForm
    this.editServiceProviderForm.patchValue(this.selectedServiceProvider)

    //now owe will check if out form is valid or not
    if (this.editServiceProviderForm.valid) {

      let editForm = this.editServiceProviderForm.value

      let serviceData = { ...editForm }
  
      //we will submit the data for update if it is valid
      this._serviceProvider.updateServiceProvider(this.selectedServiceProvider).subscribe({
  
        next: ( res: any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            this.editServiceProviderToggle = false
            
            //reset form
            this.editServiceProviderForm.reset()

            Swal.fire(res.message)

          } else {
  
            //if it is unable to get branch data it will return an error
            Swal.fire(res.message)
  
          }
          
        },
        error: ( err: any ) => {
  
          console.log(err)
  
        }
    
      })
    
    } else {
      
      Swal.fire("Please check your data before submiting")
    
    }

  }

  //this function will create a new service provider
  createServiceProvider() {

    //now owe will check if out form is valid or not
    if (this.addServiceProviderForm.valid) {

      //we will submit the data if it is valid
      this._serviceProvider.createServiceProvider(this.addServiceProviderForm.value).subscribe({

        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            console.log(res.data)

            res.data['empDisplayId'] = "EMP" + PractiseUser.zeroPad(res.data.parctiseUserId, 4);
          
            //when the service provider is created the system should return an id of the newly created service provider
            this.practiseUsers.push(res.data)
            this.addNewServiceProviderToggle = false

            //reset form
            this.addServiceProviderForm.reset()
          
            Swal.fire(res.message)

          } else {

            //if it is unable to add service provider data it will return an error
            Swal.fire(res.message)

          }
          
        },
        error: ( err: any ) => {

          console.log(err)

        }
    
      })
    
    } else {
      
      Swal.fire("Please check your data before submiting")
    
    }

  }

  //this will open add a nwe service provider pop up
  addServiceProvider() {

    this.addNewServiceProviderToggle = true

  }
  
  closeAddNewServiceProvider() {

    this.addNewServiceProviderToggle = false

  }

  //the following function will initialize selected service and its data
  assignServiceData (currentService, serviceIndex) {

    this.selectedServiceProvider = currentService
    this.selectedServiceProviderIndex = serviceIndex

  } 
  
  //the following function will un-initialize selected service and its data
  unassignServiceData () {

    this.selectedServiceProvider = {}
    this.selectedServiceProviderIndex = -1

  } 

  //this will trigger a pop up for service provider to assign services
  serviceProviderServices(spData) {
    
    this.serviceProviderServiceToggle = true
    this.selectedServiceProvider = spData
    this.serviceListRenderer = true
    this.getAssignedServices(spData.parctiseUserId)

  }

  closeServiceProviderServices() {

    this.serviceProviderServiceToggle = false

    //reinitialze service provider object
    this.selectedServiceProvider = {}

    this.serviceListRenderer = false
    this.selectedServiceSps = []
    this.serviceProviderAssignedServices = []

  }
  
  updateServicesForServiceProvider() {

    let data = {

      user_id: this.selectedServiceProvider.parctiseUserId,
      service_id: this.selectedServiceSps

    }

    this._serviceProvider.assignServices(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          
          //after assiging service to a service provider we will reset the data
          this.closeServiceProviderServices()

        } else {

          this.closeServiceProviderServices()

          //if it is unable to get branch data it will return an error
          Swal.fire(res.message)

        }
        
      },
      error: ( err: any ) => {

        console.log(err)

      }
    
    })

  }

  //the following function will fetch services assigned to service provider
  getAssignedServices(user_id) {

    let data = {

      user_id: user_id

    }

    this._serviceProvider.getAssignedServices(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          
          //after assiging service to a service provider we will reset the data
          this.serviceProviderAssignedServices = res.data

          this.serviceListFiltered = this.serviceList.filter((elem) => {

            return !this.serviceProviderAssignedServices.some((ele) => ele.service_id === elem.id)
          
          })

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

  //tthe following function will unassign ersvice to a service provider
  unassignServiceServiceProvider(sps_id) {

    let data = {

      sps_id: sps_id

    }

    this._serviceProvider.unassignService(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          //now we will pop the record from serviceProviderAssignedServices
          this.serviceProviderAssignedServices = this.serviceProviderAssignedServices.filter( sp => {

            return sp.sps_id !== sps_id

          })

          //after assiging branch to a service provider we will reset the data
          Swal.fire(res.message)

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
  
  //the following function will be executed when service provider will be selected
  onServiceSelect(item: any) {

    this.selectedServiceSps.push(item.id)

  }

  //the following function will be executed when service provider will be deselected
  onServiceDeSelect(item: any) {

    this.selectedServiceSps = this.selectedServiceSps.filter(i => i !== item.id)

  }

  //the following function will be executed when all services will be selected
  onServiceSelectAll(item: any) {

    this.selectedServiceSps = item.map( i=> {

      return i.id

    })

  }

  //the following function will be executed when all services will be desleetced
  onServiceDeSelectAll() {

    this.selectedServiceSps = []

  }

  //this will close service provider popup
  closeAssignServiceProvider() {

    //this.unassignBranchData()
    this.assignServiceProviderToggle = false

  }

  //the following function will be executed when service provider will be selected
  onSPSelect(item: any) {

    this.selectedSPs.push(item.id)

  }

  //the following function will be executed when service provider will be deselected
  onSPDeSelect(item: any) {

    this.selectedSPs = this.selectedSPs.filter(i => i !== item.id)

  }

  //the following function will be executed when all service provider will be selected
  onSPSelectAll(item: any) {

    this.selectedSPs = item.map( i => {

      return i.id

    })

  }

  //the following function will be executed when all service provider will be deselected
  onSPDeSelectAll() {

    this.selectedSPs = []

  }

  //the following function will assign service providers to a branch
  assignSelectedServiceProviderToBranch() {

    let data = {

      user_id: this.selectedSPs,
      // branch_id: this.selectedBranch.id

    }

    this._serviceProvider.assignBranch(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          
          //after assiging branch to a service provider we will reset the data
          this.selectedSPs = []
          this.spList = []
          this.serviceProviderListAssigned = []
        //  this.assignServiceProviderToggle = false

        } else {

          this.selectedSPs = []
          this.spList = []
          this.serviceProviderListAssigned = []
        //  this.assignServiceProviderToggle = false
  
          //if it is unable to get branch data it will return an error
          Swal.fire(res.message)

        }
        
      },
      error: ( err: any ) => {

        console.log(err)

      }
    
    })

  }

  serviceProviderAvailability(spData) {
    
    let data1 = {

      practiceUserId:  spData.parctiseUserId,

    }

    this.selectedServiceProvider = spData


    this._serviceProvider.getAvailability(data1).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          
          //after assiging service to a service provider we will reset the data

          if(res.data.length>0) {


            this.spAvailabilities = res.data[0]
            this.spAvailabilities['days'] = JSON.parse(res.data[0]['days'])
            
            this.serviceProviderAvailabilityToggle = true

          } else {

            this.serviceProviderAvailabilityToggle = true
        
            this.spAvailabilities = {
        
              sunday: true,
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              days:{ 
                sunday: {
                start_time: "08:00",
                end_time: "14:00",
                spread: {
                  hour: 1,
                  minute:0
                }
              },
                monday: {
                  start_time: "08:00",
                  end_time: "14:00",
                  spread: {
                    hour: 1,
                    minute:0
                  }
                },
                tuesday: {
                  start_time: "08:00",
                  end_time: "14:00",
                  spread: {
                    hour: 1,
                    minute:0
                  }
                },
                wednesday: {
                  start_time: "08:00",
                  end_time: "14:00",
                  spread: {
                    hour: 1,
                    minute:0
                  }
                },
                thursday: {
                  start_time: "08:00",
                  end_time: "14:00",
                  spread: {
                    hour: 1,
                    minute:0
                  }
                },
                friday: {
                  start_time: "08:00",
                  end_time: "14:00",
                  spread: {
                    hour: 1,
                    minute:0
                  }
                },
                saturday: {
                start_time: "08:00",
                end_time: "14:00",
                spread: {
                  hour: 1,
                  minute:0
                }
              }
              }
        
            }
        
          }
        
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

  closeServiceProviderAvailability() {

    this.serviceProviderAvailabilityToggle = false

  }

  updateServiceProviderAvailability() {


    
    let data = {
      practiceUserId:  this.selectedServiceProvider.parctiseUserId,
      sunday: this.spAvailabilities.sunday,
      monday: this.spAvailabilities.monday,
      tuesday: this.spAvailabilities.tuesday,
      wednesday: this.spAvailabilities.wednesday,
      thursday: this.spAvailabilities.thursday,
      friday: this.spAvailabilities.friday,
      saturday: this.spAvailabilities.saturday,
      days: JSON.stringify({ 
        sunday: {
        start_time: this.spAvailabilities.days.sunday.start_time,
        end_time: this.spAvailabilities.days.sunday.end_time,
        spread: {
          hour: 1,
          minute:0
        }
      },
        monday: {
          start_time: this.spAvailabilities.days.monday.start_time,
          end_time: this.spAvailabilities.days.monday.end_time,
          spread: {
            hour: 1,
            minute:0
          }
        },
        tuesday: {
          start_time: this.spAvailabilities.days.tuesday.start_time,
          end_time: this.spAvailabilities.days.tuesday.end_time,
          spread: {
            hour: 1,
            minute:0
          }
        },
        wednesday: {
          start_time: this.spAvailabilities.days.wednesday.start_time,
          end_time: this.spAvailabilities.days.wednesday.end_time,
          spread: {
            hour: 1,
            minute:0
          }
        },
        thursday: {
          start_time: this.spAvailabilities.days.thursday.start_time,
          end_time: this.spAvailabilities.days.thursday.end_time,
          spread: {
            hour: 1,
            minute:0
          }
        },
        friday: {
          start_time: this.spAvailabilities.days.friday.start_time,
          end_time: this.spAvailabilities.days.friday.end_time,
          spread: {
            hour: 1,
            minute:0
          }
        },
        saturday: {
        start_time: this.spAvailabilities.days.saturday.start_time,
        end_time: this.spAvailabilities.days.saturday.end_time,
        spread: {
          hour: 1,
          minute:0
        }
      }
      })
    }

    this._serviceProvider.updateAvailability(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          
          //after assiging service to a service provider we will reset the data
          this.serviceProviderAvailabilityToggle = false
          this.spAvailabilities = {}

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

}
