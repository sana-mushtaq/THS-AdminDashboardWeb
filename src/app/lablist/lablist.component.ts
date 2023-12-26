import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AlertType, APIResponse, PractiseUserRoles,FileUploadType } from "src/utils/app-constants";
import { Router } from "@angular/router";
import { AppDataService } from 'src/service/app-data.service';
import Swal from "sweetalert2";
import * as moment from "moment";
import { HttpClient } from '@angular/common/http';

declare var $: any;
declare var google : any;
@Component({
  selector: 'app-lablist',
  templateUrl: './lablist.component.html',
  styleUrls: ['./lablist.component.css']
})
export class LablistComponent implements OnInit {
    
    typeValidationForm: FormGroup;
    selectedFile: File;
    ActiveLabLists = [];
    InActiveLabLists =[];
    ActualLabLists = [];
    selectedLabList;
    imgPreview;
    modalTitle;
    editEnabled = 0;

    userRoles: any = {}

    jsonData: any;
    loaded: boolean = false;

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    public formBuilder: FormBuilder,
    private router: Router,
    private _appDataService: AppDataService,
    private http: HttpClient
  ) {
    this.getLabListData();
   }
  activerequests() {
    $('.in_ac_cards').hide();  
    $('.active_card_space').show();  
  }
  closedrequests() {
    $('.in_ac_cards').hide();  
    $('.inactive_card_space').show();  
  }
    getLabListData() {
        this._appService.getServiceProviderList().subscribe((response: any) => {
            if (response.status == APIResponse.Success) {
                this.ActualLabLists = response.serviceProviderList;
                this.ActiveLabLists = response.serviceProviderList.filter((lab) => lab.isActive == 0);
                this.InActiveLabLists = response.serviceProviderList.filter((lab) => lab.isActive == 1);
            } else {
                console.log("Unable to get appointments");
            }
        }, err => {
            console.log("Unable to get appointments");
        });   
    }
    formValidation() {
        this.typeValidationForm = this.formBuilder.group({
            serviceProviderName: ["", [Validators.required]],
            serviceProviderNameArabic:["",[Validators.required]],
            contactPerson:["", [Validators.required]],
            contactPersonArabic:["", [Validators.required]],
            mobile:["", [Validators.required]],
            email:["", [Validators.required]],
            providerAddress:["", [Validators.required]],
            providerAddressArabic:["", [Validators.required]],
            longitude:["", [Validators.required]],
            latitude:["", [Validators.required]]
        });
    }
    get type() {
        return this.typeValidationForm.controls;
    }

    LabModalSubmit() {
      if(this.editEnabled == 1) {
        this.EditLab();
      }
      else {
        this.AddNewLab();
      }
    }
    AddNewLab() {
        if (this.typeValidationForm.invalid) {
            // alert("working");
            return;
        }
        let params = this.typeValidationForm.value;
        this._appService.postNewServiceProvider(params).subscribe((response: any) => {
            // console.log(response);
            if (response.status == APIResponse.Success) {
                this.onClickCloseModel();
                this.uploadLabImage(response.userId)
                Swal.fire("Success.", "New Lab is created successfully..!", "success");
              } else if (response.status == APIResponse.RecordExistAlready) {
                Swal.fire("Error.", "Mobile number exists already. Please verify given mobile number and try again..!", "error");
              } else {
                Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
              }
            },
            (err) => {
              Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
        });   
    }

    EditLab() {
      if (this.typeValidationForm.invalid) {
        // alert("working");
        return;
      }
      let params = this.typeValidationForm.value;
      params["serviceProviderId"] = this.selectedLabList.serviceProviderId;
      this._appService.postNewServiceProvider(params).subscribe((response: any) => {
          // console.log(response);
          if (response.status == APIResponse.Success) {
              this.onClickCloseModel();
              this.uploadLabImage(response.userId)
              Swal.fire("Success.", "New Lab is created successfully..!", "success");
            } else if (response.status == APIResponse.RecordExistAlready) {
              Swal.fire("Error.", "Mobile number exists already. Please verify given mobile number and try again..!", "error");
            } else {
              Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
            }
          },
          (err) => {
            Swal.fire("Error.", "Something went wrong. Please try again..!", "error");
      });   
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

    uploadLabImage(serviceid) {
        // alert("Working");
        this._appService.uploadfileToServer(this.selectedFile, FileUploadType.ServiceProviderLogo, serviceid).subscribe((response: any) => {            
          if (response.status == APIResponse.Success) {
            // Swal.fire("Congratulations.", "New promotion has been created successfully..!", "success");            
            // Swal.fire("Congratulations.", "New promotion has been created successfully..!", "success");
            this.getLabListData();
          } else {
            // this.closeNewServiceView();
            Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
          }
        });
    }

    EditLabClick(serviceProviderId) {

      var lab = [];
      lab["serviceProviderId"] = serviceProviderId;
      this._appDataService.currentAppointmentSubject.next(lab);
      this.router.navigate(["/edit-lab"]);
      
      // this.modalTitle = "Edit Lab";
      // this.editEnabled = 1;
      // this.selectedLabList = this.ActualLabLists.find((lab) => lab.serviceProviderId == serviceProviderId);
      // if (this.selectedLabList != null) {
      //   this.typeValidationForm.patchValue({
      //     serviceProviderName: this.selectedLabList.providerName,
      //     serviceProviderNameArabic: this.selectedLabList.providerNameArabic,
      //     contactPerson: this.selectedLabList.contactPersonName,
      //     contactPersonArabic: this.selectedLabList.contactPersonNameArabic,
      //     mobile:this.selectedLabList.mobile,
      //     email: this.selectedLabList.email,
      //     providerAddress: this.selectedLabList.providerAddress,
      //     providerAddressArabic: this.selectedLabList.providerAddressArabic,
      //     longitude:this.selectedLabList.longitude,
      //     latitude: this.selectedLabList.latitude,
      //   });
      //   this.imgPreview = this.selectedLabList.logoPath;
      //   $("#add_lab").show();
      // }
    }

  ngOnInit(): void {

    
    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });


    
    this.formValidation();
    $('.onlylab').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-labview').addClass('active');

    $('.nav-link').click(function() {
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    })     
    this.modalTitle = "Add New Lab";
    // $('#rr_servicerequeststable thead tr')
    //         .clone(true)
    //         .addClass('filters')
    //         .appendTo('#rr_servicerequeststable thead');
    // $('#rr_closedservicerequeststable thead tr')
    //         .clone(true)
    //         .addClass('filters')
    //         .appendTo('#rr_closedservicerequeststable thead');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawTable();
    }, 2500);

    var locatorSection = document.getElementById("locator-input-section")
    var input = document.getElementById("autocomplete");

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(45.4215296, -75.6971931),
    );

    var options = {
        bounds: defaultBounds
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    this.initMap();
  }
  locatorButtonPressed() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.getUserAddressBy(position.coords.latitude, position.coords.longitude);
            this.typeValidationForm.patchValue({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });
        },
        (error) => {
            alert("The Locator was denied :( Please add your address manually")
        });
  }

  getUserAddressBy(lat, long) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var address = JSON.parse(this.responseText);
              // this.setAddressToInputField(address.results[0].formatted_address);
              $('#autocomplete').val(address.results[0].formatted_address);
              // this.getLatiandLongi(address.results[0].formatted_address);
          }
      };
      xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyDw0RNwKY1k0NU8VTe_nrljW_gPYn8_RLE", true);
      xhttp.send();
  }

  provideraddresschange(event){
    var address = event.value;
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = (val) => {
          //console.log(val.target['readyState']);
          if (val.target['readyState'] == 4 && val.target['status'] == 200) {
              var address = JSON.parse(val.target['responseText']);
              this.typeValidationForm.patchValue({
                longitude: address.results[0]['geometry']['location'].lng,
                latitude: address.results[0]['geometry']['location'].lat,
              });
              // this.setAddressToInputField(address.results[0].formatted_address);
          }
      };
      xhttp.open("GET", "https://maps.google.com/maps/api/geocode/json?key=AIzaSyDw0RNwKY1k0NU8VTe_nrljW_gPYn8_RLE&address="+address+"&sensor=false", true);
      xhttp.send();
    
  }
  initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.031 };
    // The map, centered at Uluru
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 4,
        center: uluru,
      }
    );
  
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }
    drawTable() {


        var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

        var table = $('#rr_servicerequeststable').DataTable({
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

        var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

        var table = $('#rr_closedservicerequeststable').DataTable({
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
    showAddNewPackageView() {   
        this.modalTitle = "Add New Lab";
        this.typeValidationForm.reset();
        $('#add_lab').show();
    }

    onClickCloseModel() {
        $('#add_lab').hide();
    }
    close() {
        $('#add_lab').hide();   
    }

    statusChange(e,labid) {
      // alert(e.checked);
      var status = 0;
      if(e.checked == true) {
        status = 0;
        Swal.fire({
          title: 'Are you Sure Want to Activate the Lab ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Yes',
          denyButtonText: `No`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.statusChangeProcess(labid,status);
          } else if (result.isDenied) {
            e.checked = false;
            Swal.fire('Something Went Wrong !! Try Again', '', 'info');
          }
        })
      }
      else if(e.checked == false) {
        status = 1;
        Swal.fire({
          title: 'Are you Sure Want to Deactive the Lab ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Yes',
          denyButtonText: `No`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.statusChangeProcess(labid,status);
          } else if (result.isDenied) {
            e.checked = true;
            Swal.fire('Something Went Wrong !! Try Again', '', 'info');
          }
        })
      }
    }

    statusChangeProcess(labid,status){
      let params = {
        serviceProviderId: labid,
        serviceProviderStatus:status
      }
      this._appService.updateLabServiceProviderStatus(params).subscribe((response: any) => {            
        if (response.status == APIResponse.Success) {
          if(status == 1){
            Swal.fire('Deactivated!', '', 'success')
          }
          else if(status == 0){
            Swal.fire('Activated!', '', 'success')
          }
          window.location.reload();
        } else {
          // this.closeNewServiceView();
          Swal.fire('Something Went Wrong !! Try Again', '', 'info')
        }
      });
    }

    reInviteLab(labid){

      Swal.fire({
        title: 'Are you Sure Want to Send the Invite Again to Lab ?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let params = {
            serviceProviderId: labid
          }
          this._appService.reinviteLab(params).subscribe((response: any) => {            
            if (response.status == APIResponse.Success) {
              Swal.fire('Invite Sent!', '', 'success')
              this.getLabListData();
            } else {
              // this.closeNewServiceView();
              Swal.fire("Error.", "Something went wrong. Unable to Reinvite the Lab..!", "error");
            }
          });
        } else if (result.isDenied) {
          Swal.fire('Something Went Wrong !! Try Again', '', 'info')
        }
      })
    }
}
