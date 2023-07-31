import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/model/common/common-service.model";
import { Sector } from "src/model/common/sector.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse, FileUploadType } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import Swal from "sweetalert2";
declare var $: any;
@Component({
  selector: "app-lab-others",
  templateUrl: "./lab-others.component.html",
  styleUrls: ["./lab-others.component.css"],
})
export class LabOthersComponent implements OnInit {
  typeValidationForm: FormGroup;
  sectorList: Sector[] = [];
  commonServiceList;
  commonMainServiceList : CommonService[] = [];
  selectedFile: File;
  selectedDepartmentId;
  submit: boolean;
  isEditEnabled = false;
  modalTitle: string;
  activeServiceList;
  inactiveServiceList;

  selectedService: CommonService;

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getSectors();
    this.getCommonServiceList();
    this.getMainCommonServiceList();
  }

  getSectors() {
    this._appService.getSectorList().subscribe(
      (response: any) => {
          debugger;
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
    var param = {
      "serviceType": 3
    }
    this._appService.getProviderOptedServices(param).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.commonServiceList = response.serviceList;
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }
  getMainCommonServiceList() {
    
    this._appService.getProviderOtherServices().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.commonMainServiceList = CommonService.getCommonServiceList(response.commonServices);
          this.activeServiceList = this.commonMainServiceList.filter((appointment) => appointment.isActive == 1);
          this.inactiveServiceList =this.commonMainServiceList.filter((appointment) => appointment.isActive == 0);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
    
  }

  addCustomizePrice() {
    $("#commonServiceTable").DataTable().destroy();
    if (this.typeValidationForm.invalid) {
        // alert("working");
        return;
    }
    let params = this.typeValidationForm.value;
    params["serviceType"] = 3;
    // console.log(params);
    this._appService.optNewService(params).subscribe((response: any) => {
        if (response.status == APIResponse.Success) {
            this.getCommonServiceList();
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
    let servicapackage = [...this.commonMainServiceList];
    servicapackage.filter((val, index) => {
      // console.log(val.servicePackageCategoryId);
      if (val.serviceId == e.target.value) {
        $("#taib_price").val(val.servicePrice);
      }
    });
  }
  
  ngOnInit(): void {
    $('.onlylabmenu').removeClass('dclass');
    this.formValidation();
    // $("#commonServiceTable_active thead tr").clone(true).addClass("filters").appendTo("#commonServiceTable_active thead");
    // $("#commonServiceTable_inactive thead tr").clone(true).addClass("filters").appendTo("#commonServiceTable_inactive thead");
    $('.nav-link').click(function() {
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }
  close() {
    $('#customize_commonService').hide();
    $("#taib_price").val("");
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
    $("#taib_price").val("");
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

    var filterIndexes = [0, 2, 3, 4];

    var table = $("#commonServiceTable_active").DataTable({
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

    var table = $("#commonServiceTable_inactive").DataTable({
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
      "serviceType": 3,
      sectorId:  ['', [Validators.required]],
      serviceId: ['', [Validators.required]],
      customPrice: ['', [Validators.required]]
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  otherEdit(serviceId) {
    this.isEditEnabled = true;
    this.modalTitle = "Edit Service";
    this.selectedService = this.commonServiceList.find((CommonService) => CommonService.serviceId == serviceId);
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
      });

      $("#add_commonService").show();
    }
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
      "serviceType": 3,
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
