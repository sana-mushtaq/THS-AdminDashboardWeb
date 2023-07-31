import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { ServicePackage } from "src/model/servicePackage/service-package.model";
import { IndividualTest } from 'src/model/labTest/individual-test.model';
import { CommonService } from "src/model/common/common-service.model";
import { AppDataService } from "src/service/app-data.service";
import { AlertType, APIResponse,FileUploadType } from 'src/utils/app-constants';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

import Swal from "sweetalert2";
import { ServiceProvider } from 'src/model/common/service-provider.model';

declare var $: any;
declare var google : any;

@Component({
  selector: 'app-edit-lab',
  templateUrl: './edit-lab.component.html',
  styleUrls: ['./edit-lab.component.css']
})
export class EditLabComponent implements OnInit {

  typeValidationForm: FormGroup;
  selectedFile: File;
  selectedGender = 1;
  submit: boolean;
  typesubmit: boolean;
  public serviceMainPackageList;
  individualMainTestList : IndividualTest[] = [];
  commonMainServiceList : CommonService[] = [];
  serviceProviderDetails: ServiceProvider[] = [];
  imgPreview;
  selectedPackage = [];
  selectedTests = [];
  selectedService = [];
  selectedServiceProviderId;
  ineligiblePackages;
  inelligibleLabTests;
  ineligibleOtherServices;

