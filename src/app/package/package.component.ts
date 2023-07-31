import { Component, OnInit } from "@angular/core";
import { ServiceCategory } from "src/model/common/service-category.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import Swal from "sweetalert2";

declare var $: any;
declare let $dragSortableItem: any;

@Component({
  selector: "app-package",
  templateUrl: "./package.component.html",
  styleUrls: ["./package.component.css"],
})
export class PackageComponent implements OnInit {
  typeValidationForm: FormGroup;
  serviceCategories: ServiceCategory[] = [];
  submit: boolean;
  isEditEnabled: boolean;
  modalTitle;
  selectedServiceCategory: ServiceCategory;

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getServicePackageCategories();
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

  postServiceCategoryToServer() {
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      var params = this.typeValidationForm.value;

      if (this.isEditEnabled == true) {
        params["servicePackageCategoryId"] = this.selectedServiceCategory.serviceId;
      } else {
        params["servicePackageCategoryId"] = 0;
      }

      this._appService.postNewServicePackageCatagory(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.isEditEnabled == true) {
              Swal.fire("Congratulations.", "Lab Package category has been updated successfully..!", "success");
            } else {
              Swal.fire("Congratulations.", "New category has been created successfully..!", "success");
            }

            $("#add_pacakgecategory").hide();
            this.getServicePackageCategories();
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
    $('.active-category').addClass('active');

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

    var table = $("#pacakgeCategoryTable").DataTable({
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
      pacakgeCategoryName: ["", [Validators.required]],
      packageCategoryNameArabic: ["", [Validators.required]],
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  categoryEdit(serviceId) {
    this.isEditEnabled = true;
    this.modalTitle = "Edit Category";
    this.selectedServiceCategory = this.serviceCategories.find((ServiceCategory) => ServiceCategory.serviceId == serviceId);
    if (this.selectedServiceCategory != null) {
      this.typeValidationForm.patchValue({
        pacakgeCategoryName: this.selectedServiceCategory.categoryName,
        packageCategoryNameArabic: this.selectedServiceCategory.categoryNameArabic,
      });

      $("#add_pacakgecategory").show();
    }
  }
}
