import { Component, OnInit } from '@angular/core';
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { InsuranceList } from 'src/model/common/insurance.modal';
import { AlertType, APIResponse, FileUploadType } from "src/utils/app-constants";
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { HttpClient } from '@angular/common/http';

import Swal from "sweetalert2";

declare var $: any;
declare let $dragSortableItem: any;

@Component({
  selector: 'app-insurance-list',
  templateUrl: './insurance-list.component.html',
  styleUrls: ['./insurance-list.component.css']
})
export class InsuranceListComponent implements OnInit {

  typeValidationForm: FormGroup;
  submit: boolean;
  isEditEnabled: boolean;
  modalTitle;
  selectedFile: File;
  imgPreview;
  selectedInsurance;
  insuranceList;
  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;
  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder,private http: HttpClient) {
    this.getInsuranceProviderList()
  }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });

    
    $('.onlyadmin').removeClass('dclass');
    $('.onlysetting').removeClass('dclass');
    this.modalTitle = "Add Insurance";
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
      insuranceProviderName: ["", [Validators.required]],
      insuranceProviderNameArabic: ["", [Validators.required]],
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
    this.modalTitle = "Add Insurance";
    $("#add_insuranceList").show();
  }

  postInsuranceServiceProvider() {
    if (this.typeValidationForm.invalid) {
      return;
    } else {
      var params = this.typeValidationForm.value;

      if (this.isEditEnabled == true) {
        params["insuranceProviderId"] = this.selectedInsurance.insuranceProviderId;
      } else {
        params["insuranceProviderId"] = 0;
      }

      params["isActive"] = 1;

      this._appService.postInsuranceServiceProvider(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.selectedFile != null) {
              this.uploadServiceImage(response.insuranceProviderId);
            } 
            if (this.isEditEnabled == true) {
              this.close();
              Swal.fire("Congratulations.", "Insurance has been updated successfully..!", "success");
            } else {
              this.close();
              Swal.fire("Congratulations.", "New Insurance has been created successfully..!", "success");
            }
            $("#add_insuranceList").hide();
            this.getInsuranceProviderList();
          } else {
            Swal.fire("Error.", "Unable to create Insurance. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  getInsuranceProviderList() {
    this._appService.getInsuranceProviderList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.insuranceList = InsuranceList.getInsuranceList(response);
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
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.InsuranceProviderLogoImage, serviceId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.getInsuranceProviderList();
      } else {
        Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
      }
    });
  }

  insuranceEdit(insuid) {
    this.isEditEnabled = true;
    this.modalTitle = "Edit Insurance";
    this.selectedInsurance = this.insuranceList.find((insurance) => insurance.insuranceProviderId == insuid);

    console.log(this.selectedInsurance);
    if (this.selectedInsurance != null) {
      this.typeValidationForm.patchValue({
        insuranceProviderName: this.selectedInsurance.insuranceName,
        insuranceProviderNameArabic: this.selectedInsurance.insuranceNameArabic,
      });
      this.imgPreview = this.selectedInsurance.insuranceLogoPath;

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

    $("#example thead tr").clone(true).addClass("filters").appendTo("#example thead");

    var filterIndexes = [1, 2, 3, 4];

    var table = $("#insurane_list").DataTable({
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
}


