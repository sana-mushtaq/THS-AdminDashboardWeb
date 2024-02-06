import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteDataService } from 'src/service/website-data.service';
import { environment } from 'src/environments/environment'
import { LanguageService } from 'src/service/language.service';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class AllCategoriesComponent implements OnInit {
  
  public serverUrl : string = environment.domainName

  // Define variables for controlling the number of items to display.
  itemsToShowInitially = 10;
  itemsToLoadMore = 10;

  categoryUrl: string
  currentCategory: any
  allServices: any
  topServices: any = {}

  
  searchQuery: string = ''; // Add this property for the search query
  filteredServices: any; // Add this property to hold filtered services


  constructor(
    private route: ActivatedRoute,
    private dataService: WebsiteDataService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {

    this.getComponentData()
  
  }
   
   getComponentData() {
 
    this.route.params.subscribe(params => {

      this.categoryUrl = params['categoryUrl']

      this.dataService.data$.subscribe((res) => {
 
        if (res) {
        
          this.currentCategory = res.categories.find(

            category => category.url === this.categoryUrl

          )
 
         if (this.currentCategory) {
          
          this.topServices = res.services.filter(
          
            service => service.category_id === this.currentCategory.id && service.top === 1
          
          )

          this.topServices = this.topServices.splice(0, 4)
 
          this.allServices = res.services

          this.allServices = this.allServices.filter(service => {

            return service.category_id === this.currentCategory.id
          })

          this.allServices = this.allServices.filter(service => {

            return service.primary_service_id === null
          
          })

          }
  
        }
  
      })

    })
  
   }

   navigateToService(serviceId) {

    let service = this.allServices.filter(s => {

      return s.id === serviceId

    })

    // Set the category ID in the service and navigate to the dynamic category URL
    this.dataService.setServiceId(service[0].id);

    // Use the Router service to navigate to the dynamic category URL with query parameter
    this.router.navigate(['/medical-services', service[0].id])

  }
 
  // Function to load more items
  loadMoreItems() {
    this.itemsToShowInitially += this.itemsToLoadMore;
  }
  
  // Function to filter services based on the search query
  search(): void {
    if (this.searchQuery.trim() === '') {
      // If search query is empty, show all services
      this.filteredServices = this.allServices;
    } else {
      // Filter services based on the search query
      this.filteredServices = this.allServices.filter(service => {
        // Check if the English title or Arabic title contains the search query
        return service.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              service.title_arabic.toLowerCase().includes(this.searchQuery.toLowerCase());
      });

    }
  }

}
