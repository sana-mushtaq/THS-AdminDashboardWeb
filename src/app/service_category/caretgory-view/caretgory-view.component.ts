import { Component, OnInit } from '@angular/core'
import { Servicecategory } from 'src/model/dashboard/servicecategory.model'
import { APIResponse } from 'src/utils/app-enum'
import { ServicecategoryService } from 'src/service/servicecategory.service'
import Swal from 'sweetalert2'
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
  selector: 'app-caretgory-view',
  templateUrl: './caretgory-view.component.html',
  styleUrls: ['./caretgory-view.component.css']
})

export class CaretgoryViewComponent implements OnInit {
  
  //create a variable categoryList of type array
  categoryList: Servicecategory [] = []

  //category action toggles
  addNewCategoryToggle: boolean = false
  editCategoryToggle: boolean = false

  //this will be used for the currently selected service on frontend
  selectedCategory: Servicecategory = {
    id: -1,
    title: '',
    title_arabic: '',
    icon: '',
    image: '',
    banner: '',
    active: false
    }
  
  selectedCategoryIndex: number = -1

  // forms
  public addCategoryForm : FormGroup
  public editCategoryForm : FormGroup

  constructor(
    private _serviceCategory: ServicecategoryService,
    private fb : FormBuilder
  ) { 

    this.getCategoryList()

    //now we will initialize service category form
    this.addCategoryForm = this.editCategoryForm =this.fb.group({
      
      title: ['', [ Validators.required]],
      title_arabic: ['', [ Validators.required]],
      icon: [''],
      image: [''],
      banner: [''],
      active: [false]

    })

  }

  ngOnInit(): void {
  }

  //the following function will initialize selected category and its data
  assignCategoryData (currentCategory, categoryIndex) {

    this.selectedCategory = currentCategory
    this.selectedCategoryIndex = categoryIndex

  } 

  //the following function will un-initialize selected category and its data
  unassignCategoryData () {

    this.selectedCategory = {
      id: -1,
      title: '',
      title_arabic: '',
      icon: '',
      image: '',
      banner: '',
      active: false
    }
    this.selectedCategoryIndex = -1

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

  //the following funtcion will open add new category popup
  addCategory() {

    this.addNewCategoryToggle = true

  }

  //the following function will close add new catgeory pop up
  closeAddCategory() {

    this.addNewCategoryToggle = false
    this.addCategoryForm.reset()

  }

  //this will trigger edit edit category popup and assign current category informtaion to selectedCategory
  editCategory( currentCategory, index ) {
  
    this.assignCategoryData( currentCategory, index )
    this.editCategoryToggle = true

  }

  //this will  reset the category data 
  closeEditCategory() {

    this.unassignCategoryData()
    this.editCategoryToggle = false
    this.editCategoryForm.reset()

  }

  //the following function will create a category in the backend
  createCategory() {

    //now owe will check if out form is valid or not
    if (this.addCategoryForm.valid) {

      //we will submit the data if it is valid
      this._serviceCategory.createCategory(this.addCategoryForm.value).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            //when the service is created the system should return an id of the newly created category
            this.categoryList.push(res.data)
            this.addNewCategoryToggle = false
            
            //reset form
            this.addCategoryForm.reset()

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

  //the following function will update category data
  async updateCategory() {

    //now we will assign the data of currentCategory to editCategoryForm
    this.editCategoryForm.patchValue(this.selectedCategory)

    //now owe will check if out form is valid or not
    if (this.editCategoryForm.valid) {

      let editForm = this.editCategoryForm.value
      let category_id = this.selectedCategory.id

      let categoryData = { 
        ...editForm,
        category_id: category_id      
      }

      
      //we will submit the data for update if it is valid
      this._serviceCategory.updateCategory(categoryData).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            this.editCategoryToggle = false
            
            //reset form
            this.editCategoryForm.reset()

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

  //the following function will delete category from the service_category table
  deleteCategory(currentCategory, categoryIndex) {

    this.assignCategoryData( currentCategory, categoryIndex )
    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, this branch "${currentCategory.title}" will be deleted`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete category'
    
    })
    .then( (confirmation) => {
    
      if (confirmation.isConfirmed) {

        let data = {

          category_id: currentCategory.id

        }

        //now we will delete category information from the database
        this._serviceCategory.deleteCategory(data).subscribe({
  
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.categoryList.splice(this.selectedCategoryIndex, 1)
              this.unassignCategoryData()
              
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

  //the following function will update category status based on parameteres recieved
  updateCategoryStatus(currentCategory, categoryIndex, status) {

    this.assignCategoryData( currentCategory, categoryIndex )

    let buttonText = ''
    
    if(status) {

      buttonText = 'Activate'

    } else {

      buttonText = 'Deactivate'

    }
    
    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, the selected category will change its status`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: buttonText
    
    })
    .then( (confirmation) => {
      
      if (confirmation.isConfirmed) {

        let data = {

          category_id: currentCategory.id,
          active: status

        }

        //now we will delete branch information from the database
        this._serviceCategory.updateCategoryStatus(data).subscribe({
    
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.categoryList[this.selectedCategoryIndex].active = status
              this.unassignCategoryData()
              
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

}
