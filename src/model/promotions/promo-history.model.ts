import * as moment from "moment";
export class PromoHistory {
  quoteId: number;
  promoCodeApplied: number;
  paidByUserId: number;
  promoValue: string;
  modifiedDate: string;
  appointmentId: number;
  primaryPatientId: number;
  promoName: string;
  promoType: string;
  patientFirstName: string;
  patientLastName: string;
  promoAvailedDate: string;
  promoUsedDate: string;
  promoCode: string;

  static getPromotionHistoryList(data): PromoHistory[] {
    var promotionHistoryList: PromoHistory[] = [];
    let promoData = data["promoHistory"];
    promoData.forEach((promo) => {
      let promotion = new PromoHistory();
      promotion.quoteId = promo.quoteId;
      promotion.promoCodeApplied = promo.promoCodeApplied;
      promotion.promoValue = promo.promoValue;
      promotion.modifiedDate = promo.modifiedDate;
      promotion.appointmentId = promo.appointmentId;
      promotion.promoName = promo.promoName;
      promotion.patientFirstName = promo.firstName;
      promotion.patientLastName = promo.lastName;
      promotion.promoAvailedDate = moment(promo.modifiedDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      promotion.promoUsedDate = moment(promo.promoUsedDate, "YYYY-MM-DD HH:mm:ss ZZ").format("DD-MM-YYYY");
      promotion.promoCode = promo.promoCode;
      promotionHistoryList.push(promotion);
    });
    return promotionHistoryList;
  }
}
