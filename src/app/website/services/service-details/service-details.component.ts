import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteDataService } from 'src/service/website-data.service';
import { UtilService } from 'src/utils/util.service';
import { environment } from 'src/environments/environment'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from 'src/service/language.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {

  displayShowCheckout: any;
  showCheckoutButton: boolean = false;
  public serverUrl : string = environment.domainName

  addedToCart = []

  serviceId: string
  currentService: any
  serviceVariants: any
  cartData: any = []

  showErrorCart: boolean = false
  cartLength: number = 0; // Store the cart length here
  sanitizedWhatsappUrl: SafeResourceUrl;

  cartToggle: boolean = false

  constructor(
    private route: ActivatedRoute,
    private dataService: WebsiteDataService,
    private _utilService: UtilService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public languageService: LanguageService
  ) {

    this.dataService.cartLength$.subscribe(length => {
      this.cartLength = length;
    });
    
  }

  ngOnInit(): void {

    this.displayShowCheckout = localStorage.getItem("showCheckout");
    if(this.displayShowCheckout === 'none') {
      this.showCheckoutButton = true;
    }

    this.route.params.subscribe(params => {

      this.serviceId = params['serviceId'];

      this.dataService.data$.subscribe((res) => {

        if (res && res !== null && res.services && res.services.length>0) {

          this.currentService = res.services.filter(service => {

            return service.id === Number(this.serviceId)

          })

          this.sanitizedWhatsappUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentService[0].whatsapp_url);

          console.log(this.currentService.length);
          if(this.currentService.length>0) {
           
            this.currentService = this.currentService[0]
            this.serviceVariants = res.services.filter(service => {
  
              return Number(service.primary_service_id) === Number(this.currentService.id)
  
            })


          } else {

            this.router.navigate([''])

          } 

        } else {

          //this.router.navigate([''])

        }

      })

    })

  }

  addToCart(service) {

    //first we will check that cart is empty or contains services from same category
    this.cartData = this._utilService.getCartData()

  /*  let checkCategory = this.cartData.filter(category => {

      return service.category_id !== category.category_id

    })
*/
    /*if(this.cartData.length === 0 || checkCategory.length === 0) {
*/
      let cartItem = {

        'id': service.id,
        'title': service.title,
        'title_arabic': service.title_arabic,
        'price': service.price,
        'icon': service.icon,
        'category_id': service.category_id,
        'description': service.description,
        'description_arabic': service.description_arabic,
        'user': null
      }

      this.cartData.push(cartItem)
      this._utilService.addToCart(this.cartData)


      let newMessage = {}
      
      if(this.languageService.getCurrentLanguage() === 'en') {
        newMessage = { text: 'Service added to cart.', visible: true };

      } 
      if(this.languageService.getCurrentLanguage() === 'ar') {
        newMessage = { text: 'تمت إضافة الخدمة إلى السلة', visible: true };

      } 
    
      this.addedToCart.push(newMessage);
      this.cartToggle = true
    // Set a timeout to hide the message after a certain duration (e.g., 3 seconds)
      setTimeout(() => {
      
        this.hideMessage(newMessage);
      
      }, 2000); // 3000 milliseconds = 3 secon

    /*}/* else {

      this.showErrorCart = true

    }*/

  }

  hideMessage(message: any) {
    // Set visibility to false to trigger the fade-out animation
    message.visible = false;

    // Remove the message from the array after the fade-out animation completes
    setTimeout(() => {
      this.removeMessage(message);
    }, 500); // 500 milliseconds (adjust as needed for your animation duration)
  }

  removeMessage(message: any) {
    // Remove the message from the array
    const index = this.addedToCart.indexOf(message);
    if (index !== -1) {
      this.addedToCart.splice(index, 1);
    }
  }

  handleCancelClick(): void {}

  //alert continue button handler
  handleContinueClick(): void {

    this.showErrorCart = false

  }

  getSafeUrl( url : string ){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goToCart() {

    this.router.navigate(['/checkout/cart'])

  }

}