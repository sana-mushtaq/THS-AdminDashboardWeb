import { Component, OnInit } from "@angular/core";
import { ServiceCategory } from "src/model/common/service-category.model";
import { IndividualTest } from "src/model/labTest/individual-test.model";
import { ServicePackage } from "src/model/servicePackage/service-package.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse, FileUploadType } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { Select2OptionData } from "ng-select2";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-lab-packages",
  templateUrl: "./lab-packages.component.html",
  styleUrls: ["./lab-packages.component.css"],
})
export class LabPackagesComponent implements OnInit {
  typeValidationForm: FormGroup;
  individualTestList: IndividualTest[] = [];
  public servicePackageList;
  public serviceMainPackageList;
  serviceCategories: ServiceCategory[] = [];
  selectedServiceCatagoryId: number;
  selectedTests: string[] = [];
  submit: boolean;
  isEditEnabled = false;
  selectedServicePackage: ServicePackage;
  modalTitle: string;
  selectedFile: File;
  activePackageList;
  inactivePackageList;

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getServicePackages();
    this.getMainServicePackages();
    this.getIndividualLabTests();
    this.getServicePackageCategories();
  }

  getServicePackages() {
    var param ={
      "serviceType": 1
    }
    this._appService.getProviderOptedServices(param).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.servicePackageList = response.serviceList;
        } else {
          console.log("Unable to get service packages");
        }
      },
      (err) => {
        console.log("Unable to get service packages");
      }
    );
  }

  getMainServicePackages() {
    this._appService.getProviderLabPackages().subscribe(
      (response: any) => {
        debugger;
        if (response.status == APIResponse.Success) {
          this.serviceMainPackageList = ServicePackage.getServicePackageList(response);
          this.activePackageList = this.serviceMainPackageList.filter((appointment) => appointment.isActive == 1);
          this.inactivePackageList =this.serviceMainPackageList.filter((appointment) => appointment.isActive == 0);
        } else {
          console.log("Unable to get service packages");
        }
      },
      (err) => {
        console.log("Unable to get service packages");
      }
    );
  }

  getIndividualLabTests() {
    this._appService.getIndividualLabTestList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.individualTestList = IndividualTest.getIndividualTestList(response);
        } else {
          console.log("Unable to get service tests");
        }
      },
      (err) => {
        console.log("Unable to get service tests");
      }
    );
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

  packageChange(event) {
    alert(event.target.value);
  }

  postLabPackageToServer() {
    this.selectedTests = [];
    var selectedTests = $("#my-select").val();
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      selectedTests.forEach((selectedTest) => {
        let testVals = selectedTest.split(":");
        if (testVals.length > 1) {
          this.selectedTests.push(testVals[1].trim());
        }
      });

      let params = this.typeValidationForm.value;
      params["testIncluded"] = this.selectedTests.toString();
      params["numberOfTestIncluded"] = this.selectedTests.length;
      params["sectorId"] = 1;

      if (this.isEditEnabled == true) {
        params["packageId"] = this.selectedServicePackage.packageId;
        if (this.selectedTests == null || this.selectedTests.length == 0) {
          params["testIncluded"] = this.selectedServicePackage.testsIncluded;
          params["numberOfTestIncluded"] = this.selectedServicePackage.noOfTestsIncluded;
        }
      } else {
        params["packageId"] = 0;
      }

      this._appService.postNewServicePackage(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.selectedFile != null) {
              this.uploadPackageLogo(response.packageId);
            } else {
              this.closeNewPackageView();
              this.getServicePackages();

              if (this.isEditEnabled) {
                Swal.fire("Congratulations.", "lab package is updated successfully..!", "success");
              } else {
                Swal.fire("Congratulations.", "New lab package is posted successfully..!", "success");
              }
            }
          } else {
            Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  uploadPackageLogo(sectorId) {
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.Package, sectorId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        if (this.isEditEnabled) {
          Swal.fire("Congratulations.", "lab package is updated successfully..!", "success");
        } else {
          Swal.fire("Congratulations.", "New lab package is posted successfully..!", "success");
        }
      } else {
        Swal.fire("Error.", "Something went wrong. Unable to upload the pacakge logo..!", "error");
      }
      this.closeNewPackageView();
      this.getServicePackages();
    });
  }

  getServicePackageCategories() {
    this._appService.getServicePackageCategories().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          debugger;
          this.serviceCategories = ServiceCategory.getServicePackageCategories(response);
          // console.log(this.serviceCategories);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  individualTestsSelected(event) {
    console.log(event.value, "event.value");
    this.selectedTests = ["1", "2"];
  }

  serviceCategorySelected(event) {
    debugger;
    this.selectedServiceCatagoryId = event.target.value;
  }

  ngOnInit(): void {
    this.formValidation();
    $('.nav-link').click(function() {
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    })
    //$(".onlyadmin").removeClass("dclass");

    //$("#labpackages_active thead tr").clone(true).addClass("filters").appendTo("#labpackages_active thead");
    //$("#labpackages_inactive thead tr").clone(true).addClass("filters").appendTo("#labpackages_inactive thead");

    $(".onlylabmenu").removeClass("dclass");
    $(".js-example-basic-single").select2();
    // $('.js-example-basic-single').on('change',function (e) {

    //  });
    $("body").on("click", ".removepackage", function () {
      $(this).parent().parent().remove();
    });
    $("body").on("click", ".loadpackages", function () {
      // alert("working");
      let servicapackage = [...this.servicePackageList];
      // console.log(this.servicePackageList);
      servicapackage.forEach(function (val, index) {
        console.log(val);
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

  showAddNewPackageView() {
    this.modalTitle = "Add New Package";
    $("#add_labPackage").show();
  }

  onClickCloseModel() {
    $("#customize_labPackage").hide();
  }

  closeNewPackageView() {
    $("#add_labPackage").hide();
    this.clearForm();
  }
  loadpackages(e) {
    //  alert("Load Packages");
    let package_select = document.getElementById("package_select");
    package_select.innerHTML = "";
    let servicapackage = [...this.servicePackageList];
    servicapackage.filter((val, index) => {
      // console.log(val.servicePackageCategoryId);
      if (val.servicePackageCategoryId == e.target.value) {
        var option = document.createElement("option");
        option.text = val.packageName;
        option.value = String(val.packageId);
        package_select.append(option);
      }
    });
    // alert("working");
  }
  fetchPrice(e) {
    let servicapackage = [...this.serviceMainPackageList];
    servicapackage.filter((val, index) => {
      // console.log(val.servicePackageCategoryId);
      if (val.packageId == e.target.value) {
        $("#taib_price").val(val.packagePrice);
      }
    });
  }
  addCustomizePrice() {
    $("#labpackages").DataTable().destroy();
    if (this.typeValidationForm.invalid) {
      // alert("working");
      return;
    }
    let params = this.typeValidationForm.value;
    params["sectorId"] = 1;
    params["serviceType"] = 1;
    // console.log(params);
    this._appService.optNewService(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.getServicePackages();
          setTimeout(() => {
            this.drawPage();
          }, 1500);
          this.close();
          Swal.fire("Success.", "Service Updated successfully..!", "success");
        } else {
          Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
      }
    );
  }
  addcustomizepackage() {
    let customize_package_content = document.getElementById("customize_package_content");
    let servicecategory = [...this.serviceCategories];
    var data =
      '<div class="row"><div class="col-md-3 form-group"><label class="form-label">Package Category</label><select class="form-control js-example-basic-single loadpackages" (change)="loadpackages($event)">';
    servicecategory.forEach((val, index) => {
      data += '<option [value]="' + val.serviceId + '">' + val.categoryName + "</option>";
    });
    data +=
      '</select></div><div class="col-md-3 form-group"><label class="form-label">Choose Package</label><select class="form-control js-example-basic-single" id="package_select"></select></div><div class="col-md-3 form-group"><label class="form-label">Taib Price</label><input class="form-control" type="text" value="SAR 220"readonly/></div><div class="col-md-2 form-group"><label class="form-label">Your Price</label><input class="form-control" type="text"/></div><div class="col-md-1 form-group"><button type="button" class="btn btn-danger mt-4 removepackage" onchange="removepackage($event)"><i class="fa fa-minus"></i></button></div></div>';
    $("#customize_package_content").append(data);
    // package_select.innerHTML = '';
    // let servicecategory = [...this.serviceCategories];
    // servicecategory.forEach((val,index) => {
    //   console.log(val);
    //   var div = document.createElement("option");
    //   option.text = val.packageName;
    //   option.value = val.packageName;
    //   package_select.appendChild(option);

    // });
  }
  removepackage(e) {
    alert("working");
    // e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
  }

  drawPage() {
    $("#nav_nurse").addClass("active");

    $("#myBtn_view").click(function () {
      $("#myModal_view").show();
    });
    $(".close").click(function () {
      $("#myModal_view").hide();
    });

    $("#file_package").on("change", function (e) {
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


    var filterIndexes = [0, 2, 3, 4];

    var table = $("#labpackages_active").DataTable({
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

    var table = $("#labpackages_inactive").DataTable({
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
              var cell = $("#labpackages_inactive.filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="' + title + '" />');

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
              var cell = $("#labpackages_inactive.filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="hidden" />');
            }
          });
      },
    });

    $("#my-select").multiSelect();
  }

  close() {
    $("#customize_labPackage").hide();
    $("#taib_price").val("");
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("labtechpackagelistForm")).reset();
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      sectorId: 1,
      serviceType: 1,
      serviceId: ["", [Validators.required]],
      customPrice: ["", [Validators.required]],
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
    this.modalTitle = "Edit Package";
    this.selectedServicePackage = this.servicePackageList.find((ServicePackage) => ServicePackage.packageId == packageId);
    if (this.selectedServicePackage != null) {
      this.typeValidationForm.patchValue({
        sectorId: this.selectedServicePackage.serviceSectorId,
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

      $("#add_labPackage").show();
    }
  }

  getpackagebycategory(event) {
    alert(event.target.value);
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
      "serviceType": 1,
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
