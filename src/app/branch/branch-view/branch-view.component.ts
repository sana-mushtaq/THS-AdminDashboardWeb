/* THS-23 */
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core'
import { Branch } from "src/model/dashboard/branch.model"
import { Serviceprovide } from 'src/model/dashboard/serviceprovide.model'
import { BranchService  } from 'src/service/branch.service'
import Swal from 'sweetalert2'
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { APIResponse } from 'src/utils/app-enum'
import { AppService } from 'src/service/app.service'
import { ServiceproviderService } from 'src/service/serviceprovider.service'
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ServiceService } from 'src/service/service.service'
import { environment } from 'src/environments/environment'
import { MapsAPILoader } from '@agm/core';
declare var google: any;

@Component({
  selector: 'app-branch-view',
  templateUrl: './branch-view.component.html',
  styleUrls: ['./branch-view.component.css']
})

export class BranchViewComponent implements OnInit {


  @ViewChild('search') searchElementRef: ElementRef
  @ViewChild('search1') searchElementRef1: ElementRef
  
  public serverUrl : string = environment.domainName

  //locations
  place: any
  placeSelected: boolean = false
  zoom: number = 15
  centerLat: number = 24.7136
  centerLng: number = 46.6753
  selectedLat: number
  selectedLng: number

  //create a variable branch of type array
  branchList: any = []
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

  //branch action toggles
  editBranchInformationToggle: Boolean = false
  addNewBranchToggle: Boolean = false
  assignServiceProviderToggle: Boolean = false
  addNewServiceProviderToggle: Boolean = false
  serviceProviderServiceToggle: Boolean = false
  
  //this will be used for the currently selected branch on frontend
  selectedBranch: Branch = {
    id: -1,
    title: '',
    title_arabic: '',
    location: '',
    location_arabic: '',
    longitude: '',
    latitude: '',
    contact: '',
    email: '',
    description: '',
    description_arabic: '',
    image: '',
    radius: 0,
    active: 0,
    additional_cost_radius: 0,
    user_id: {}
  }

  selectedBranchIndex: number = -1

  //this will be used for the currently selected serviceprovider on frontend
  selectedServiceProvider: {

    id: -1,
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: 2,
    nationality: '',
    address: '',
    profile_image: '',
    type: '',
    unavailable: '',
    busy: '',
    start_time: '',
    end_time: '',
    medical_license: '',
    medical_license_expiry_date: '',
    branch_id: -1,
    title: '' //branch_title
  
  }

  //files
  selectedFile: File;

  // forms
  public addBranchForm : FormGroup
  public editBranchForm : FormGroup
  public addServiceProviderForm : FormGroup
  
