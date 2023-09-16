import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/service/language.service';
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
    public languageService: LanguageService
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

  switchLanguage(lang: string) {

    this.languageService.setLanguage(lang);
    this.onLanguageChange(lang);
    this.closeMenu()
  }

  onLanguageChange(language: string) {

    const currentLanguage = this.languageService.getCurrentLanguage();
    const body = document.getElementsByTagName('body')[0];
  
    if (language === 'ar') {
      body.setAttribute('dir', 'rtl');
      body.classList.add('web-font-ar');
      body.classList.remove('web-font');
    } else {
      body.setAttribute('dir', 'ltr');
      body.classList.add('web-font');
      body.classList.remove('web-font-ar');
    }
  }

}