import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteDataService } from 'src/service/website-data.service';
import { UtilService } from 'src/utils/util.service';
import { environment } from 'src/environments/environment'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {

  public serverUrl : string = environment.domainName

  serviceId: string
  currentService: any
  serviceVariants: any
  cartData: any = []

  showErrorCart: boolean = false
  cartLength: number = 0; // Store the cart length here
  sanitizedWhatsappUrl: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private dataService: WebsiteDataService,
    private _utilService: UtilService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient

  ) {

    this.dataService.cartLength$.subscribe(length => {
      this.cartLength = length;
    });
    
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.serviceId = params['serviceId'];

      this.dataService.data$.subscribe((res) => {

        if (res) {

          this.currentService = res.services.filter(service => {

            return service.id === Number(this.serviceId)

          })

          this.sanitizedWhatsappUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentService[0].whatsapp_url);



          if(this.currentService.length>0) {

            this.currentService = this.currentService[0]

            this.serviceVariants = res.services.filter(service => {
  
              return Number(service.primary_service_id) === Number(this.currentService.id)
  
            })

          } else {

            this.router.navigate([''])

          } 

        }

      })

    })

  }

  addToCart(service) {

    //first we will check that cart is empty or contains services from same category
    this.cartData = this._utilService.getCartData()

    let checkCategory = this.cartData.filter(category => {

      return service.category_id !== category.category_id

    })

    if(this.cartData.length === 0 || checkCategory.length === 0) {

      let cartItem = {

        'id': service.id,
        'title': service.title,
        'price': service.price,
        'icon': service.icon,
        'category_id': service.category_id,
        'description': service.description,
        'user': null
      }

      this.cartData.push(cartItem)
      this._utilService.addToCart(this.cartData)

    } else {

      this.showErrorCart = true

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


}
