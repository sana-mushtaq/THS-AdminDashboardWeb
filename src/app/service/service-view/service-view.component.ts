import { Component, OnInit } from '@angular/core'
import { ServicecategoryService } from 'src/service/servicecategory.service'
import { Servicecategory } from 'src/model/dashboard/servicecategory.model'
import { APIResponse } from 'src/utils/app-enum'
import Swal from 'sweetalert2'
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Service } from 'src/model/dashboard/service.model'
import { ServiceService } from 'src/service/service.service'
import { AppService } from 'src/service/app.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css']
})

export class ServiceViewComponent implements OnInit {

  public serverUrl : string = environment.domainName

  //create a variable categoryList of type array
  categoryList: Servicecategory [] = []
  
  //create a variable serviceList of type array
  serviceList: any = []

  addNewServiceToggle: boolean = false
  serviceDetailsToggle: boolean = false
  editServiceToggle: boolean = false
    
  //this will be used for the currently selected service on frontend
  selectedService: Service = {

    id: -1,
    category_id: -1,
    service_type: '',
    url: '',
    title: '',
    title_arabic: '',
    description: '',
    description_arabic: '',
    title_tag: '',
    meta_tag: '',
    instructions: '',
    instructions_arabic: '',
    faq: '',
    faq_arabic: '',
    icon: '',
    cover_image: '',
    banner: '',
    price: 0,
    cost: 0,
    active: false,
    whatsapp_url: '',
    category_title: '',
    coupon_code: '',
    top: false

  }
  
  selectedServiceIndex: number = -1

  // forms
  public addServiceForm : FormGroup
  public editServiceForm : FormGroup

  //pagination
  itemsPerPage: number = 25 // Number of items to display per page
  currentPage: number = 1 // Current page number
  displayedServiceList:any = [] // To hold services for the current page
  // Calculate the total number of pages
  totalItems: number = this.serviceList.length
  totalPages: number = Math.ceil(this.totalItems / this.itemsPerPage)
  searchText: string = '';

  constructor(
    private _serviceCategory: ServicecategoryService,
    private _service: ServiceService,
    private fb : FormBuilder,
    private _appService: AppService,
  ) { 

    this.getCategoryList()

    this.getServiceList()

    this.addServiceForm = this.editServiceForm = this.fb.group({
     
      'category_id' : [-1, [ Validators.required]],
      'service_type': [''],
      'url': [''],
      'title': ['', [ Validators.required]],
      'title_arabic': [''],
      'description': [''],
      'description_arabic': [''],
      'title_tag': [''],
      'meta_tag': [''],
      'instructions': [''],
      'instructions_arabic': [''],
      'faq': [''],
      'faq_arabic': [''],
      'icon': [''],
      'cover_image': [''],
      'banner': [''],
      'price': [0, [ Validators.required]],
      'cost': [0],
      'active': [false],
      'whatsapp_url': [''],
      'top': [0]

    })

  }

  ngOnInit(): void {
    $('#nav_settings').addClass('active');
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
  }

