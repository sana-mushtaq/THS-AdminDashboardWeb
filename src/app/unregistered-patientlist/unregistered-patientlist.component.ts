import { Component, OnInit } from "@angular/core";
import { Patient } from "src/model/common/patient.model";
import { PatientSource } from "src/model/patientSource/patient-source.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse } from "src/utils/app-constants";
import { Router } from "@angular/router";
import { AppDataService } from "src/service/app-data.service";
import { Subject, takeUntil } from "rxjs";
declare var $: any;
import Swal from "sweetalert2";

@Component({
  selector: "app-unregistered-patientlist",
  templateUrl: "./unregistered-patientlist.component.html",
  styleUrls: ["./unregistered-patientlist.component.css"],
})
export class UnregisteredPatientlistComponent implements OnInit {
  actualpatientList: Patient[] = [];
  patientList: Patient[] = [];
  patientSources: PatientSource[] = [];
  selectedPatientSourceId: number;
  selectedGender: number;
  searchPatientInput;
  jsonText;
  isEditEnabled = false;

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router, private _appDataService: AppDataService) {
    this.getPaitentsList();
    this.getPatientSources();
  }

  getPaitentsList() {
    $("#unVerifiedDatatable").DataTable().destroy();
    this._appService.getUnVerifiedPatientList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.actualpatientList = Patient.getUnverifiedPatientsList(response);
          // this.jsonText = Patient.getUnverifiedPatientsList(response);
          debugger;
          this.patientList = this.actualpatientList.sort(function (a, b) {
            return b.patientId - a.patientId;
          });
          let params = {
            data: this.patientList,
          };
          this.jsonText = params;
          this.drawPage();
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }
  testbtn() {
    this.getPaitentsList();
  }

  getPatientSources() {
    this._appService.getPatientSources().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.patientSources = PatientSource.getPatientSources(response);
          this.patientSources = this.patientSources.filter((source) => source.sourceId != 0);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  patientSourceChanged(event) {
    this.selectedPatientSourceId = event.value;
  }

  genderSelected(event) {
    this.selectedGender = event.value;
  }

  postNewPatient() {
    if (this.selectedGender != null) {
      let patientDetails = {
        firstName: $("#patientFirstName").val(),
        lastName: $("#patientLastName").val(),
        mobile: $("#patientMobileNumber").val(),
        userPassword: $("#patientNationalId").val(),
        email: $("#patientEmailId").val(),
        dob: $("#patientDob").val(),
        gender: this.selectedGender,
        nationality: "SA",
        nationalId: $("#patientNationalId").val(),
        preferredLang: 2,
        sourceId: this.selectedPatientSourceId,
      };
      this._appService.registerNewPatient(patientDetails).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.isEditEnabled == true) {
              Swal.fire("Congratulations.", "Patient source has been updated successfully..!", "success");
            } else {
              Swal.fire("Congratulations.", "New patient been created successfully..!", "success");
            }
            this.close();
            this.getPaitentsList();
          } else {
            Swal.fire("Error.", "Unable to create patient. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  showNewPatientView() {
    $("#newPatientModal").show();
  }

  close() {
    $("#newPatientModal").hide();
  }

  ngOnInit(): void {
    $(".onlypatient").removeClass("dclass");
    $(".onlyadmin").removeClass("dclass");
    $("#unVerifiedDatatable thead tr").clone(true).addClass("filters").appendTo("#unVerifiedDatatable thead");
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.drawPage();
    // }, 2500);
  }

  drawPage() {
    $("#el-table__expanded-cell").hide();
    $("#expanded").click(function () {
      //console.log("Working");
      $("#el-table__expanded-cell").toggle();
    });

    var filterIndexes = [0, 1, 2, 3, 4, 5];

    // $("#unVerifiedDatatable").DataTable({
    //   // serverSide: true,
    //   ajax: "../../assets/patientList.json",
    //   columns: [
    //     { data: 'patientId' },
    //     { data: 'sourceName' },
    //     { data: 'firstName' },
    //     { data: 'email' },
    //     { data: 'mobileNumber'},
    //     { data: 'gender' },
    //     { data: 'idNumber' },
    //     { data: 'firstName' },
    //     { data: 'firstName' }
    //   ],
    // });

    $("#unVerifiedDatatable").DataTable({
      // ajax: "https://taib.sa/services/getUnVerifiedPatientList",
      aaSorting: [],
      data: this.jsonText.data,
      columnDefs: [
        {
          defaultContent: "-",
          targets: "_all",
        },
      ],
      columns: [
        { data: "patientDisplayId" },
        { data: "createdDate" },
        {
          data: { firstName: "firstName", lastName: "lastName" },
          render: function (data, type) {
            return (
              '<div class="cell"><div class="d-flex-center"><span class="avtar3"><img src="assets/images/user.svg" class="image-cover" /></span> <span class="grid_offlinestatus"></span><span title="Lama Saleh">' +
              data.firstName +
              " " +
              data.lastName +
              "</span></div></div>"
            );
          },
        },
        { data: "email" },
        { data: "mobileNumber" },
        { data: "genderText" },
        { data: "nationalId" },
        {
          data: "otp",
          render: function (data, type) {
            return "<p><b>" + data + "</b></p>";
          },
        },
        {
          data: "patientId",
          render: (data, type) => {
            return '<button class="btn btn-success verifyBtn" (click)="verifyUnVerifiedPatient($event.target)" value="' + data + '">Verify</button>';
          },
        },
      ],
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: () => {
        var id;
        $("#unVerifiedDatatable").show();
        $("#unVerifiedDatatable").on("click", ".verifyBtn", (e) => {
          // console.log(e.target.value);
          this.verifyUnVerifiedPatient(e.target.value);
        });

        var api = $("#unVerifiedDatatable").DataTable();
        //For each column
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

    // .on('search.dt', () => {
    //     var search_value = $('#unVerifiedDatatable_filter input[type=search]').val();
    //     if(search_value != null && search_value != ""){
    //       this.patientList = this.actualpatientList.filter((patient) => patient.firstName == search_value || patient.lastName == search_value || patient.patientId == search_value || patient.email == search_value || patient.mobileNumber == search_value).slice(0,250);
    //     }
    //     else {
    //       // $("#unVerifiedDatatable").DataTable().destroy();
    //       setTimeout(() => {
    //         this.patientList = this.actualpatientList.slice(0,250);
    //       }, 500);
    //     }

    // })
  }
  SearchPatientInput(event) {
    console.log(event.value);
    this.searchPatientInput = event.value;
  }

  filterPatient() {
    $("#unVerifiedDatatable").DataTable().destroy();
    var search_value = this.searchPatientInput;
    if (search_value != null && search_value != "") {
      // this.patientList = this.actualpatientList.filter((patient) => patient.firstName.search(search_value) || patient.lastName == search_value || patient.patientId == search_value || patient.email.search(search_value) || patient.mobileNumber == search_value).slice(0,250);
      // alert(this.patientList[0].email.includes(search_value))
      this.patientList = this.actualpatientList.filter((patient) => {
        const first_name = patient.firstName.toUpperCase() + " " + patient.lastName.toUpperCase();
        const last_name = patient.lastName.toUpperCase();

        const mobile = `${patient.mobileNumber})`;
        const email = patient.email == null || patient.email == "" ? "XXXXX" : patient.email.toUpperCase();

        const search_value_cap = search_value.toUpperCase();

        return (
          first_name.indexOf(search_value_cap) > -1 ||
          last_name.indexOf(search_value_cap) > -1 ||
          mobile.indexOf(search_value_cap) > -1 ||
          email.indexOf(search_value_cap) > -1
        );
      });

      console.log(this.patientList);
    }
    setTimeout(() => {
      this.drawPage();
    }, 1500);
  }

  clearfilterPatient() {
    $("#unVerifiedDatatable").DataTable().destroy();
    this.patientList = this.actualpatientList;
    this.searchPatientInput = "";
    setTimeout(() => {
      this.drawPage();
    }, 1500);
  }

  viewPatientDetails(patientId) {
    var selectedPatientId = [];
    selectedPatientId["patientId"] = patientId;
    this._appDataService.currentAppointmentSubject.next(selectedPatientId);
    this.router.navigate(["/view-patient"]);
  }

  verifyUnVerifiedPatient(e) {
    var patientId = e;
    Swal.fire({
      title: "Are you sure you want to Verify this Patient?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.verifyThePatient(patientId);
      }
    });
  }

  verifyThePatient(patientid) {
    let params = {
      patientId: patientid,
    };
    this._appService.updatePatientAccountStatus(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.getPaitentsList();
          Swal.fire("Success.", response.message, "success");
        } else {
          Swal.fire("Error.", response.message, "error");
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }
}
