export class ServicePrice {
    quoteId: number;
    serviceCost: number;
    homeVisitCost: number;
    discounts: number;
    vat: number;
    totalServiceCost: number;

    static getServiceprice(priceResponse): ServicePrice {
        let servicePrice = new ServicePrice();
        servicePrice.quoteId = priceResponse.quoteId;
        servicePrice.serviceCost = priceResponse.serviceCost;
        servicePrice.homeVisitCost = priceResponse.homeVisitCost;
        servicePrice.discounts = priceResponse.discounts;
        servicePrice.vat = priceResponse.vat;
        servicePrice.totalServiceCost = priceResponse.totalServiceCost;
        return servicePrice;
    }
}
