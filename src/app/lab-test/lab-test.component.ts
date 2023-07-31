import { Component, OnInit } from '@angular/core';
import { ServiceCategory } from 'src/model/common/service-category.model';
import { IndividualTest } from 'src/model/labTest/individual-test.model';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { AlertType, APIResponse } from 'src/utils/app-constants';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import Swal from 'sweetalert2';
declare var $: any;
// declare let Swal: any;

@Component({
  selector: 'app-lab-test',
  templateUrl: './lab-test.component.html',
  styleUrls: ['./lab-test.component.css']
})

export class LabTestComponent implements OnInit {
  typeValidationForm: FormGroup;
  individualTestList;
  individualMainTestList : IndividualTest[] =[];
  serviceCategories: ServiceCategory[] = [];
  selectedServiceCatagoryId: number;
  submit: boolean;
  isEditEnabled = false;
  modalTitle: string;
  selectedIndividualTest : IndividualTest;
  activeLabTestList;
  inactiveLabTestList;
  

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    public formBuilder: FormBuilder
  ) {
    this.getIndividualLabTests();
    this.getMainIndividualLabTests();
    this.getIndividualLabTestCategories();
  }



  getIndividualLabTests() {
    var param ={
      "serviceType": 2
    }
    this._appService.getProviderOptedServices(param).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.individualTestList = response.serviceList;
        // console.log(this.individualTestList);
      } else {
        console.log("server error");
      }
    }, err => {
      console.log("server error");
    });

  }

  getMainIndividualLabTests() {
    this._appService.getProviderLabTests().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.individualMainTestList = IndividualTest.getIndividualTestList(response);
        this.activeLabTestList = this.individualMainTestList.filter((appointment) => appointment.isActive == 1);
        this.inactiveLabTestList =this.individualMainTestList.filter((appointment) => appointment.isActive == 0);

      } else {
        console.log("server error");
      }
    }, err => {
      console.log("server error");
    });

  }

  addCustomizePrice() {
    $("#testtable").DataTable().destroy();
    if (this.typeValidationForm.invalid) {
        // alert("working");
        return;
    }
    let params = this.typeValidationForm.value;
    // console.log(params);
    params["sectorId"] = 1;
    params["serviceType"] = 2;
    this._appService.optNewService(params).subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
            this.getIndividualLabTests();
            setTimeout(() => {
              this.drawPage();
            }, 1500);
            this.close();
            Swal.fire("Success.", "Service Updated successfully..!", "success");
          }else {
            Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
    });   
  }

  fetchPrice(e) {
    let servicapackage = [...this.individualMainTestList];
    servicapackage.filter((val, index) => {
      // console.log(val.servicePackageCategoryId);
      if (val.serviceId == e.target.value) {
        $("#taib_price").val(val.servicePrice);
      }
    });
  }

  postLabTestToServer() {
    
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      var params = this.typeValidationForm.value;

      if(this.isEditEnabled == true) {
        params["serviceId"] = this.selectedIndividualTest.serviceId;
      } else {
        params["serviceId"] = 0;
      }

      this._appService.postNewLabTest(params).subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
          if(this.isEditEnabled) {
            Swal.fire(
              'Congratulations.',
              'Lab test has been updated successfully..!',
              'success'
            );
          } else {
            Swal.fire(
              'Congratulations.',
              'New lab test has been created successfully..!',
              'success'
            );
          }
          $('#add_labtest').hide();
          this.getIndividualLabTests();
        } else {
          Swal.fire(
            'Error.',
            'Unable to create lab test. Please try again later..!',
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


  getIndividualLabTestCategories() {
    this._appService.getIndividualTestCategories().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.serviceCategories = ServiceCategory.getLabServiceCategories(response);
      } else {
        console.log("server error");
      }
    }, err => {
      console.log("server error");
    });
  }


  serviceCategorySelected(event) {
    this.selectedServiceCatagoryId = event.target.value;
  }

  ngOnInit(): void {
    $('.onlylabmenu').removeClass('dclass');
    this.formValidation();
    //$('#testtable_active thead tr').clone(true).addClass('filters').appendTo('#testtable_active thead');
    //$('#testtable_inactive thead tr').clone(true).addClass('filters').appendTo('#testtable_inactive thead');

    $('.nav-link').click(function() {
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500)

  }

  showAddNewTestView() {
    this.isEditEnabled = false;
    this.modalTitle = 'Add New Lab Test';
    $('#add_labtest').show();
  }

  onClickCloseModel() {
    $('#customize_labtest').hide();
    $("#taib_price").val("");
  }



  drawPage() {
    $('#nav_nurse').addClass('active');

    $('#el_input').hide();


    var filterIndexes = [0, 1, 2, 3,4];

    var table = $('#testtable_inactive').DataTable({
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
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

              // On every keypress in this input
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

    var table = $('#testtable_active').DataTable({
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
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

              // On every keypress in this input
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
    $('#customize_labtest').hide();
    $("#taib_price").val("");
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("testForm")).reset();
  }



  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      sectorId: 1,
      serviceType: 2,
      serviceId: ['', [Validators.required]],
      customPrice: ['', [Validators.required]]
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  edittest(serviceId) {
    this.isEditEnabled = true;
    this.modalTitle = 'Edit Lab Test';
    this.selectedIndividualTest = this.individualTestList.find(IndividualTest => IndividualTest.serviceId == serviceId);

    if (this.selectedIndividualTest != null) {
      this.typeValidationForm.patchValue({
        serviceName: this.selectedIndividualTest.serviceName,
        serviceNameArabic: this.selectedIndividualTest.serviceNameArabic,
        servicePrice: this.selectedIndividualTest.servicePrice,
        serviceDescription: this.selectedIndividualTest.serviceDescription,
        serviceDescriptionArabic: this.selectedIndividualTest.serviceDescriptionArabic,
        instructions: this.selectedIndividualTest.instructions,
        instructionsArabic: this.selectedIndividualTest.instructionsArabic,
        categoryId: this.selectedIndividualTest.serviceCategoryId,
      });
    }
    $('#add_labtest').show();
  }
  activerequests() {
    $(".in_ac_cards").hide();
    $(".active_card_space").show();
  }
  closedrequests() {
    $(".in_ac_cards").hide();
    $(".inactive_card_space").show();
  }
  statusChange(packageid,isActive) {
    isActive = (isActive == 1) ? 2 : 1;
    var params = {
      "actionType":isActive,
      "serviceType": 2,
      "serviceId":packageid
    };
    this._appService.optInOptOutService(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          debugger;
          // this.serviceCategories = ServiceCategory.getServicePackageCategories(response);
          console.log(response);
          window.location.reload();
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }


}
