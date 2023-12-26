import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientSource } from "src/model/patientSource/patient-source.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { APIResponse } from "src/utils/app-constants";
import Swal from "sweetalert2";
import { HttpClient } from '@angular/common/http';

declare var $: any;
@Component({
  selector: "app-patient-source",
  templateUrl: "./patient-source.component.html",
  styleUrls: ["./patient-source.component.css"],
})
export class PatientSourceComponent implements OnInit {
  patientSourceForm: FormGroup;
  patientSources: PatientSource[] = [];
  isEditEnabled: boolean;
  modalTitle;
  selectedPatientSource: PatientSource;
  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;
  constructor(private _appService: AppService, public formBuilder: FormBuilder, private _appDataService: AppDataService,private http: HttpClient) {
    this.getPatientSources();
  }

  getPatientSources() {
    this._appService.getPatientSources().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.patientSources = PatientSource.getPatientSources(response);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  postPatientSource() {
    if (this.patientSourceForm.invalid) {
      return;
    } else {
      var params = this.patientSourceForm.value;
      if (this.isEditEnabled == true) {
        params["patientSourceId"] = this.selectedPatientSource.sourceId;
      } else {
        params["patientSourceId"] = 0;
      }
      this._appService.postNewPatientSource(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.isEditEnabled == true) {
              Swal.fire("Congratulations.", "Patient source has been updated successfully..!", "success");
            } else {
              Swal.fire("Congratulations.", "New patient source has been created successfully..!", "success");
            }
            this.close();
            this.getPatientSources();
          } else {
            Swal.fire("Error.", "Unable to patient source. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  showAddNewPatientSource() {
    this.isEditEnabled = false;
    this.modalTitle = "Add New Source";
    $("#add_patientsource").show();
  }

  formValidation() {
    this.patientSourceForm = this.formBuilder.group({
      sourceName: ["", [Validators.required]],
      sourceNameArabic: ["", [Validators.required]],
    });
  }

  get type() {
    return this.patientSourceForm.controls;
  }

  editPatientSource(sourceId) {
    this.isEditEnabled = true;
    this.modalTitle = "Edit Category";
    this.selectedPatientSource = this.patientSources.find((source) => source.sourceId == sourceId);
    if (this.selectedPatientSource != null) {
      this.patientSourceForm.patchValue({
        sourceName: this.selectedPatientSource.sourceName,
        sourceNameArabic: this.selectedPatientSource.sourceNameArabic,
      });

      $("#add_patientsource").show();
    }
  }

  close() {
    $("#add_patientsource").hide();
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("patientSourceForm")).reset();
  }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });

    
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    this.formValidation();

    // $("#package").click(function () {
    //   $("#add_patientsource").show();
    // });
    var filterIndexes = [0, 1, 2, 3, 4, 5, 6, 7];

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
}
