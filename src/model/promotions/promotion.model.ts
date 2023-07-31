import * as moment from "moment";
export class Promotion {
  promoId: number;
  promoName: string;
  promoNameArabic: string;
  promoDescription: string;
  promoDescriptionArabic: string;
  promoCode: string;
  promoType: number;
  promoValue: number;
  isActive: number;
  applicableSectorId: number;
  startDate: string;
  endDate: string;
  promoImagePath: string;
  promoValueText: string;

  static getPromotionList(data): Promotion[] {
    var promotionList: Promotion[] = [];
    let promoData = data["promoList"];
    promoData.forEach((promo) => {
      let promotion = new Promotion();
      promotion.promoId = promo.promoId;
      promotion.promoName = promo.promoName;
      promotion.promoNameArabic = promo.promoNameArabic;
      promotion.promoDescription = promo.promoDescription;
      promotion.promoDescriptionArabic = promo.promoDescriptionArabic;
      promotion.promoCode = promo.promoCode;
      promotion.promoType = promo.promoType;
      promotion.promoValue = promo.promoValue;

      if (promotion.promoType == 2) {
        promotion.promoValueText = promo.promoValue + "%";
      } else {
        promotion.promoValueText = "SAR" + promo.promoValue;
      }

      promotion.isActive = promo.isActive;
      promotion.applicableSectorId = promo.applicableSectorId;
      promotion.startDate = moment(promo.startDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      promotion.endDate = moment(promo.endDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      promotion.promoImagePath = promo.promoImagePath;
      promotionList.push(promotion);
    });
    return promotionList;
  }
}
