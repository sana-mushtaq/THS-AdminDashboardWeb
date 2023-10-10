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
import { ServicetagService } from 'src/service/servicetag.service'
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css']
})

export class ServiceViewComponent implements OnInit {

  public serverUrl : string = environment.domainName

  //create a variable categoryList of type array
  categoryList: Servicecategory [] = []
  tagList: any = []
  tagSettings: IDropdownSettings = {}
  tagListRenderer: boolean = false
  selectedServiceTags: any = []
  //create a variable serviceList of type array
  serviceList: any = []
  serviceListMultiDropdown: any = []

  addNewServiceToggle: boolean = false
  addNewServiceVariantToggle: boolean = false

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
    top: false,
    tag: {}

  }
  
  selectedServiceIndex: number = -1

  // forms
  public addServiceForm : FormGroup
  public addServiceVariantForm : FormGroup
  public editServiceForm : FormGroup

  //pagination
  itemsPerPage: number = 25 // Number of items to display per page
  currentPage: number = 1 // Current page number
  displayedServiceList:any = [] // To hold services for the current page
  // Calculate the total number of pages
  totalItems: number = this.serviceList.length
  totalPages: number = Math.ceil(this.totalItems / this.itemsPerPage)
  searchText: string = '';
  serviceSettings: IDropdownSettings = {}

  service_variants: any = []

  currentServiceVariantsToggle: boolean = false 
  currentServiceVariants: any = []

  constructor(
    private _serviceCategory: ServicecategoryService,
    private _service: ServiceService,
    private fb : FormBuilder,
    private _appService: AppService,
    private _serviceTag: ServicetagService,
  ) { 

    this.getCategoryList()
    this.getTagList()
    this.getServiceList()

    this.serviceSettings = {
      idField: 'id',
      textField: 'title_arabic',
      allowSearchFilter: true,
      singleSelection: true, // Set to true for single selection
      enableCheckAll: false,
    }

    this.addServiceForm = this.editServiceForm = this.fb.group({
     
      'category_id' : ['', [ Validators.required]],
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
      'top': [0],
      'tag': ['']

    })

    this.addServiceVariantForm = this.fb.group({
     
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
      'top': [0],
      'tag': [''],
      'primary_service_id': ['', Validators.required],

    })

    //this will be used for dropdown settings
    this.tagSettings = {
      idField: 'id',
      textField: 'title',
      allowSearchFilter: true
    }

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

  //the following function will fetch category list
  getTagList() {

    //now we will get a list of categories from the backend
    this._serviceTag.getTagList().subscribe({
    
      next : ( res : any ) => {
  
        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
  
          this.tagList = res.data
          this.tagListRenderer = true
  
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
      top: false,
      tag: {}
    
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

            this.service_variants = this.serviceList.filter(service => {

              return service.primary_service_id !== null

            })

            this.serviceList = this.serviceList.filter(service => {

              return service.primary_service_id === null

            })

            this.serviceListMultiDropdown = this.serviceList.filter(service => {

              return service.active === 1

            })

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
    this.selectedServiceTags = []
  }

  addServiceVariant() {

    this.addNewServiceVariantToggle = true

  }

  closeAddServiceVariant() {
    
    this.addNewServiceVariantToggle = false
    //this.addServiceForm.reset()
    this.selectedServiceTags = []

  }

  //the following function will create a service
  createService() {

     //now owe will check if out form is valid or not
     if (this.addServiceForm.valid) {

        this.addServiceForm.get('tag').patchValue(JSON.stringify(this.selectedServiceTags))

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

              this.selectedServiceTags = []
              
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

              if(!status) {

                this.deactivateServiceVariants(currentService.id)

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

    })

  }

  deactivateServiceVariants(serviceId) {

    this.service_variants.forEach(s => {

      if(s.primary_service_id === serviceId)
        {

          s.active = false

        }

    })

  }

  updateServiceVariantStatus(currentService, serviceIndex, status) {
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
              this.currentServiceVariants[this.selectedServiceIndex].active = status
             
             let s_v = this.service_variants.findIndex(s=>{

              return s.id === currentService.id

            })

            if(s_v >-1) {

              this.service_variants[s_v].active = status

            }
            
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
    this.editServiceToggle = true

    let tags = JSON.parse(currentService.tag) || []
    if(tags && tags.length>0) {
      tags.forEach(t=> {
        this.tagList.filter(tagItem => {
          if(tagItem.id === t) {

            this.selectedServiceTags.push(tagItem)

          }

        })
      
      })
    }
  }

  //the following function will close add new catgeory pop up
  closeEditService() {

    this.editServiceToggle = false
    this.unassignServiceData()
    this.editServiceForm.reset()
    this.selectedServiceTags = []

  }

  //the following function will update service and its data
  updateService() {

    //now we will assign the data of currentService to editServiceForm
    this.editServiceForm.patchValue(this.selectedService)

    this.editServiceForm.get('tag').patchValue(JSON.stringify(this.selectedServiceTags))


    this.selectedService['tag'] = JSON.stringify(this.selectedServiceTags)
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
            this.selectedServiceTags = []

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
              
              let filter= this.serviceList.filter(s=>{return s.id===currentService.id})

              if(filter.length>0){

                this.serviceList.splice(this.selectedServiceIndex, 1)

                this.displayedServiceList = this.serviceList
    
                this.unassignServiceData()
                
                Swal.fire(res.message)
  

              } else {

                let filter1= this.service_variants.filter(s=>{return s.id===currentService.id})
                if(filter1.length>0){

                  this.currentServiceVariants.splice(this.selectedServiceIndex,1)

                  this.service_variants = this.service_variants.filter(s=>{return s.id!==currentService.id})
                  this.unassignServiceData()
                  Swal.fire(res.message)
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

   //the following function will be executed when service provider will be selected
  onTagSelect(item: any) {

    let id = item.id
    this.selectedServiceTags.push(id)
    

    for (let i = this.selectedServiceTags.length - 1; i >= 0; i--) {
      const element = this.selectedServiceTags[i];

      // Check if the element is an object or contains an "id" attribute
      if (element && typeof element === 'object' && 'id' in element) {
        // Remove the element from the array
        this.selectedServiceTags.splice(i, 1);
        i++;
        if(!this.selectedServiceTags.includes(element.id)) {
          this.selectedServiceTags.push(element.id)

      }
    }
  }


  }

  //the following function will be executed when service provider will be deselected
  onTagDeSelect(item: any) {

    this.selectedServiceTags = this.selectedServiceTags.filter(i => i !== item.id)

  }

  //the following function will be executed when all services will be selected
  onTagSelectAll(item: any) {

    this.selectedServiceTags = item.map( i=> {

      return i.id

    })

        

    for (let i = this.selectedServiceTags.length - 1; i >= 0; i--) {
      const element = this.selectedServiceTags[i];

      // Check if the element is an object or contains an "id" attribute
        // Check if the element is an object or contains an "id" attribute
        if (element && typeof element === 'object' && 'id' in element) {
          // Remove the element from the array
          this.selectedServiceTags.splice(i, 1);
          i++;
          if(!this.selectedServiceTags.includes(element.id)) {
            this.selectedServiceTags.push(element.id)
  
        }
      }
    }

  }

  //the following function will be executed when all services will be desleetced
  onTagDeSelectAll() {

    this.selectedServiceTags = []

  }

  setPreferredService(item) {

    this.addServiceVariantForm.get('primary_service_id').patchValue(item.id)

    let category_id = this.serviceList.filter(sid=>{

      return sid.id === item.id

    })

    if(category_id.length>0) {

      this.addServiceVariantForm.get('category_id').patchValue(category_id[0].category_id)

    }

  }

  unsetPreferredService(item) {

    this.addServiceVariantForm.get('primary_service_id').patchValue('')
    this.addServiceVariantForm.get('category_id').patchValue('')
  }
  
  updateImageVraint( event, type, operation) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {

      const selectedFile = inputElement.files[0];
      // Now, you can call your image upload function with selectedFile.
      this.uploadImageVariant(selectedFile, type, operation);

    }
  
  }

  //the following function will upload an image to the server
  uploadImageVariant(selectedFile, type, operation) {

      this._appService.fileUploadImage( selectedFile ).subscribe( ( response: any ) => {

        if (response.status == APIResponse.Success) {
          
          let result = response.message

          if(operation === 'add') {

            if(type === 'icon') {

              this.addServiceVariantForm.get('icon').patchValue(result)

            }

            if(type === 'image') {

              this.addServiceVariantForm.get('cover_image').patchValue(result)

            }

            if(type === 'banner') {

              this.addServiceVariantForm.get('banner').patchValue(result)

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

  //the following function will create a service variant
  createServiceVariant() {

    console.log(this.addServiceVariantForm.value)
    //now owe will check if out form is valid or not
    if (this.addServiceVariantForm.valid) {
     
       this.addServiceVariantForm.get('tag').patchValue(JSON.stringify(this.selectedServiceTags))

       //we will submit the data if it is valid
       this._service.createServiceVariant(this.addServiceVariantForm.value).subscribe({
   
         next : ( res : any ) => {
   
           //in case of success the api returns 0 as a status code
           if( res.status === APIResponse.Success ) {

              let category_id = this.addServiceVariantForm.get('category_id').value

              let categoryName = this.categoryList.filter(el => { return Number(el.id) === Number(category_id) })
              res.data['category_title'] = categoryName[0].title

              //when the service is created the system should return an id of the newly created category
              // this.serviceList.unshift(res.data);
              this.service_variants.push(res.data);
              this.addNewServiceVariantToggle = false

              this.selectedServiceTags = []
              
              //reset form
              this.addServiceVariantForm.reset()

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

  checkIfVariantExists(service_id) {

    let filter = this.service_variants.filter(variant => {

      return Number(variant.primary_service_id) === Number(service_id)

    })

    if(filter.length>0) {

      return true

    } else {

      return false

    }

  }

  openVariants(service_id) {

    this.currentServiceVariants = this.service_variants.filter(variant => {

      return variant.primary_service_id === service_id

    });

    this.currentServiceVariantsToggle = true 
  }

  closeVariants() {

    this.currentServiceVariantsToggle = false 

    this.currentServiceVariants = []

  }

  getTag(tag) {

    let tags = JSON.parse(tag) || []

    let tagTitle = []

    if(tags && tags.length>0) {
    
      tags.forEach(t=> {
        this.tagList.filter(tagItem => {
    
          if(tagItem.id === t) {

            tagTitle.push(tagItem.title)

          }

        })
      
      })

    }

    return tagTitle

  }

}