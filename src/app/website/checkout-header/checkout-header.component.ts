import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientsService } from 'src/service/patient.service';
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
  userId: any

  constructor(
    private _utilService: UtilService,
    private _websiteDataService: WebsiteDataService,
    private router: Router,
    private _patientService: PatientsService,
  ) { 

    this.cartData = this._utilService.getCartData()
    
  }

  ngOnInit(): void {

    this._websiteDataService.cartLength$.subscribe(length => {
      this.cartLength = length;
    });

    this.userId = localStorage.getItem("THSUserId")

  }

  openMenu() {

    document.getElementById("menuBar").style.width = '100%'

  }

  closeMenu() {

    document.getElementById("menuBar").style.width = '0%'

  }

  navigate(link) {

    this.router.navigate([link])
  }

  navigateToLogin() {

    if(this.userId !== null) {

      this.router.navigate(['/user/profile'])

    } else {

      this.router.navigate(['/login'])

    }

  }

}