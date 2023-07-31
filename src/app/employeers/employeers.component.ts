import { Component, OnInit } from "@angular/core";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { Employeer } from "src/model/common/employeer-modal";
import { ServicePackage } from "src/model/servicePackage/service-package.model";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AlertType, APIResponse, PractiseUserRoles, FileUploadType } from "src/utils/app-constants";
import { EmployerCheckService } from "src/service/employerCheck.service";
import Swal from "sweetalert2";
declare var $: any;


@Component({
  selector: "app-employeers",
  templateUrl: "./employeers.component.html",
  styleUrls: ["./employeers.component.css"],
})
export class EmployeersComponent implements OnInit {
  typeValidationForm: FormGroup;
  private selectedFile: any = null;
  imgPreview;
  modalTitle;
  ServiceCorpPackage;
  EmployeerList: Employeer[] = [];
  EmployeerDetails;
  selectedPackage;
  selectedLabs;
  LabLists;
  public isEditing : boolean = false;
  public dataTable : any;

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder, private empCheckService : EmployerCheckService) {
    this.getCorpServicePackages();
    this.getEmployeerList();
    this.getLabListData();
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      employeerId: 0,
      employeerAccessCode: "",
      employeerName: ["", [Validators.required]],
      employeerNameArabic: ["", [Validators.required]],
      contactPersonName: ["", [Validators.required]],
      contactPersonNameArabic: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      email: ["", [Validators.required]],
      address: ["", [Validators.required]],
      website: ["", [Validators.required]],
      packagesSelected: [""],
      labsSelected:[""],
    });
  }
  get type() {
    return this.typeValidationForm.controls;
  }

  EmployeeModalSubmit() {}
  handleFileInput(event) {
    this.selectedFile = event.files.item(0);
    if (event.files && event.files[0]) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.imgPreview = reader.result);
      reader.readAsDataURL(file);
    }
    // reader.readAsDataURL(this.selectedFile);
  }
  onClickCloseModel() {
    $("#add_employee").hide();
  }
  close() {
    $("#add_employee").hide();
  }

  getLabListData() {
    this._appService.getServiceProviderList().subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == APIResponse.Success) {
          this.LabLists = response.serviceProviderList;
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log("Unable to get appointments");
      }
    );
  }
  
  getCorpServicePackages() {
    this._appService.getCorpServicePackages().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.ServiceCorpPackage = ServicePackage.getServicePackageListEmp(response);
          // setTimeout(() => {
          //   $("#my-select").multiSelect();
          // }, 1000);
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log("Unable to get appointments");
      }
    );
  }
  

  createNewEmployeer() {
    if ( this.typeValidationForm.invalid ) {
      this.typeValidationForm.markAllAsTouched();
      return;
    }

    let fd : FormData = new FormData();
    fd.append( "data", JSON.stringify( this.typeValidationForm.value ) );

    if( this.selectedFile ){
      fd.append( "file", this.selectedFile, this.selectedFile.name );
    }

    this.empCheckService.createEmployer( fd ).subscribe({
      next : ( res : any ) => {
        Swal.fire( 'Success', res.message, 'success' );
        this.getEmployeerList();
        this.onClickCloseModel();
      },
      error: ( err : any ) => { Swal.fire( 'Error', err.error.message, 'error' ); }
    });

    return;
    //$("#employers_table").DataTable().destroy();
    this.selectedPackage = [];
    var selectedTests = $("#my-select").val();
    if (this.typeValidationForm.invalid) {
      return;
    }
    selectedTests.forEach((selectedTest) => {
      let testVals = selectedTest.split(":");
      if (testVals.length > 1) {
        this.selectedPackage.push(testVals[1].trim());
      }
    });

    //GET SELECTED LABS VALUES
    this.selectedLabs = [];
    var selectedLabs = $("#my-select1").val();
    selectedLabs.forEach((selectedLab) => {
      let testVals = selectedLab.split(":");
      if (testVals.length > 1) {
        this.selectedLabs.push(testVals[1].trim());
      }
    });
    //END OF SELECTED LABS VALUES

    let params = this.typeValidationForm.value;
    params["packagesSelected"] = this.selectedPackage.toString();
    params["labsSelected"] = this.selectedLabs.toString();

    this._appService.createNewEmployeer(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire("Success.", "New Employee created successfully..!", "success");
          this.uploadLabImage(response.employeerId);
          this.getEmployeerList();
          this.onClickCloseModel();
          // setTimeout(() => {
          //   this.tableDraw();
          // }, 2000);
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log("Unable to get appointments");
      }
    );
  }
  uploadLabImage(employeerId) {
    // alert("Working");
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.Employee, employeerId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        // Swal.fire("Congratulations.", "New promotion has been created successfully..!", "success");
        // Swal.fire("Congratulations.", "New promotion has been created successfully..!", "success");
        this.getEmployeerList();
      } else {
        // this.closeNewServiceView();
        Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
      }
    });
  }

  ngOnInit(): void {
    this.modalTitle = "Add Employer";
    this.formValidation();
    $(".onlyemployer").removeClass("dclass");
    $(".onlyadmin").removeClass("dclass");
    $(".active-employers").addClass("active");
    $("#employers_table thead tr").clone(true).addClass("filters").appendTo("#employers_table thead");

    $("#files_department").on("change", function (e) {
      $(".pip").html("");
      var files = e.target.files;
      var file = files[0];
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        var file = e.target;
        $(
          '<span class="pip">' + '<img class="imageThumb" src="' + e.target.result + '" />' + '<br/><span class="remove">Remove image</span>' + "</span>"
        ).insertAfter("#beforefilepreview");
        $(".remove").click(function () {
          $(this).parent(".pip").remove();
        });
      };
      fileReader.readAsDataURL(file);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      //this.tableDraw();

        if(this.selectedPackage != null) {
          var $select1 = $("#my-select1");              
          var i=0;
          for(i=0;i<$select1[0].length;i++){
            // console.log($select1[0].children[i].value);
            if(this.selectedPackage.includes($select1[0].children[i].value)){
              $select1[0].children[i].selected = true;
            }
          }
        }
        if(this.selectedLabs != null) {
          var $select2 = $("#my-select2");              
          var j=0;
          for(j=0;j<$select2[0].length;j++){
            // console.log($select1[0].children[i].value);
            if(this.selectedLabs.includes($select2[0].children[j].value)){
              $select2[0].children[j].selected = true;
            }
          }
        }
    }, 2500);
  }

  tableDraw() {
    var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

    this.dataTable = $("#employers_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            if ($.inArray(colIdx, filterIndexes) != -1) {
              // Set the header cell to contain the input element
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

              // On every keypress in this input
              $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
                .off("keyup change")
                .on("keyup change", function (e) {
                  e.stopPropagation();

                  // Get the search value
                  $(this).attr("title", $(this).val());
                  var regexr = "({search})"; //$(this).parents('th').find('select').val();

                  var cursorPosition = this.selectionStart;
                  // Search the column for that value
                  api
                    .column(colIdx)
                    .search(this.value != "" ? regexr.replace("{search}", "(((" + this.value + ")))") : "", this.value != "", this.value == "")
                    .draw();

                  $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
                });
            } else {
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="hidden" />');
            }
          });
      },
    });
  }

  // Get Employer List
  getEmployeerList() {
    $("#employers_table").DataTable()?.destroy();

    this.empCheckService.getEmployerList().subscribe({
      next : ( res : any ) => { 
        this.EmployeerList = Employeer.getEmployeerList( res );
        setTimeout(() => {
          this.tableDraw();
        }, 500);
      },
      error: ( err : any ) => {
        Swal.fire( 'Error', err.error.message, 'error' );
      } 
    });
  }

  onReset(){
    this.formValidation();
    this.isEditing = false;
    this.selectedFile = null;
    this.initMultiSelect();
  }

  // On Edit Employer Get Details
  EmployeerEdit( empid : any) {
    
    this.initMultiSelect();
    this.modalTitle = "Edit Employer";
    this.isEditing = true;
    this.selectedFile = null;
    
    this.empCheckService.getSingleEmployer( empid ).subscribe({
      next : ( res : any ) => { 
        this.EmployeerDetails = res.employeeDetails;

        let pkgIds : Array<any> = this.EmployeerDetails.optedPackageIds;
        let labIds : Array<any> = this.EmployeerDetails.optedLabIds;

        this.typeValidationForm.patchValue({
          employeerId :  this.EmployeerDetails.employeerId,
          employeerName: this.EmployeerDetails.employeerName,
          employeerNameArabic: this.EmployeerDetails.employeerNameArabic,
          contactPersonName: this.EmployeerDetails.contactPersonName,
          contactPersonNameArabic: this.EmployeerDetails.contactPersonNameArabic,
          mobile:this.EmployeerDetails.mobile,
          email: this.EmployeerDetails.email,
          address: this.EmployeerDetails.address,
          website:this.EmployeerDetails.website,
          employeerAccessCode: this.EmployeerDetails.employeerAccessCode,    
          labsSelected: labIds,  
          packagesSelected: pkgIds,  
        });

        this.imgPreview = this.EmployeerDetails.logoPath;
        // Open Modal
        ( $(".edit-employer") as any ).click();
      },
      error: ( err : any ) => { 
        Swal.fire('Error', err.error.message, 'error');
      }
    });
  }

  // Update Employer
  onUpdateEmployer(){
    if (this.typeValidationForm.invalid) {
      return;
    }

    let fd : FormData = new FormData();
    fd.append( "data", JSON.stringify( this.typeValidationForm.value ) );

    if( this.selectedFile ){
      fd.append( "file", this.selectedFile, this.selectedFile.name );
    }

    this.empCheckService.updateEmployer( fd ).subscribe({
      next : ( res : any ) => {
        Swal.fire('Success', res.message, 'success');
        // hide Modal
        $("#add_employee").hide();
        this.getEmployeerList();
      },
      error: ( err : any ) => { Swal.fire('Error', err.error.message, 'error'); }
    });
  }

  initMultiSelect(){
    $("#my-select, #my-select1").multiSelect('destroy');
    setTimeout(() => {
      $("#my-select, #my-select1").multiSelect({
        selectableHeader: "<input type='text' class='search-input form-control mb-3' autocomplete='off' placeholder='Search by Name or Keyword'>",
        selectionHeader: "<input type='text' class='search-input form-control mb-3' autocomplete='off' placeholder='Search by Name or Keyword'>",
        afterInit: function(ms){
          var that = this,
              $selectableSearch = that.$selectableUl.prev(),
              $selectionSearch = that.$selectionUl.prev(),
              selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
              selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';
      
          that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
          that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
        },
        afterSelect: function(){
          this.qs1.cache();
          this.qs2.cache();
        },
        afterDeselect: function(){
          this.qs1.cache();
          this.qs2.cache();
        }
      });
    }, 1000);
  }
}
