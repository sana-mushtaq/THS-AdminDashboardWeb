import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core'
import { APIResponse } from 'src/utils/app-enum'
import Swal from 'sweetalert2'
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { AppService } from 'src/service/app.service'
import { environment } from 'src/environments/environment'
import { ServicetagService } from 'src/service/servicetag.service'

@Component({
  selector: 'app-servicetag',
  templateUrl: './servicetag.component.html',
  styleUrls: ['./servicetag.component.css']
})
export class ServicetagComponent implements OnInit {

  public serverUrl : string = environment.domainName

  //create a variable categoryList of type array
  tagList: any = []
  //category action toggles
  addNewTagToggle: boolean = false
  editTagToggle: boolean = false

  //this will be used for the currently selected category on frontend
  selectedTag: any = {
    id: -1,
    title: '',
    title_arabic: '',
  }

  selectedTagIndex: number = -1

  // forms
  public addTagForm : FormGroup
  public editTagForm : FormGroup

  constructor(
    private _serviceTag: ServicetagService,
    private fb : FormBuilder,
    private renderer: Renderer2,
    private _appService: AppService,
  ) { 

    this.getTagList()
    //this.getSubCategoryList()

    //now we will initialize service category form
    this.addTagForm = this.editTagForm =this.fb.group({
      
      title: ['', [ Validators.required]],
      title_arabic: ['', [ Validators.required]],

    })

  }

  ngOnInit(): void {

    $('#nav_settings').addClass('active');
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    
  }

  //the following function will initialize selected category and its data
  assignTagData (currentCategory, categoryIndex) {

    this.selectedTag = currentCategory
    this.selectedTagIndex = categoryIndex

  } 

  //the following function will un-initialize selected category and its data
  unassignTagData () {

    this.selectedTag = {
      id: -1,
      title: '',
      title_arabic: '',
    }

    this.selectedTagIndex = -1

  } 

  //the following function will fetch category list
  getTagList() {

   //now we will get a list of categories from the backend
   this._serviceTag.getTagList().subscribe({
   
    next : ( res : any ) => {

      //in case of success the api returns 0 as a status code
      if( res.status === APIResponse.Success) {

        this.tagList = res.data

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
  addTag() {

    this.addNewTagToggle = true

  }

  //the following function will close add new catgeory pop up
  closeAddTag() {

    this.addNewTagToggle = false
    this.addTagForm.reset()

  }
  //this will trigger edit edit category popup and assign current category informtaion to selectedCategory
  editTag( currentCategory, index ) {
  
    this.assignTagData( currentCategory, index )
    this.editTagToggle = true

  }

  //this will  reset the category data 
  closeEditTag() {

    this.unassignTagData()
    this.editTagToggle = false
    this.editTagForm.reset()

  }

  //the following function will create a category in the backend
  createTag() {

    //now owe will check if out form is valid or not
    if (this.addTagForm.valid) {

      //we will submit the data if it is valid
      this._serviceTag.createTag(this.addTagForm.value).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            //when the service is created the system should return an id of the newly created category
            this.tagList.push(res.data)
            this.addNewTagToggle = false
            
            //reset form
            this.addTagForm.reset()

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
  async updateTag() {

    //now we will assign the data of currentCategory to editCategoryForm
    this.editTagForm.patchValue(this.selectedTag)

    //now owe will check if out form is valid or not
    if (this.editTagForm.valid) {

      let editForm = this.editTagForm.value
      let tag_id = this.selectedTag.id

      let categoryData = { 
        ...editForm,
        tag_id: tag_id      
      }

      
      //we will submit the data for update if it is valid
      this._serviceTag.updateTag(categoryData).subscribe({
  
        next : ( res : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success ) {

            this.editTagToggle = false
            
            //reset form
            this.editTagForm.reset()

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
  deleteTag(currentCategory, categoryIndex) {

    this.assignTagData( currentCategory, categoryIndex )
    Swal.fire({

      title: 'Confirmation',
      text: `By confirming yes, a tag named "${currentCategory.title}" will be deleted`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0144e4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete tag'
    
    })
    .then( (confirmation) => {
    
      if (confirmation.isConfirmed) {

        let data = {

          tag_id: currentCategory.id

        }

        //now we will delete category information from the database
        this._serviceTag.deleteTag(data).subscribe({
  
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //now we will splice the branch data from array
              this.tagList.splice(this.selectedTagIndex, 1)
              this.unassignTagData()
              
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