  private _unsubscribeAll: Subject<any>;

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router, public formBuilder: FormBuilder, private _appDataService: AppDataService) {
    this.getMainServicePackages();
    this.getMainIndividualLabTests();
    this.getMainCommonServiceList();
    this._unsubscribeAll = new Subject();
    this._appDataService.selectedAppointment.pipe(takeUntil(this._unsubscribeAll)).subscribe((lab) => {
      debugger;
      if (lab != null) {
        debugger;
        this.selectedServiceProviderId = lab.serviceProviderId;

        this.getLabDetails(this.selectedServiceProviderId);
      }
    });
    
  }

  ngOnInit(): void {
    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-nurse').addClass('active');
    this.formValidation();
  }
  ngAfterViewInit() {
    setTimeout(() => {

      if(this.ineligiblePackages != null) {
        var $select1 = $("#my-select1");              
        var i=0;
        for(i=0;i<$select1[0].length;i++){
          // console.log($select1[0].children[i].value);
          if(this.ineligiblePackages.includes($select1[0].children[i].value)){
            $select1[0].children[i].selected = true;
          }
        }
      }
      if(this.inelligibleLabTests != null) {
        var $select2 = $("#my-select2");              
        var j=0;
        for(j=0;j<$select2[0].length;j++){
          // console.log($select1[0].children[i].value);
          if(this.inelligibleLabTests.includes($select2[0].children[j].value)){
            $select2[0].children[j].selected = true;
          }
        }
      }
      if(this.inelligibleLabTests != null) {
        var $select3 = $("#my-select3");              
        var k=0;
        for(k=0;k<$select3[0].length;k++){
          // console.log($select1[0].children[i].value);
          if(this.ineligibleOtherServices.includes($select3[0].children[k].value)){
            $select3[0].children[k].selected = true;
          }
        }
      }

      $(".my-select1").multiSelect({
        selectableHeader: "<input type='text' class='search-input form-control mb-3' autocomplete='off' placeholder='Search by Name or Keyword'>",
        selectionHeader: "<input type='text' class='search-input form-control mb-3' autocomplete='off' placeholder='Search by Name or Keyword'>",
        afterInit: function(ms){
          var that = this,
              $selectableSearch = that.$selectableUl.prev(),
              $selectionSearch = that.$selectionUl.prev(),
              selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
              selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';
      
          that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
          that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
        },
        afterSelect: function(){
          this.qs1.cache();
          this.qs2.cache();
        },
        afterDeselect: function(){
          this.qs1.cache();
          this.qs2.cache();
        }
      });
      // $("#my-select2").multiSelect();
      // $("#my-select3").multiSelect();
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
    }, 2500);

   
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

  // postNewCareProviderStaff() {
    
  // }

  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return day + "-" + month + "-" + year;
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
        latitude:["", [Validators.required]],
        serviceRadius:["",[Validators.required]]
    });
  }
  get type() {
      return this.typeValidationForm.controls;
  }

  getMainServicePackages() {
    this._appService.getServicePackages().subscribe(
      (response: any) => {
        debugger;
        if (response.status == APIResponse.Success) {
          this.serviceMainPackageList = ServicePackage.getServicePackageList(response);
        } else {
          console.log("Unable to get service packages");
        }
      },
      (err) => {
        console.log("Unable to get service packages");
      }
    );
  }

  getMainIndividualLabTests() {
    this._appService.getIndividualLabTestList().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.individualMainTestList = IndividualTest.getIndividualTestList(response);
      } else {
        console.log("server error");
      }
    }, err => {
      console.log("server error");
    });

  }

  getMainCommonServiceList() {
    
    this._appService.getCommonServices().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.commonMainServiceList = CommonService.getCommonServiceList(response.commonServices);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
    
  }

  async getLabDetails(serviceProviderId) {
    let params = {
      serviceProviderId: serviceProviderId
    }
    this._appService.getServiceProviderDetails(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          var details = ServiceProvider.getServiceProviderDetails(response)
          this.serviceProviderDetails = ServiceProvider.getServiceProviderDetails(response);
          this.typeValidationForm.patchValue({
                serviceProviderName: this.serviceProviderDetails[0].providerName,
                serviceProviderNameArabic: this.serviceProviderDetails[0].providerNameArabic,
                contactPerson: this.serviceProviderDetails[0].contactPersonName,
                contactPersonArabic: this.serviceProviderDetails[0].contactPersonNameArabic,
                mobile:this.serviceProviderDetails[0].phoneNumber,
                email: this.serviceProviderDetails[0].emailId,
                providerAddress: this.serviceProviderDetails[0].address,
                providerAddressArabic: this.serviceProviderDetails[0].adderssArabic,
                longitude:this.serviceProviderDetails[0].longitude,
                latitude: this.serviceProviderDetails[0].latitude,
                serviceRadius: this.serviceProviderDetails[0].serviceCoverageRadius
              });
              this.imgPreview = details[0].logoPath;
              if(details[0].ineligiblePackages != null) {
                this.ineligiblePackages = details[0].ineligiblePackages.split(",");
              }
              if(details[0].inelligibleLabTests != null) {
                this.inelligibleLabTests = details[0].inelligibleLabTests.split(",");
              }
              if(details[0].ineligibleOtherServices != null) {
                this.ineligibleOtherServices = details[0].ineligibleOtherServices.split(",");
              }
              
              // console.log($select1);
              // Array.prototype.forEach.call($select1[0].children, child => {
              //   console.log(this.ineligiblePackages.includes(child.value));
              // });
              
              
              // var $select2 = $("#my-select2");
              // var select1Option = $select2[0].options;
              // var $select3 = $("#my-select3");
              // var select1Option = $select3[0].options;


        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  AddNewLab() {
    
      if (this.typeValidationForm.invalid) {
          // alert("working");
          return;
      }
      let params = this.typeValidationForm.value;


      var selectedpackage = $("#my-select1").val();
      var selectedtests = $("#my-select2").val();
      var selectedservice = $("#my-select3").val();
      // alert(selectedpackage);
      selectedpackage.forEach((selectedpackage) => {
        let testVals = selectedpackage.split(":");
        //alert(testVals[1]);
        if (testVals.length > 1) {
          this.selectedPackage.push(testVals[1].trim());
        }
      });

      selectedtests.forEach((selectedtests) => {
          let testVals = selectedtests.split(":");
          // alert(testVals[1].trim());
          if (testVals.length > 1) {
            this.selectedTests.push(testVals[1].trim());
          }
      });

      selectedservice.forEach((selectedservice) => {
        let testVals = selectedservice.split(":");
        // alert(testVals[1].trim());
        if (testVals.length > 1) {
          this.selectedService.push(testVals[1].trim());
        }
      });
      
      params["excludedPackages"] = selectedpackage.toString();
      params["excludedLabTests"] = selectedtests.toString();
      params["excludedCommonServices"] = selectedservice.toString();
      params["serviceProviderId"] = this.selectedServiceProviderId;

      //console.log(params);
        
      

      // if (this.typeValidationForm.invalid) {
      //   // console.log(this.typeValidationForm.value);
      //   return;
      // }
      this._appService.postNewServiceProvider(params).subscribe((response: any) => {
          console.log(response);
          if (response.status == APIResponse.Success) {
              this.uploadLabImage(response.userId)
              Swal.fire("Success.", "Lab Updated successfully..!", "success");
              this.router.navigate(["../lab-list"]);
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
      } else {
        // this.closeNewServiceView();
        Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
      }
    });
  }


}

