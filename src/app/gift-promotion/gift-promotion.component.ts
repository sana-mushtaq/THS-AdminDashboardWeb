import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sector } from "src/model/common/sector.model";
import { Promotion } from "src/model/promotions/promotion.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { APIResponse, FileUploadType } from "src/utils/app-constants";
import * as moment from "moment";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-gift-promotion",
  templateUrl: "./gift-promotion.component.html",
  styleUrls: ["./gift-promotion.component.css"],
})
export class GiftPromotionComponent implements OnInit {
  promoList: Promotion[] = [];
  slectedSectorId = 0;
  selectedPromoType = 1;
  sectorList: Sector[] = [];
  selectedFile: File;
  isEditEnabled = false;
  newPromoForm: FormGroup;
  selectedPromotion: Promotion;
  filterselectedPromotion: Number;
  activePromotions: Promotion[] = [];
  inActivePromotions: Promotion[] = [];
  influencerStatus;

  filterStartDate;
  filterEndDate;

  constructor(private _appService: AppService, private _appUtil: UtilService, public formBuilder: FormBuilder) {
    this.getPromoList();
    this.getServiceSectors();
  }

  activecard() {
    $(".in_ac_cards").hide();
    $(".active_card_space").show();
  }
  inactivecard() {
    $(".in_ac_cards").hide();
    $(".inactive_card_space").show();
  }

