import { Component, OnInit } from "@angular/core";
import { PromoHistory } from "src/model/promotions/promo-history.model";
import { Promotion } from "src/model/promotions/promotion.model";
import { AppService } from "src/service/app.service";
import { APIResponse } from "src/utils/app-constants";
import * as moment from "moment";
import { HttpClient } from '@angular/common/http';

declare var $: any;
@Component({
  selector: "app-promotion-history",
  templateUrl: "./promotion-history.component.html",
  styleUrls: ["./promotion-history.component.css"],
})
export class PromotionHistoryComponent implements OnInit {
  constructor(private _appService: AppService, private http: HttpClient) {
    this.getPromoHistory();
    this.getPromoList();
  }

  actualPromoHistoyList: PromoHistory[] = [];
  promoHistoryList: PromoHistory[] = [];
  promoList: Promotion[] = [];
  filterselectedPromotion;
  filterStartDate;
  filterEndDate;

  promotionList = 0;
  promotionUsed;
  promtotionDetail;

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });

    
    $('.onlygift').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-promotionhistory').addClass('active');

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
    $("#promotion-history-table thead tr").clone(true).addClass("filters").appendTo("#promotion-history-table thead");

  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawTable();
    }, 2500);
  }

  drawTable() {

    var filterIndexes = [0, 1, 2, 3, 4, 5, 6];
    var table = $("#promotion-history-table").DataTable({
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

  getPromoHistory() {
    this._appService.getPromoUsageHistory("").subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.actualPromoHistoyList = PromoHistory.getPromotionHistoryList(response);
          this.promoHistoryList = PromoHistory.getPromotionHistoryList(response);
          this.promotionList = this.promoHistoryList.length;
          this.promotionUsed = 0;
          this.promoHistoryList.forEach((x) => this.promotionUsed = this.promotionUsed + x.promoValue);
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
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  filterClicked(){
    this.promotionUsed = 0;
    $('#promotion-history-table').DataTable().destroy();
    var startDate;
    var endDate;

    if (this.filterStartDate != null) {
      startDate = moment(this.filterStartDate, "YYYY-MM-DD");
    }

    if (this.filterEndDate != null) {
      endDate = moment(this.filterEndDate, "YYYY-MM-DD");
    }

    if(this.filterselectedPromotion != 0){
      
      this.promoHistoryList = this.actualPromoHistoyList.filter((promo) =>promo.promoCodeApplied == this.filterselectedPromotion);
      if (startDate != null && endDate != null) {
        this.promoHistoryList = this.promoHistoryList.filter((promo) =>
          moment(promo.promoUsedDate, "DD-MM-YYYY").isSameOrAfter(startDate) &&
          moment(promo.promoUsedDate, "DD-MM-YYYY").isSameOrBefore(endDate)
        );
      } else if (startDate != null) {
        this.promoHistoryList = this.promoHistoryList.filter((promo) =>
          moment(promo.promoUsedDate, "DD-MM-YYYY").isSameOrAfter(startDate)
        );
      } else if (endDate != null) {
        this.promoHistoryList = this.promoHistoryList.filter((promo) =>
          moment(promo.promoUsedDate, "DD-MM-YYYY").isSameOrBefore(endDate)
        );
          
      }
      
      this.promotionList = this.promoHistoryList.length;
      this.promoHistoryList.forEach((x) => this.promotionUsed = this.promotionUsed + x.promoValue);
       
    }

  }

  promoSelect(event) {
    this.filterselectedPromotion = event.value;
  }

  filterClearClicked() {
      this.filterselectedPromotion = 0;
      this.filterStartDate = null;
      this.filterEndDate = null;
      this.getPromoHistory();
      
      $("#slotStartDate").val("");
      $("#slotEndDate").val("");
  }

  startDateChanged(event) {
    this.filterStartDate = event.target.value;
  }

  endDateChanged(event) {
    this.filterEndDate = event.target.value;
  }

}
