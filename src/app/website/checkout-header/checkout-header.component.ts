import { Component, OnInit } from '@angular/core';
import { WebsiteDataService } from 'src/service/website-data.service';
import { UtilService } from 'src/utils/util.service';

@Component({
  selector: 'app-checkout-header',
  templateUrl: './checkout-header.component.html',
  styleUrls: ['./checkout-header.component.css']
})
export class CheckoutHeaderComponent implements OnInit {

  cartData: any = []
  cartLength: number = 0; // Store the cart length here


  constructor(
    private _utilService: UtilService,
    private _websiteDataService: WebsiteDataService
  ) { 

    this.cartData = this._utilService.getCartData()
    
  }

  ngOnInit(): void {

    this._websiteDataService.cartLength$.subscribe(length => {
      this.cartLength = length;
    });

  }

  openMenu() {

    document.getElementById("menuBar").style.width = '100%'

  }

  closeMenu() {

    document.getElementById("menuBar").style.width = '0%'

  }

}