  ngOnInit(): void {
    $(".onlygift").removeClass("dclass");
    $(".onlyadmin").removeClass("dclass");
    $(".active-promotion").addClass("active");

    this.formValidation();

    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    });

    $("#files_department").on("change", function (e) {
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
  }

  promotionClicked(promotion) {
    this.selectedPromotion = promotion;
    this.isEditEnabled = true;

    if (this.selectedPromotion != null) {
      let pStartDate = moment(this.selectedPromotion.startDate, "DD-MM-YYYY");
      let pEndDate = moment(this.selectedPromotion.endDate, "DD-MM-YYYY");
      this.newPromoForm.patchValue({
        promoName: this.selectedPromotion.promoName,
        promoNameArabic: this.selectedPromotion.promoNameArabic,
        promoDescription: this.selectedPromotion.promoDescription,
        promoDescriptionArabic: this.selectedPromotion.promoDescriptionArabic,
        promoCode: this.selectedPromotion.promoCode,
        promoValue: this.selectedPromotion.promoValue,
        startDate: pStartDate.toDate(),
        endDate: pEndDate.toDate(),
      });
      // $('<span class="pip">' + '<img class="imageThumb" src="' + this.selectedPromotion.promoImagePath + '" />' + '<br/><span class="remove">Remove image</span>' + "</span>").insertAfter("#beforefilepreview");
      $(".new_btn").click();
    }
  }

  formValidation() {
    this.newPromoForm = this.formBuilder.group({
      promoName: ["", [Validators.required]],
      promoNameArabic: ["", [Validators.required]],
      promoDescription: ["", [Validators.required]],
      promoDescriptionArabic: ["", [Validators.required]],
      promoCode: ["", [Validators.required]],
      promoValue: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });
  }

  getServiceSectors() {
    this._appService.getSectorList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.sectorList = [];
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

  getPromoList() {
    this._appService.getPromoList("").subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.promoList = Promotion.getPromotionList(response);
          this.activePromotions = this.promoList.filter((promo) => promo.isActive == 0);
          this.inActivePromotions = this.promoList.filter((promo) => promo.isActive == 1);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  updatePromoStatusToServer(params) {
    this._appService.updatePromoStatus(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire("Success.", "Promotion has been updated successfully..!", "success");
          this.getPromoList();
        } else {
          Swal.fire("Error.", "Unable to update the promotion. Please try again..!", "error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  sectorChanged(event) {
    this.slectedSectorId = event.value;
  }

  handleFileInput(event) {
    this.selectedFile = event.files.item(0);
  }

  promoTypeClicked(promoType) {
    this.selectedPromoType = promoType;
  }

  updatePromotionStatus(promotion, status) {
    let params = {
      promoStatus: status,
      promoId: promotion.promoId,
    };
    this.updatePromoStatusToServer(params);
  }

  postNewPromo() {
    if (this.newPromoForm.invalid) {
      return;
    } else {
      var params = this.newPromoForm.value;
      if (this.isEditEnabled == true) {
        params["promoId"] = this.selectedPromotion.promoId;
      } else {
        params["promoId"] = 0;
      }

      params["applicableSectorId"] = this.slectedSectorId;
      params["promoType"] = this.selectedPromoType;
      params["isInfluancerPromo"] = this.influencerStatus;
      params["isActive"] = 0;

      this._appService.addOrUpdatePromo(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            if (this.isEditEnabled == true) {
              Swal.fire("Congratulations.", "Promotion has been updated successfully..!", "success");
            } else {
              if (this.selectedFile != null) {
                this.uploadPromoImage(response.promoId);
              } else {
                Swal.fire("Congratulations.", "New promotion has been created successfully..!", "success");
              }
            }
            this.getPromoList();
            this.isEditEnabled == false;
          } else {
            Swal.fire("Error.", "Unable to create promotion. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  uploadPromoImage(promoId) {
    this._appService.uploadfileToServer(this.selectedFile, FileUploadType.PromoImage, promoId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        if (this.isEditEnabled) {
          Swal.fire("Congratulations.", "New promotion has been created successfully..!", "success");
        } else {
          Swal.fire("Congratulations.", "New promotion has been created successfully..!", "success");
        }
        this.getPromoList();
        this.closeNewServiceView();
      } else {
        this.closeNewServiceView();
        Swal.fire("Error.", "Something went wrong. Unable to upload the service image..!", "error");
      }
    });
  }

  closeNewServiceView() {
    $("#newPromoModal").hide();
    this.clearForm();
  }

  clearForm() {
    (<HTMLFormElement>document.getElementById("newPromoForm")).reset();
  }

  filterClicked() {
    var startDate;
    var endDate;

    if (this.filterStartDate != null) {
      startDate = moment(this.filterStartDate, "YYYY-MM-DD");
    }

    if (this.filterEndDate != null) {
      endDate = moment(this.filterEndDate, "YYYY-MM-DD");
    }

    if (this.filterselectedPromotion != 0) {
      this.activePromotions = this.promoList.filter((promo) => promo.isActive == 0 && promo.promoId == this.filterselectedPromotion);
      this.inActivePromotions = this.promoList.filter((promo) => promo.isActive == 1 && promo.promoId == this.filterselectedPromotion);
      if (startDate != null && endDate != null) {
        this.activePromotions = this.promoList.filter(
          (promo) =>
            promo.isActive == 0 && moment(promo.startDate, "DD-MM-YYYY").isSameOrAfter(startDate) && moment(promo.endDate, "DD-MM-YYYY").isSameOrBefore(endDate)
        );
        this.inActivePromotions = this.promoList.filter(
          (promo) =>
            promo.isActive == 1 && moment(promo.startDate, "DD-MM-YYYY").isSameOrAfter(startDate) && moment(promo.endDate, "DD-MM-YYYY").isSameOrBefore(endDate)
        );
      } else if (startDate != null) {
        this.activePromotions = this.promoList.filter((promo) => promo.isActive == 0 && moment(promo.startDate, "DD-MM-YYYY").isSameOrAfter(startDate));
        this.inActivePromotions = this.promoList.filter((promo) => promo.isActive == 1 && moment(promo.startDate, "DD-MM-YYYY").isSameOrAfter(startDate));
      } else if (endDate != null) {
        this.activePromotions = this.promoList.filter((promo) => promo.isActive == 0 && moment(promo.endDate, "DD-MM-YYYY").isSameOrBefore(endDate));
        this.inActivePromotions = this.promoList.filter((promo) => promo.isActive == 1 && moment(promo.endDate, "DD-MM-YYYY").isSameOrBefore(endDate));
      }
    } else {
      this.activePromotions = this.promoList.filter((promo) => promo.isActive == 0);
      this.inActivePromotions = this.promoList.filter((promo) => promo.isActive == 1);
    }
  }

  promoSelect(event) {
    this.filterselectedPromotion = event.value;
  }

  filterClearClicked() {
    this.filterselectedPromotion = 0;
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.activePromotions = this.promoList.filter((promo) => promo.isActive == 0);
    this.inActivePromotions = this.promoList.filter((promo) => promo.isActive == 1);
    $("#slotStartDate").val("");
    $("#slotEndDate").val("");
  }

  startDateChanged(event) {
    this.filterStartDate = event.target.value;
  }

  endDateChanged(event) {
    this.filterEndDate = event.target.value;
  }

  influencerStatusChange(event) {
    if (event.checked == true) {
      this.influencerStatus = 1;
    }
    if (event.checked == false) {
      this.influencerStatus = 0;
    }
  }
}
