import { Component, OnInit } from '@angular/core';
import { ServiceCategory } from 'src/model/common/service-category.model';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { AlertType, APIResponse } from 'src/utils/app-constants';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  typeValidationForm: FormGroup;
  serviceCategories: ServiceCategory[] = [];
  submit: boolean;
  isEditEnabled = false;
  modalTitle: string;
  selectedServiceCategory : ServiceCategory;

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    public formBuilder: FormBuilder

  ) {
    this.getIndividualLabTestCategories();
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



  postServiceCategoryToServer() {

    if (this.typeValidationForm.invalid) {
      return;
    } else {
      var params = this.typeValidationForm.value;

      if(this.isEditEnabled) {
        params["labTestCategoryId"] = this.selectedServiceCategory.serviceId;
      } else {
        params["labTestCategoryId"] = 0;
      }


      this._appService.postNewLabTestCatagory(params).subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
          if(this.isEditEnabled) {
            Swal.fire(
              'Congratulations.',
              'Lab test category has been updated successfully..!',
              'success'
            );
          } else {
            Swal.fire(
              'Congratulations.',
              'New category has been created successfully..!',
              'success'
            );
          }

          $('#add_pacakge').hide();
          this.getIndividualLabTestCategories();
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


  ngOnInit(): void {
    // this.drawPage();
    this.formValidation();
    $('.onlypackage').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-testcategory').addClass('active');

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500)
  }
  drawPage() {
    // $('#package').click(function () {         
    //   $('#add_pacakge').show();
    // })

    $('.close').click(function () {
      $('#add_pacakge').hide();
    })

    $('#nav_nurse').addClass('active');

    $('#el_input').hide();
    $('#ico-pointer').click(function () {
      //console.log("Working");
      $('#el_input').show();
      $('#value').hide();
    })

    // $('#example').DataTable();

    $('#serviceTable thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#serviceTable thead');


    var filterIndexes = [0, 1];

    var table = $('#serviceTable').DataTable({
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

  package() {
    this.isEditEnabled = false;
    this.modalTitle = 'Add New Category';
    $('#add_pacakge').show();
  }

  close() {
    $('#add_pacakge').hide();
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("categoryForm")).reset();
  }

  formValidation() {
    this.modalTitle = 'Add New Category';

    this.typeValidationForm = this.formBuilder.group({
      labTestCategoryName: ['', [Validators.required]],
      labTestCategoryNameArabic: ['', [Validators.required]],
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  servicesEdit(serviceId) {
    this.isEditEnabled = true;
    this.modalTitle = 'Edit Category';
    this.selectedServiceCategory = this.serviceCategories.find(ServiceCategory => ServiceCategory.serviceId == serviceId);
    if (this.selectedServiceCategory != null) {
      this.typeValidationForm.patchValue({
        labTestCategoryName: this.selectedServiceCategory.categoryName,
        labTestCategoryNameArabic: this.selectedServiceCategory.categoryNameArabic
      });
    }
    $('#add_pacakge').show();
  }

}
