import { Component, OnInit } from '@angular/core';
import { Sector } from 'src/model/common/sector.model';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { AlertType, APIResponse, FileUploadType } from 'src/utils/app-constants';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import Swal from 'sweetalert2';
import { Departments } from './models/departments.model';

declare var $: any;
declare var angular: any;

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})

export class DepartmentsComponent implements OnInit {

  typeValidationForm: FormGroup;
  sectorList: Sector[] = [];
  selectedFile: File;
  submit: boolean;
  isEditEnabled: boolean;
  modalTitle;
  selectedSector: Sector;


  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    public formBuilder: FormBuilder
  ) {
    this.getSectors();
  }


  getSectors() {
    this._appService.getSectorList().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.sectorList = Sector.getSectorList(response);
      } else {
        console.log("Unable to get sectors");
      }
    }, err => {
      console.log("Unable to get sectors");
    });
  }

  onClickPostSector() {
    $('#add_department').hide();
  }

  showNewDepartmentView() {
    this.isEditEnabled = false;
    this.modalTitle = 'Add New Department';
    $('#add_department').show();
  }

  closeNewDepartmentView() {
    $('#add_department').hide();
    this.clearForm();
  }

  handleFileInput(event) {
    this.selectedFile = event.files.item(0);
  }

  postNewDepartment() {
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      let params = this.typeValidationForm.value; 

      if(this.isEditEnabled) {
        params["sectorId"] = this.selectedSector.sectorId;
      } else {
        params["sectorId"] = 0;
      }
      debugger;

      this._appService.postNewSector(this.typeValidationForm.value).subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
          if (this.selectedFile != null) {
            this.uploadDepartmentLogo(response.sectorId)
          } else {
            this.closeNewDepartmentView();
            this.getSectors();

            if(this.isEditEnabled) {
              Swal.fire(
                'Congratulations.',
                'New department has been updated successfully..!',
                'success'
              );
            } else {
              Swal.fire(
                'Congratulations.',
                'New department has been created successfully..!',
                'success'
              );
            }
          }
        } else {
          this.closeNewDepartmentView();
          Swal.fire(
            'Error.',
            'Something went wrong. Please try again later..!',
            'error'
          );
        }
      }, err => {
        this.closeNewDepartmentView();
        Swal.fire(
          'Error.',
          'Something went wrong. Please try again later..!',
          'error'
        );
      });
    }
  }


  uploadDepartmentLogo(sectorId) {
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.Sector, sectorId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.closeNewDepartmentView();
        this.getSectors();
        if(this.isEditEnabled) {
              Swal.fire(
                'Congratulations.',
                'New department has been updated successfully..!',
                'success'
              );
          } else {
              Swal.fire(
                'Congratulations.',
                'New department has been created successfully..!',
                'success'
              );
            }
      } else {
        this.closeNewDepartmentView();
        Swal.fire(
          'Error.',
          'Something went wrong. Unable to upload the department logo..!',
          'error'
        );
      }
    });
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("departmentForm")).reset();
  }

  ngOnInit(): void {
    this.formValidation();
    $('.onlyadmin').removeClass('dclass');

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500)
  }


  drawPage() {

    $("#files_department").on('change', function (e) {
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


    $('#nav_services').addClass('active');

    $('#el_input').hide();
    $('#ico-pointer').click(function () {
      //console.log("Working");
      $('#el_input').show();
      $('#value').hide();
    })

    $('#departmentsTable thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#departmentsTable thead');


    var filterIndexes = [1, 2];

    var table = $('#departmentsTable').DataTable({
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


  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      sectorName: ['', [Validators.required]],
      sectorNameArabic: ['', [Validators.required]],
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  departmentEdit(sectorId) {
    this.isEditEnabled = true; 
    this.modalTitle = 'Edit Department';
    this.selectedSector = this.sectorList.find(sector => sector.sectorId == sectorId);
    if (this.selectedSector != null) {
      this.typeValidationForm.patchValue({
        sectorName: this.selectedSector.sectorName,
        sectorNameArabic: this.selectedSector.sectorNameArabic
      });

      $('#add_department').show();
    }
  }
}

//   this._appService.getSectorList().subscribe((response: any) => {
//     this.sectorList = Sector.getSectorList(response);
//     var departmentVal = new Departments();
//     angular.forEach(this.sectorList, function(value, key) {
//       if(sectorId == value.sectorId)
//       {
//         departmentVal.sectorId = value.sectorId;
//         departmentVal.sectorName = value.sectorName;
//         departmentVal.sectorNameArabic = value.sectorNameArabic;
//       }
//     });

//     $('#add_department').show();    

//     this.typeValidationForm.patchValue({
//       sectorName: departmentVal.sectorName,
//       sectorNameArabic: departmentVal.sectorNameArabic
//     });
// }