  //the following function will fetch category list
  getCategoryList() {

    //now we will get a list of categories from the backend
    this._serviceCategory.getCategoryList().subscribe({
      
      next : ( res : any ) => {
  
        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
  
          this.categoryList = res.data
  
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

  //the following function will initialize selected service and its data
  assignServiceData (currentService, serviceIndex) {

    this.selectedService = currentService
    this.selectedServiceIndex = serviceIndex

  } 

  //the following function will un-initialize selected service and its data
  unassignServiceData () {

    this.selectedService = {
     
      id: -1,
      category_id: -1,
      service_type: '',
      url: '',
      title: '',
      title_arabic: '',
      description: '',
      description_arabic: '',
      title_tag: '',
      meta_tag: '',
      instructions: '',
      instructions_arabic: '',
      faq: '',
      faq_arabic: '',
      icon: '',
      cover_image: '',
      banner: '',
      price: 0,
      cost: 0,
      active: false,
      whatsapp_url: '',
      category_title: '',
      coupon_code: '',
      top: false
    
    }

    this.selectedServiceIndex = -1

  } 

  //the following function will fetch a list of services from backend
  getServiceList() {

      //now we will get a list of categories from the backend
      this._service.getServiceList().subscribe({
    
        next : ( res : any ) => {
    
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {
    
            this.serviceList = res.data
            
            this.displayedServiceList = this.serviceList
         //   this.displayedServiceList = this.serviceList.splice(0, 25)

            this.totalItems = this.serviceList.length
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    
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
  
  //the following funtcion will open add new service popup
  addService() {

    this.addNewServiceToggle = true

  }

  //the following function will close add new service pop up
  closeAddService() {

    this.addNewServiceToggle = false
    //this.addServiceForm.reset()

  }

  //the following function will create a service
  createService() {

     //now owe will check if out form is valid or not
     if (this.addServiceForm.valid) {
        
      //we will submit the data if it is valid
        this._service.createService(this.addServiceForm.value).subscribe({
    
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              let category_id = this.addServiceForm.get('category_id').value

              let categoryName = this.categoryList.filter(el => { return Number(el.id) === Number(category_id) })
              res.data['category_title'] = categoryName[0].title

              //when the service is created the system should return an id of the newly created category
             // this.serviceList.unshift(res.data);
              this.displayedServiceList.unshift(res.data);

              this.addNewServiceToggle = false
              
              //reset form
              this.addServiceForm.reset()

              Swal.fire(res.message)

            } else {
    
              //if it is unable to add category data it will return an error
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

  //the following function will update service status based on parameteres recieved
  updateServiceStatus(currentService, serviceIndex, status) {

    this.assignServiceData( currentService, serviceIndex )

    let buttonText = ''
    
    if(status) {

      buttonText = 'Activate'

    } else {

      buttonText = 'Deactivate'

    }
    
    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, the selected service will change its status`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: buttonText
    
    })
    .then( (confirmation) => {
      
      if (confirmation.isConfirmed) {

        let data = {

          service_id: currentService.id,
          active: status

        }

        //now we will delete branch information from the database
        this._service.updateServiceStatus(data).subscribe({
    
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.serviceList[this.selectedServiceIndex].active = status
              this.displayedServiceList[this.selectedServiceIndex].active = status
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

  //the following functoin will open service details
  openServiceDetails(currentService, serviceIndex) {

    this.selectedService = currentService
    this.serviceDetailsToggle = true
    
  }

  //this will close service details popup
  closeServiceDetails() {

    this.serviceDetailsToggle = false
    this.unassignServiceData()

  }

  //the following funtcion will open add new category popup
  editService(currentService, serviceIndex) {

    this.assignServiceData( currentService, serviceIndex )
    console.log(this.selectedService)
    this.editServiceToggle = true

  }

  //the following function will close add new catgeory pop up
  closeEditService() {

    this.editServiceToggle = false
    this.unassignServiceData()
    this.editServiceForm.reset()

  }

  //the following function will update service and its data
  updateService() {

    //now we will assign the data of currentService to editServiceForm
    this.editServiceForm.patchValue(this.selectedService)

    //now owe will check if out form is valid or not
    if (this.editServiceForm.valid) {

      let editForm = this.editServiceForm.value
      let service_id = this.selectedService.id

      let serviceData = { 
        ...editForm,
        service_id: service_id      
      }
 
      //we will submit the data for update if it is valid
      this._service.updateService(serviceData).subscribe({
  
        next: ( res: any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            this.editServiceToggle = false
            
            //reset form
            this.editServiceForm.reset()

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

  //the following function will delete service from the database bases on the id
  deleteService( currentService, serviceIndex ) {

    
    this.assignServiceData( currentService, serviceIndex )
    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, service named "${currentService.title}" will be deleted`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete Service'
    
    })
    .then( (confirmation) => {
    
      if (confirmation.isConfirmed) {

        let data = {

          service_id: currentService.id

        }

        //now we will delete category information from the database
        this._service.deleteService(data).subscribe({
  
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.serviceList.splice(this.selectedServiceIndex, 1)
              this.displayedServiceList.splice(this.selectedServiceIndex, 1)
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

  //pagination
  setPage(pageNumber: number) {

    this.currentPage = pageNumber + 1 // Page numbers start from 1
    this.updateDisplayedServices();

  }

  // Update displayed services based on pagination
  updateDisplayedServices() {

    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage

    if (this.currentPage > this.totalPages) {

      this.currentPage = this.totalPages

    }

    this.displayedServiceList = this.serviceList.slice(startIndex, endIndex)

  }

  totalPageNumbers(): number[] {

    return Array(this.totalPages).fill(0).map((_, index) => index + 1)

  }
  
  updateImage( event, type, operation) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {

      const selectedFile = inputElement.files[0];
      // Now, you can call your image upload function with selectedFile.
      this.uploadImage(selectedFile, type, operation);

    }
  
  }

  //the following function will upload an image to the server
  uploadImage(selectedFile, type, operation) {

      this._appService.fileUploadImage( selectedFile ).subscribe( ( response: any ) => {

        if (response.status == APIResponse.Success) {
          
          let result = response.message

          if(operation === 'add') {

            if(type === 'icon') {

              this.addServiceForm.get('icon').patchValue(result)

            }

            if(type === 'image') {

              this.addServiceForm.get('cover_image').patchValue(result)

            }

            if(type === 'banner') {

              this.addServiceForm.get('banner').patchValue(result)

            }


          }
          
          if(operation === 'edit') {

            if(type === 'icon') {

              this.selectedService.icon = result

            }

            if(type === 'image') {

              this.selectedService.cover_image = result

            }

            if(type === 'banner') {

              this.selectedService.banner = result
              
            }

          }
        
        } 
      
      })

  }

  // Assuming you have a method to update the filtered list based on searchText
  updateDisplayedServiceList() {

    this.displayedServiceList = this.serviceList.filter(service =>
    
      service.name.toLowerCase().includes(this.searchText.toLowerCase())
    
    );
  }

}