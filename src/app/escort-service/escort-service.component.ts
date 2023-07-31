import { Component, OnInit } from '@angular/core';
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { InsuranceList } from 'src/model/common/insurance.modal';
import { EscortService } from 'src/model/common/escortService.model';
import { AlertType, APIResponse, FileUploadType } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

import Swal from "sweetalert2";

declare var $: any;
declare let $dragSortableItem: any;

@Component({
  selector: 'app-escort-service',
  templateUrl: './escort-service.component.html',
  styleUrls: ['./escort-service.component.css']
})
export class EscortServiceComponent implements OnInit {
  typeValidationForm: FormGroup;
  submit: boolean;
  isEditEnabled: boolean;
  modalTitle;
  selectedFile: File;
  imgPreview;
  selectedService;
  escortList;

  weekLists = [];

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getEscortServiceList()
  }

  ngOnInit(): void {
    $('.onlyadmin').removeClass('dclass');
    $('.onlypackage').removeClass('dclass');
    this.modalTitle = "Add Service";
    this.formValidation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

  handleFileInput(event) {
      this.selectedFile = event.files.item(0);
      if (event.files && event.files[0]) {
          const file = event.files[0];
          const reader = new FileReader();
          reader.onload = e => this.imgPreview = reader.result;
          reader.readAsDataURL(file);
      }
      // reader.readAsDataURL(this.selectedFile);
  }

  formValidation() {
    this.typeValidationForm = this.formBuilder.group({
      sectorId: 29,
      serviceCategoryId: 1,
      servicePrice: 0,
      serviceName: ["", [Validators.required]],
      serviceNameArabic: ["", [Validators.required]],
      serviceDescription: ["", [Validators.required]],
      serviceDescriptionArabic:["",[Validators.required]],
      serviceSecondaryDescription: ["", [Validators.required]],
      serviceSecondaryDescriptionArabic:["",[Validators.required]],
    });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  close() {
    $("#add_insuranceList").hide();
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("nursepackageForm")).reset();
  }

  addInsurance() {
    this.isEditEnabled = false;
    this.modalTitle = "Add Service";
    $("#add_insuranceList").show();
    this.weekLists = [];
  }

  postEscortService() {
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      var params = {
        "sectorId": 29,
        "serviceCategoryId": 1,
        "servicePrice": 0,
        "title": this.typeValidationForm.value.serviceName,
        "titleArabic": this.typeValidationForm.value.serviceNameArabic,
        "serviceDescription": this.typeValidationForm.value.serviceDescription,
        "serviceDescriptionArabic": this.typeValidationForm.value.serviceDescriptionArabic,
        "serviceSecDescription": this.typeValidationForm.value.serviceSecondaryDescription,
        "serviceSecDescriptionArabic": this.typeValidationForm.value.serviceSecondaryDescriptionArabic,
        "offerings": this.weekLists
      };

      console.log(params);
      
      if (this.isEditEnabled == true) {
        params["serviceId"] = this.selectedService.serviceId;
      } else {
        params["serviceId"] = 0;
      }

      // params["isActive"] = 1;

      this._appService.addOrUpdateEscortService(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.selectedFile != null) {
              this.uploadServiceImage(response.serviceId);
            } 
            if (this.isEditEnabled == true) {
              this.close();
              Swal.fire("Congratulations.", "Escort Service has been updated successfully..!", "success");
            } else {
              this.close();
              Swal.fire("Congratulations.", "New Escort Service has been created successfully..!", "success");
            }
            $("#add_insuranceList").hide();
            this.getEscortServiceList();
          } else {
            Swal.fire("Error.", "Unable to create Escort Service. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  getEscortServiceList() {
    this._appService.getEscortServiceList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.escortList = EscortService.getEscortServiceList(response);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  uploadServiceImage(serviceId) {
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.CommonService, serviceId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.getEscortServiceList();
      } else {
        Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
      }
    });
  }

  escortEdit(serviceId) {

    this.isEditEnabled = true;
    this.modalTitle = "Edit Service";
    this.weekLists = [];
    this.selectedService = this.escortList.find((service) => service.serviceId == serviceId);

    console.log(this.selectedService);
    if (this.selectedService != null) {
      this.typeValidationForm.patchValue({
        serviceName:  this.selectedService.title,
        serviceNameArabic:this.selectedService.titleArabic,
        serviceDescription: this.selectedService.serviceDescription,
        serviceDescriptionArabic: this.selectedService.serviceDescriptionArabic,
        serviceSecondaryDescription: this.selectedService.serviceSecDescription,
        serviceSecondaryDescriptionArabic: this.selectedService.serviceSecDescriptionArabic,
      });
      this.weekLists = this.selectedService.offerings;
      this.imgPreview = this.selectedService.imagePath;

      $("#add_insuranceList").show();
    }

  }

  drawPage() {

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

    $("#escort_list thead tr").clone(true).addClass("filters").appendTo("#example thead");

    var filterIndexes = [1, 2, 3, 4];

    var table = $("#escort_list").DataTable({
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

  addWeek() {
    var week_name = $('#week_name').val();
    var week_name_arabic = $('#week_name_arabic').val();
    var week_price = $('#week_price').val();

    if(week_name == null || week_name == '') {
      alert("Enter Week Name With Hours");
      return;
    }

    if(week_name_arabic == null || week_name_arabic == '') {
      alert("Enter Week Name Arabic With Hours");
      return;
    }

    if(week_price == null || week_price == '') {
      alert("Enter Week Price");
      return;
    }

    var value = {
      "title" : week_name,
      "titleArabic" : week_name_arabic,
      "price" : week_price
    }

    this.weekLists.push(value);

    $('#week_name').val('');
    $('#week_name_arabic').val('');
    $('#week_price').val('');
  }

  removeWeek(index) {
    this.weekLists.splice(index, 1);
  }

}
