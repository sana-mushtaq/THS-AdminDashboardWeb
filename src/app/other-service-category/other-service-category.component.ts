import { Component, OnInit } from '@angular/core';
import { ServiceCategory } from "src/model/common/service-category.model";
import { Sector } from "src/model/common/sector.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse, FileUploadType } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

import Swal from "sweetalert2";

declare var $: any;
declare let $dragSortableItem: any;

@Component({
  selector: 'app-other-service-category',
  templateUrl: './other-service-category.component.html',
  styleUrls: ['./other-service-category.component.css']
})
export class OtherServiceCategoryComponent implements OnInit {
  sectorList: Sector[] = [];
  typeValidationForm: FormGroup;
  serviceCategories: ServiceCategory[] = [];
  submit: boolean;
  isEditEnabled: boolean;
  modalTitle;
  selectedCommonServiceCategory: ServiceCategory;
  selectedFile: File;
  imgPreview;

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getCommonServiceCategories();
    this.getSectors();
  }


  // postCommonServiceCategory

  getSectors() {
    this._appService.getSectorList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.sectorList = Sector.getSectorList(response);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  getCommonServiceCategories() {
    this._appService.getCommonServiceCategories().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.serviceCategories = ServiceCategory.getcommonServiceCategories(response);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  getServicePackageCategories() {
    this._appService.getServicePackageCategories().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.serviceCategories = ServiceCategory.getServicePackageCategories(response);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  postCommonServiceCategoryToServer() {
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      var params = this.typeValidationForm.value;

      if (this.isEditEnabled == true) {
        params["categoryId"] = this.selectedCommonServiceCategory.serviceCategoryId;
      } else {
        params["categoryId"] = 0;
      }

      this._appService.postCommonServiceCategoryToServer(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.selectedFile != null) {
              this.uploadServiceImage(response.commonServiceCategoryId);
            } 
            if (this.isEditEnabled == true) {
              Swal.fire("Congratulations.", "Category has been updated successfully..!", "success");
            } else {
              Swal.fire("Congratulations.", "New category has been created successfully..!", "success");
            }
            $("#add_pacakgecategory").hide();
            this.getCommonServiceCategories();
          } else {
            Swal.fire("Error.", "Unable to create category. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  edit_category() {
    $("#categoryName").val("Testing");
    $("#add_pacakgecategory").show();
  }

  ngOnInit(): void {

    $('.onlypackage').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');

    this.formValidation();

    $(".edit_button").on("click", function () {
      console.log("Working");
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

  drawPage() {
    $("#nav_nurse").addClass("active");

    $("#myBtn_view").click(function () {
      $("#myModal_view").show();
    });

    $(".close").click(function () {
      $("#myModal_view").hide();
      $("#add_pacakgecategory").hide();
    });

    $(".save").click(function () {
      $("#add_pacakgecategory").hide();
    });

    $("#example thead tr").clone(true).addClass("filters").appendTo("#example thead");

    var filterIndexes = [1, 2, 3, 4];

    var table = $("#otherCategoryTable").DataTable({
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
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="' + title + '" />');

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

    $("#my-select").multiSelect();
  }

  addcategory() {
    this.isEditEnabled = false;
    this.modalTitle = "Add New Category";
    $("#add_pacakgecategory").show();
  }

  close() {
    $("#add_pacakgecategory").hide();
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("nursepackageForm")).reset();
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      commonServiceCategoryName: ["", [Validators.required]],
      commonServiceCategoryNameArabic: ["", [Validators.required]],
      serviceSectorId:["",[Validators.required]]
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  categoryEdit(serviceId) {
    this.isEditEnabled = true;
    this.modalTitle = "Edit Category";
    this.selectedCommonServiceCategory = this.serviceCategories.find((ServiceCategory) => ServiceCategory.serviceCategoryId == serviceId);
    if (this.selectedCommonServiceCategory != null) {
      this.typeValidationForm.patchValue({
        commonServiceCategoryName: this.selectedCommonServiceCategory.serviceCategoryName,
        commonServiceCategoryNameArabic: this.selectedCommonServiceCategory.serviceCategoryNameArabic,
        serviceSectorId:this.selectedCommonServiceCategory.serviceSectorId
      });

      this.imgPreview = this.selectedCommonServiceCategory.serviceCategoryImagePath

      $("#add_pacakgecategory").show();
    }
  }

  handleFileInput(event) {
    this.selectedFile = event.files.item(0);
    if (event.files && event.files[0]) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imgPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  uploadServiceImage(serviceId) {
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.CommonServiceCategoryImage, serviceId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.getCommonServiceCategories();
      } else {
        Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
      }
    });
  }


}
