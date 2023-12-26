import { Component, OnInit } from '@angular/core';
import { ServiceCategory } from 'src/model/common/service-category.model';
import { IndividualTest } from 'src/model/labTest/individual-test.model';
import { ServicePackage } from 'src/model/servicePackage/service-package.model';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { AlertType, APIResponse, FileUploadType } from 'src/utils/app-constants';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-employer-packagelist',
  templateUrl: './employer-packagelist.component.html',
  styleUrls: ['./employer-packagelist.component.css']
})
export class EmployerPackagelistComponent implements OnInit {

  typeValidationForm: FormGroup;
  individualTestList: IndividualTest[] = [];
  servicePackageList: ServicePackage[] = [];
  serviceCategories: ServiceCategory[] = [];
  selectedServiceCatagoryId: number;
  selectedTests: string[] = [];
  submit: boolean;
  isEditEnabled = false;
  selectedServicePackage : ServicePackage;
  modalTitle: string;
  selectedFile: File;

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    public formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.getServicePackages();
    this.getIndividualLabTests();
    this.getServicePackageCategories();
  }


  getServicePackages() {
    this._appService.getCorpServicePackages().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.servicePackageList = ServicePackage.getServicePackageListEmp(response);
        setTimeout(() => {
          this.drawPage();
        }, 2500)
      } else {
        console.log("Unable to get service packages");
      }
    }, err => {
      console.log("Unable to get service packages");
    });
  }


  getIndividualLabTests() {
    this._appService.getIndividualLabTestList().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.individualTestList = IndividualTest.getIndividualTestList(response);
      } else {
        console.log("Unable to get service tests");
      }
    }, err => {
      console.log("Unable to get service tests");
    });
  }


  // postNewLabPackageClicked() {
  //   var servicePrice = $('#servicePrice').val();
  //   var serviceName = $('#serviceName').val();
  //   var serviceNameArabic = $('#serviceNameArabic').val();
  //   var instructions = $('#instructions').val();
  //   var instructionsArabic = $('#instructionsArabic').val();
  //   var serviceDescription = $('#serviceDescription').val();

  //   let params = {
  //     "categoryId": this.selectedServiceCatagoryId,
  //     "sectorId": 1,
  //     "packagePrice": servicePrice,
  //     "packageName": serviceName,
  //     "packageNameArabic": serviceNameArabic,
  //     "instructions": instructions,
  //     "instructionsArabic": instructionsArabic,
  //     "packageDescription": serviceDescription,
  //     "packageDescriptionArabic": serviceDescription,
  //     "numberOfTestIncluded": this.selectedTests.length,
  //     "testIncluded": this.selectedTests.toString()
  //   }
  //   this.postLabPackageToServer(params);
  // }


  postLabPackageToServer() {
    $('#labpackages').DataTable().destroy();
    this.selectedTests = [];
    var selectedTests = $('#my-select').val();
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      selectedTests.forEach(selectedTest => {
        let testVals = selectedTest.split(':');
        if (testVals.length > 1) {
          this.selectedTests.push(testVals[1].trim());
        }
      });

      let params = this.typeValidationForm.value;
      params["testIncluded"] = this.selectedTests.toString();
      params["numberOfTestIncluded"] = this.selectedTests.length;
      params["sectorId"] = 1;

      if(this.isEditEnabled == true) {
        params["packageId"] = this.selectedServicePackage.packageId;
        if(this.selectedTests == null || this.selectedTests.length == 0) {
          params["testIncluded"] = this.selectedServicePackage.testsIncluded;
          params["numberOfTestIncluded"] = this.selectedServicePackage.noOfTestsIncluded;
        }
      } else {
        params["packageId"] = 0;
      }

      this._appService.createCorpServicePackage(params).subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
          this.onClickCloseModel();
          if (this.selectedFile != null) {
            this.uploadPackageLogo(response.packageId)
          } else {
            this.closeNewPackageView();
            this.getServicePackages();


            if(this.isEditEnabled) {
              Swal.fire(
                'Congratulations.',
                'lab package is updated successfully..!',
                'success'
              );
            } else {
              Swal.fire(
                'Congratulations.',
                'New lab package is posted successfully..!',
                'success'
              );
            }
          }
        } else {
          Swal.fire(
            'Error.',
            'Something went wrong. Please try again later..!',
            'error'
          );
        }
      }, err => {
        Swal.fire(
          'Error.',
          'Something went wrong. Please try again later..!',
          'error'
        );
      });
    }
  }

  uploadPackageLogo(sectorId) {
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.EmployeePackage, sectorId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        if(this.isEditEnabled) {
          Swal.fire(
            'Congratulations.',
            'lab package is updated successfully..!',
            'success'
          );
        } else {
          Swal.fire(
            'Congratulations.',
            'New lab package is posted successfully..!',
            'success'
          );
        }
      } else {
        Swal.fire(
          'Error.',
          'Something went wrong. Unable to upload the pacakge logo..!',
          'error'
        );
      }
      this.closeNewPackageView();
      this.getServicePackages();
    });
  }



  getServicePackageCategories() {
    this._appService.getServicePackageCategories().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.serviceCategories = ServiceCategory.getServicePackageCategories(response);
      } else {
        console.log("server error");
      }
    }, err => {
      console.log("server error");
    });
  }

  individualTestsSelected(event) {
    console.log(event.value, 'event.value');
    this.selectedTests = ['1', '2'];
  }

  serviceCategorySelected(event) {
    debugger;
    this.selectedServiceCatagoryId = event.target.value;
  }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });
    
    $('.onlyemployer').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-packages').addClass('active');
    $('#labpackages thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#labpackages thead');
    this.formValidation();
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.drawPage();
    // }, 2500)
    setTimeout(() => {
      $("#my-select").multiSelect({
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
    },2000);
  }

  showAddNewPackageView() {
    this.modalTitle = 'Add New Package';
    $('#my-select').multiSelect('deselect_all');
    $('#add_labPackage').show();
  }

  onClickCloseModel() {
    $('#add_labPackage').hide();
  }

  closeNewPackageView() {
    $('#add_labPackage').hide();
    this.clearForm();
  }




  drawPage() {
    $('#nav_employee_check').addClass('active');

    $('#myBtn_view').click(function () {
      $('#myModal_view').show();
    })
    $('.close').click(function () {
      $('#myModal_view').hide();
    })


    $("#file_package").on('change', function (e) {
      $('.pip').html('');
      var files = e.target.files;
      var file = files[0]
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        var file = e.target;
        $('<span class="pip">' + '<img class="imageThumb" src="' + e.target.result + '" />' + '<br/><span class="remove">Remove image</span>' + "</span>"
        ).insertAfter("#beforefilepreview");
        $(".remove").click(function () {
          $(this).parent(".pip").remove();
        });
      };
      fileReader.readAsDataURL(file);
    });



    var filterIndexes = [0,2, 3, 4];

    var table = $('#labpackages').DataTable({
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
              var cell = $('.filters th').eq(
                $(api.column(colIdx).header()).index()
              );
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="' + title + '" />');

              $(
                'input',
                $('.filters th').eq($(api.column(colIdx).header()).index())
              )
                .off('keyup change')
                .on('keyup change', function (e) {
                  e.stopPropagation();

                  // Get the search value
                  $(this).attr('title', $(this).val());
                  var regexr = '({search})'; //$(this).parents('th').find('select').val();

                  var cursorPosition = this.selectionStart;
                  // Search the column for that value
                  api
                    .column(colIdx)
                    .search(
                      this.value != ''
                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                        : '',
                      this.value != '',
                      this.value == ''
                    )
                    .draw();

                  $(this)
                    .focus()[0]
                    .setSelectionRange(cursorPosition, cursorPosition);
                });
            }
            else {
              var cell = $('.filters th').eq(
                $(api.column(colIdx).header()).index()
              );
              var title = $(cell).text();
              $(cell).html('<input type="hidden" />');
            }
          });
      },
    });


  }

  close() {
    $('#add_labPackage').hide();
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("labtechpackagelistForm")).reset();
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      "sectorId": 1,
      packageName: ['', [Validators.required]],
      packageNameArabic: ['', [Validators.required]],
      packagePrice: ['', [Validators.required]],
      instructions: ['', [Validators.required]],
      instructionsArabic: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      packageDescription: ['', [Validators.required]],
      packageDescriptionArabic: ['', [Validators.required]],
      numberOfTestIncluded: [''],
      testIncluded: [''],
    });
  }

  handleFileInput(event) {
    this.selectedFile = event.files.item(0);
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  labtechpackagelistEdit(packageId) {
    this.isEditEnabled = true;
    this.modalTitle = 'Edit Package';
    this.selectedServicePackage = this.servicePackageList.find(ServicePackage => ServicePackage.packageId == packageId);
    console.log(this.selectedServicePackage);
    if (this.selectedServicePackage != null) {
      this.typeValidationForm.patchValue({
        "sectorId": this.selectedServicePackage.serviceSectorId,
        packageName: this.selectedServicePackage.packageName,
        packageNameArabic: this.selectedServicePackage.packageNameArabic,
        packagePrice: this.selectedServicePackage.packagePrice,
        instructions: this.selectedServicePackage.instructions,
        instructionsArabic: this.selectedServicePackage.instructionsArabic,
        categoryId: this.selectedServicePackage.servicePackageCategoryId,
        packageDescription: this.selectedServicePackage.packageDescription,
        packageDescriptionArabic: this.selectedServicePackage.packageDescriptionArabic,
        numberOfTestIncluded: this.selectedServicePackage.noOfTestsIncluded,
        testIncluded: this.selectedServicePackage.testsIncluded,
      });

      $('#add_labPackage').show();
    }
  }


}
