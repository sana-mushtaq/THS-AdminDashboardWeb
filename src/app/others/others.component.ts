import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/model/common/common-service.model";
import { Sector } from "src/model/common/sector.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse, FileUploadType } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ServiceCategory } from "src/model/common/service-category.model";
import Swal from "sweetalert2";
declare var $: any;
@Component({
  selector: "app-others",
  templateUrl: "./others.component.html",
  styleUrls: ["./others.component.css"],
})
export class OthersComponent implements OnInit {
  typeValidationForm: FormGroup;
  sectorList: Sector[] = [];
  commonServiceList: CommonService[] = [];
  selectedFile: File;
  selectedDepartmentId;
  selectedCategoryId;
  actualCategoryList;
  categoryList;
  submit: boolean;
  isEditEnabled = false;
  modalTitle: string;

  selectedService: CommonService;

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getSectors();
    this.getCommonServiceList();
    this.getCommonServiceCategories();
  }

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

  getCommonServiceList() {
    this._appService.getCommonServices().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.commonServiceList = CommonService.getCommonServiceList(response.commonServices);
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
          this.actualCategoryList = ServiceCategory.getcommonServiceCategories(response);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  ngOnInit(): void {
    this.formValidation();
    this.modalTitle = "Add Service";
    $('.onlypackage').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-otherslist').addClass('active');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

  onClickPostSector() {
    $("#add_commonService").hide();
  }

  showNewDepartmentView() {
    this.isEditEnabled = false;
    this.modalTitle = "Add New Service";
    $("#add_commonService").show();
  }

  closeNewServiceView() {
    $("#add_commonService").hide();
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("serviceForm")).reset();
  }

  handleFileInput(event) {
    this.selectedFile = event.files.item(0);
  }

  departmentSelected(event) {
    this.selectedDepartmentId = event.target.value;
    this.categoryList = this.actualCategoryList.filter((category) => category.serviceSectorId == event.target.value);
  }

  categorySelected(event) {
    this.selectedCategoryId = event.target.value;
  }

  postCommonServiceToServer() {
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      var params = this.typeValidationForm.value;
      if (this.isEditEnabled == true) {
        params["serviceId"] = this.selectedService.serviceId;
      } else {
        params["serviceId"] = 0;
      }

      this._appService.postNewCommonService(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.selectedFile != null) {
              this.uploadServiceImage(response.serviceId);
            } else {
              this.closeNewServiceView();
              if (this.isEditEnabled) {
                Swal.fire("Congratulations.", "Service has been updated successfully..!", "success");
              } else {
                Swal.fire("Congratulations.", "New service has been created successfully..!", "success");
              }
              this.getCommonServiceList();
            }
          } else {
            Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
        }
      );
    }
  }

  uploadServiceImage(serviceId) {
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.CommonService, serviceId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.closeNewServiceView();
        if (this.isEditEnabled) {
          Swal.fire("Congratulations.", "Service has been updated successfully..!", "success");
        } else {
          Swal.fire("Congratulations.", "New service has been created successfully..!", "success");
        }
        this.getCommonServiceList();
      } else {
        this.closeNewServiceView();
        Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
      }
    });
  }

  drawPage() {
    $("#files_service").on("change", function (e) {
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

    $("#nav_nurse").addClass("active");
    $("#el_input").hide();

    $("#ico-pointer").click(function () {
      $("#el_input").show();
      $("#value").hide();
    });

    $("#commonServiceTable thead tr").clone(true).addClass("filters").appendTo("#commonServiceTable thead");

    var filterIndexes = [0, 2, 3, 4];

    var table = $("#commonServiceTable").DataTable({
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

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      titleArabic: ["", [Validators.required]],
      serviceSecDescription: ["", [Validators.required]],
      serviceSecDescriptionArabic: ["", [Validators.required]],
      serviceDescription: ["", [Validators.required]],
      serviceDescriptionArabic: ["", [Validators.required]],
      servicePrice: ["", [Validators.required]],
      sectorId: ["", [Validators.required]],
      serviceCategoryId:["",[Validators.required]]
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  otherEdit(serviceId) {
    this.isEditEnabled = true;
    this.modalTitle = "Edit Service";
    this.selectedService = this.commonServiceList.find((CommonService) => CommonService.serviceId == serviceId);
    this.categoryList = this.actualCategoryList.filter((category) => category.serviceSectorId == this.selectedService.sectorId);
    if (this.selectedService != null) {
      this.typeValidationForm.patchValue({
        title: this.selectedService.title,
        titleArabic: this.selectedService.titleArabic,
        serviceSecDescription: this.selectedService.serviceSecDescription,
        serviceSecDescriptionArabic: this.selectedService.serviceSecDescriptionArabic,
        serviceDescription: this.selectedService.serviceDescription,
        serviceDescriptionArabic: this.selectedService.serviceDescriptionArabic,
        servicePrice: this.selectedService.servicePrice,
        sectorId: this.selectedService.sectorId,
        serviceCategoryId: this.selectedService.serviceCategoryId
      });

      $("#add_commonService").show();
    }
  }
}
