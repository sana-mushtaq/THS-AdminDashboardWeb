// goSell.service.ts

import { Injectable } from '@angular/core';

declare var goSell: any;

@Injectable({
  providedIn: 'root',
})
export class GoSellService {
  private config: any;

  setConfig(config: any): void {
    this.config = config;
  }

  openLightBox(): void {
    goSell.openLightBox();
  }

  openPaymentPage(): void {
    goSell.openPaymentPage();
  }
}