  constructor( 
    private _branchService: BranchService,
    private _appService: AppService,
    private fb : FormBuilder,
    private _serviceProvider: ServiceproviderService,
    private _service: ServiceService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    ) {
    
    //this will be called at first to get a list of branches
    this.getBranchList()
    
    //this will be calledl to fetch a list of services on page load
    this.getServiceList()

    //now we will initialize branch form
    this.addBranchForm = this.editBranchForm = this.fb.group({
      
      title: ['', [ Validators.required, Validators.minLength(4) ]],
      title_arabic: [''],
      location: ['', [ Validators.required, Validators.minLength(4) ]],
      location_arabic: [''],
      longitude: ['', [ Validators.required ]],
      latitude: ['', [ Validators.required ]],
      contact: ['', [ Validators.required, Validators.minLength(9) ]],
      email: ['', [ Validators.required, Validators.email ]],
      description: [''],
      description_arabic: [''],
      image: ['' || null],
      radius: [0, [ Validators.required ]],
      active: [0, [ Validators.required ]],
      additional_cost_radius: [0],

    })

    
    this.addServiceProviderForm = this.fb.group({

      'first_name': ['', [ Validators.required, Validators.minLength(4) ]],
      'last_name': [''],
      'phone_number':['', [ Validators.required, Validators.minLength(9) ]], 
      'email': ['', [ Validators.required, Validators.email ]],
      'gender': [2, [ Validators.required]],
      'nationality': ['', [ Validators.required]],
      'password': ['', [ Validators.required]],
      'medical_license': [''],
      'medical_license_expiry_date': [''],
      'branch_id' : ['', [ Validators.required]],

    })

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


    //this will be used for dropdown settings
    this.spSettings = {
      idField: 'id',
      textField: 'fullName',
      allowSearchFilter: true
    }

    this.serviceSettings = {
      idField: 'id',
      textField: 'title',
      allowSearchFilter: true
    }

    //first we will get user location and display on the header
    this.getUserLocation()
   
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

  ngOnInit(): void {

    // Use the Google Maps Geocoding API to convert the searchLocation to coordinates
    this.mapsAPILoader.load().then(() => {})

   }

  //the followng function will be used to assign branch data based on selected opertion
  assignBranchData( currentBranch, index ) {

    this.selectedBranch = currentBranch
    this.selectedBranchIndex = index
  
  }

  //the following function will be used to unassign branch data based on selected option
  unassignBranchData() {
    
    this.selectedBranch = {
      id: -1,
      title: '',
      title_arabic: '',
      location: '',
      location_arabic: '',
      longitude: '',
      latitude: '',
      contact: '',
      email: '',
      description: '',
      description_arabic: '',
      image: '',
      radius: 0,
      active: 0,
      additional_cost_radius: 0,
      user_id: {}
    }
    this.selectedBranchIndex = -1
    this.selectedSPs = []
    this.serviceProviderList = []
    this.serviceProviderListAssigned = []

  }

  //this will trigger add branch popup
  addBranch() {

    this.addNewBranchToggle = true

    setTimeout(()=>{

      this.initializeAutocompleteAndConfirm()

    }, 500)

  }

  //this will open add a nwe service provider pop up
  addServiceProvider() {

    this.unassignBranchData()
    this.assignServiceProviderToggle = false
    this.addNewServiceProviderToggle = true

  }

  //this will trigger edit branch popup and assign current branch informtaion to selectedBranch
  editBranch( currentBranch, index ) {
    
    this.assignBranchData( currentBranch, index )
    this.editBranchInformationToggle = true

    setTimeout(()=>{

      this.initializeAutocompleteAndConfirm1()

    }, 500)

  }

   //this will trigger assign service provider to a branch popup and assign current branch informtaion to selectedBranch
  assignServiceProvider( currentBranch, index ) {

    this.assignBranchData( currentBranch, index )
    this.assignServiceProviderToggle = true

    this.getServiceProviders()

  }

  //the following function will fetch a list of service providers from the backend
  getServiceProviders() {

    let data = {
      "branch_id": this.selectedBranch.id
    }

    //now we will fetch service providers to assign to a branch
    this._serviceProvider.getServiceProviderList( data ).subscribe({
   
      next : async ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.serviceProviderList = res.data
          
          this.serviceProviderList.forEach(d=> { console.log(d) })
          let selectedBranchId = this.selectedBranch.id

          this.serviceProviderListAssigned = this.serviceProviderList.filter( sp => {

            return sp.branch_id === selectedBranchId

          })
          
          console.log(this.serviceProviderListAssigned)
          let spListDataUnAssigned = this.serviceProviderList.filter( sp => {

            return sp.branch_id === null

          })

          let assignFullName = spListDataUnAssigned as any
          
          assignFullName.forEach(sp => {

            sp.fullName = `${sp.first_name} ${sp.last_name} (${sp.type})`
          
          })
          
          this.spList = assignFullName
          this.spListRenderer = true

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

  //this will trigger delete branch functin and confirms user if he wants to delete branch
  deleteBranch( currentBranch, index ) {
    
      this.assignBranchData( currentBranch, index )
      Swal.fire({

        title: 'Confirmation',
        text: `By confirming yes, this branch "${currentBranch.title}" will be deleted`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0144e4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete Branch'
      
      })
      .then( (confirmation) => {
      
        if (confirmation.isConfirmed) {

          let data = {

            branch_id: currentBranch.id

          }

          //now we will delete branch information from the database
          this._branchService.deleteBranch(data).subscribe({
    
            next : ( res : any ) => {
      
              //in case of success the api returns 0 as a status code
              if( res.status === APIResponse.Success ) {

                //now we will splice the branch data from array
                this.branchList.splice(this.selectedBranchIndex, 1)
                this.unassignBranchData()
                
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

  //this will close the add branch popup
  closeAddBranch() {

    this.addNewBranchToggle = false
    this.addBranchForm.reset()

  }

  //this will  reset the branch data 
  closeEditBranch() {

    this.unassignBranchData()
    this.editBranchInformationToggle = false
    this.editBranchForm.reset()

  }

  //this will close service provider popup
  closeAssignServiceProvider() {

    this.unassignBranchData()
    this.assignServiceProviderToggle = false

  }

  closeAddNewServiceProvider() {

    this.addNewServiceProviderToggle = false

  }

  //this will call activate branch and set the branch.active to false
  activateBranch( currentBranch, index ) {

    this.assignBranchData( currentBranch, index )

    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, this branch "${currentBranch.title}" will be activiated`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Activate'
    
    })
    .then( (confirmation) => {
      
      if (confirmation.isConfirmed) {

        let data = {

          branch_id: currentBranch.id,
          active: 1

        }

        //now we will delete branch information from the database
        this._branchService.updateBranchStatus(data).subscribe({
    
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.branchList[this.selectedBranchIndex].active = 1
              this.unassignBranchData()
              
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

  //this will call deactivate branch and set the branch.active to false
  deactivateBranch( currentBranch, index ) {

    this.assignBranchData( currentBranch, index )

    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, this branch "${currentBranch.title}" will be deactiavated`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Deactiavate'
    
    })
    .then( (confirmation) => {
    
      if (confirmation.isConfirmed) {

        let data = {

          branch_id: currentBranch.id,
          active: 0

        }

        //now we will delete branch information from the database
        this._branchService.updateBranchStatus(data).subscribe({
  
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.branchList[this.selectedBranchIndex].active = 0
              this.unassignBranchData()
              
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

  //this function will update branch data
  async updateBranch() {
    
    //now we will assign the data of currentbranch to editBranchForm
    this.editBranchForm.patchValue(this.selectedBranch)

    //now owe will check if out form is valid or not
    if (this.editBranchForm.valid) {

      //first we will call upload image function then initialize the result bac
      await this.uploadImage()


      let editForm = this.editBranchForm.value
      let branch_id = this.selectedBranch.id

      let branchData = { 
        ...editForm,
        branch_id: branch_id      
      }

      branchData['image'] = this.selectedBranch.image
      
      //we will submit the data for update if it is valid
      this._branchService.updateBranch(branchData).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            this.editBranchInformationToggle = false
            
            //reset form
            this.editBranchForm.reset()

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

  //this function will create a new branch
  createBranch() {

    //now owe will check if out form is valid or not
    if (this.addBranchForm.valid) {

      //we will submit the data if it is valid
      this._branchService.createBranch(this.addBranchForm.value).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            //when the branch is created the system should return an id of the newly created branch
            this.branchList.push(res.data)
            this.addNewBranchToggle = false
            
            //reset form
            this.addBranchForm.reset()

            Swal.fire(res.message)

          } else {
  
            //if it is unable to add branch data it will return an error
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

            //when the service provider is created the system should return an id of the newly created service provider
            this.serviceProviderList.push(res.data)
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

  updateImage( event ) {

    this.selectedFile = event.files.item(0)
  
  }
  //the following function will upload an image to the server
  uploadImage() {

    this._appService.fileUploadImage( this.selectedFile ).subscribe( ( response: any ) => {

      if (response.status == APIResponse.Success) {
        
        this.selectedBranch.image = response.message
        return
      }
    
    })

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
      branch_id: this.selectedBranch.id

    }

    this._serviceProvider.assignBranch(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          
          //after assiging branch to a service provider we will reset the data
          this.selectedSPs = []
          this.spList = []
          this.serviceProviderListAssigned = []
          this.assignServiceProviderToggle = false

        } else {

          this.selectedSPs = []
          this.spList = []
          this.serviceProviderListAssigned = []
          this.assignServiceProviderToggle = false

          //if it is unable to get branch data it will return an error
          Swal.fire(res.message)

        }
        
      },
      error: ( err: any ) => {

        console.log(err)

      }
    
    })

  }

  //the following function will unassign branch for the service provider
  unassignBranch(id) {

    let data = {

      user_id: id,

    }

    this._serviceProvider.unassignBranch(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          //now we will pop the record from serviceProviderListAssigned
          this.serviceProviderListAssigned = this.serviceProviderListAssigned.filter( sp => {

            return sp.id !== id

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

  //this will trigger a pop up for service provider to assign services
  serviceProviderServices(spData) {
    
    this.serviceProviderServiceToggle = true
    this.selectedServiceProvider = spData
    this.serviceListRenderer = true
    this.getAssignedServices(spData.id)

  }

  closeServiceProviderServices() {

    this.serviceProviderServiceToggle = false

    //reinitialze service provider object
    this.selectedServiceProvider = {

      id: -1,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      gender: 2,
      nationality: '',
      address: '',
      profile_image: '',
      type: '',
      unavailable: '',
      busy: '',
      start_time: '',
      end_time: '',
      medical_license: '',
      medical_license_expiry_date: '',
      branch_id: -1,      
      title: '' //branch_title

    }

    this.serviceListRenderer = false
    this.selectedServiceSps = []
    this.serviceProviderAssignedServices = []

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

  updateServicesForServiceProvider() {

    let data = {

      user_id: this.selectedServiceProvider.id,
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
  unassignServiceServiceProvider(service_id) {

    let data = {

      service_id: service_id,

    }

    this._serviceProvider.unassignService(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          //now we will pop the record from serviceProviderAssignedServices
          this.serviceProviderAssignedServices = this.serviceProviderAssignedServices.filter( sp => {

            return sp.id !== service_id

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

  initializeAutocompleteAndConfirm1() {

    // Use this.searchAddress.nativeElement instead of #search
    const input = new google.maps.places.Autocomplete(this.searchElementRef1.nativeElement)

    input.addListener('place_changed', () => {

      this.ngZone.run(() => {

        this.place = input.getPlace()
        this.placeSelected = true; // Set the flag to indicate a place has been selected
      
      })

    })

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

        this.addBranchForm.patchValue({
          latitude: this.selectedLat
        })

        this.addBranchForm.patchValue({
          longitude: this.selectedLng
        })

        // Get the location name using the Google Maps Places API
        const geocoder = new google.maps.Geocoder()
        const latlng = { lat: this.centerLat, lng: this.centerLng }
    
        geocoder.geocode({ location: latlng }, (results, status) => {

          if (status === google.maps.GeocoderStatus.OK) {
          
            if (results[0]) {
          
              const locationName = results[0].formatted_address
              this.addBranchForm.patchValue({
                location: locationName
              })
      
              // You can use the locationName as needed
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

    this.addBranchForm.patchValue({
      latitude: this.selectedLat
    })

    this.addBranchForm.patchValue({
      longitude: this.selectedLng
    })

  }

  onMarkerDragEnd(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    // Update the center of the map to the dragged marker's position
    this.centerLat = this.selectedLat
    this.centerLng = this.selectedLng

    this.placeSelected = true

    this.addBranchForm.patchValue({
      latitude: this.selectedLat
    })

    this.addBranchForm.patchValue({
      longitude: this.selectedLng
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

  } 

  onMapClick1(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    this.editBranchForm.patchValue({
      latitude: this.selectedLat
    })

    this.editBranchForm.patchValue({
      longitude: this.selectedLng
    })

  }

  onMarkerDragEnd1(event) {

    this.selectedLat = event.coords.lat
    this.selectedLng = event.coords.lng

    // Update the center of the map to the dragged marker's position
    this.centerLat = this.selectedLat
    this.centerLng = this.selectedLng

    this.placeSelected = true

    this.editBranchForm.patchValue({
      latitude: this.selectedLat
    })

    this.selectedBranch.latitude = this.selectedLat as any
    this.selectedBranch.longitude = this.selectedLng as any

    this.editBranchForm.patchValue({
      longitude: this.selectedLng
    })

  }

  onConfirmLocation1() {

    if (this.place && this.place.geometry && this.place.geometry.location) {
      
      this.selectedLat = this.place.geometry.location.lat()
      this.selectedLng = this.place.geometry.location.lng()
  
    }

    this.centerLat = this.selectedLat
    this.centerLng = this.selectedLng

    this.placeSelected = false

  } 

}