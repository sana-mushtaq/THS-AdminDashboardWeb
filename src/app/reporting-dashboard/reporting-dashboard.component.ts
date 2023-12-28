import { Component, OnInit } from '@angular/core';
import { StatsService } from 'src/service/stats.service';
import { APIResponse } from 'src/utils/app-enum'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ServiceService } from 'src/service/service.service';
import { ServicecategoryService } from 'src/service/servicecategory.service';
import { BranchService } from 'src/service/branch.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reporting-dashboard',
  templateUrl: './reporting-dashboard.component.html',
  styleUrls: ['./reporting-dashboard.component.css']
})

export class ReportingDashboardComponent implements OnInit {
  
  branchList: any = []
  currentBranch: number = 1;

  patientCount: number = 0;
  startDatePatientCount: string;
  endDatePatientCount: string;

  patientCountPerDay: number = 0;
  startDatePatientCountPerDay: string;
  endDatePatientCountPerDay: string;

  appointmentScheduled: number = 0;
  startDateAppointmentScheduled: string;
  endDateAppointmentScheduled: string;

  appointmentCanceled: number = 0;
  startDateAppointmentCanceled: string;
  endDateAppointmentCanceled: string;

  confidenceInTreatment: any = {};

  serviceList: any = []
  serviceSettings: IDropdownSettings = {}
  selectedIds: number[] = [];
  startDateService: string;
  endDateService: string;
  serviceRevenue: number = 0;
  bestSellerServices: any = [];
  
  categoryList: any = []
  categorySettings: IDropdownSettings = {}
  categoryIds: number[] = [];
  startDateCategory: string;
  endDateCategory: string;
  categoryRevenue: number = 0;
  bestSellerCategory: any = [];

  numberOfStaff: number = 0;
  totalAdmin: number = 0;
  totalPracticeUsers: number = 0;
  totalManagers: number = 0;
  totalSupervisor: number = 0;
  totalCC: number = 0;
  totalIT: number = 0;

  staffPerformance: any = {};

  utilizationRate: any = {};
  startDateUtilizationRate: string;
  startTimeUtilizationRate: string;
  endTimeUtilizationRate: string;

  userRoles: any = {}
  jsonData: any;
  loaded: boolean = false;

  constructor(
    private statService: StatsService, 
    private _service: ServiceService,
    private _serviceCategory: ServicecategoryService,
    private _branchService: BranchService,
    private http: HttpClient) { }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });

    $('#nav_settings').addClass('active');
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    
    this.serviceSettings = {
      idField: 'id',
      textField: 'title_arabic',
      allowSearchFilter: true,
      singleSelection: false, // Set to true for single selection
      enableCheckAll: false,
    }

    this.categorySettings = {
      idField: 'id',
      textField: 'title_arabic',
      allowSearchFilter: true,
      singleSelection: false, // Set to true for single selection
      enableCheckAll: false,
    }


    this.getBranchList()

  }

  getPatientCount(): void {

    let params = {

      sp: this.currentBranch,
      start_date: this.startDatePatientCount,
      end_date:this.endDatePatientCount

    }

       //now we will get a list of categories from the backend
      this.statService.getPatientCount(params).subscribe({
      
        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {

            this.patientCount = res.data.recordCount;

          } 
        },
        error: ( err: any ) => {

          console.log(err)

        }
    
      })

  }

  getPatientCountPerDay(): void {

    let params = {
      sp: this.currentBranch,
      start_date: new Date(),

    }

      //now we will get a list of categories from the backend
    this.statService.getPatientCountPerDay(params).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.patientCountPerDay = res.data.recordCount;

        } 
      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })

  }

  getAppointmentScheduled(): void {

    let params = {
      sp: this.currentBranch,
      start_date: this.startDateAppointmentScheduled,
      end_date:this.endDateAppointmentScheduled

    }

       //now we will get a list of categories from the backend
      this.statService.getAppointmentScheduled(params).subscribe({
      
        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {

            this.appointmentScheduled = res.data.recordCount;

          } 
        },
        error: ( err: any ) => {

          console.log(err)

        }
    
      })

  }

  getAppointmentCanceled(): void {

    let params = {
      sp: this.currentBranch,
      start_date: this.startDateAppointmentCanceled,
      end_date:this.endDateAppointmentCanceled

    }

    //now we will get a list of categories from the backend
    this.statService.getAppointmentCanceled(params).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.appointmentCanceled = res.data.recordCount;

        } 
      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })

  }

  getConfidenceInTreatment(): void {

    let params = {
      sp: this.currentBranch,
      start_date: "2023"
    }

    //now we will get a list of categories from the backend
    this.statService.getConfidenceInTreatment(params).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          console.log(res.data);
          this.confidenceInTreatment = res.data;

        } 
      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })

  }

  getKeyValues(obj: { [key: string]: any }): { key: string, value: any }[] {
    return Object.keys(obj || {}).map(key => ({ key, value: obj[key] }));
  }
  
  round(value: number, decimals: number): number {
    return Number(value.toFixed(decimals));
  }
  clearFilters(): void {
    this.startDatePatientCount = '';
    this.endDatePatientCount = '';
    this.getPatientCount();
  }

  submitFilters(): void {
    this.getPatientCount();
  }

  clearFiltersAppointmentScheduled(): void {
    this.startDateAppointmentScheduled = '';
    this.endDateAppointmentScheduled = '';
    this.getAppointmentScheduled();
  }

  submitFiltersAppointmentScheduled(): void {
    this.getAppointmentScheduled();
  }

  clearFiltersAppointmentCanceled(): void {
    this.startDateAppointmentCanceled = '';
    this.endDateAppointmentCanceled = '';
    this.getAppointmentCanceled();
  }

  submitFiltersAppointmentCanceled(): void {
    this.getAppointmentCanceled();
  }

  getServiceList() {

    //now we will get a list of categories from the backend
    this._service.getServiceList().subscribe({
  
      next : ( res : any ) => {
  
        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
  
          this.serviceList = res.data
          this.getServiceRevenue();
        } 
        
      },
      error: ( err: any ) => {
  
        console.log(err)
  
      }
    
    })
    
  }

  setPreferredService(selectedItems: any): void {
    // Handle the selection logic here
    console.log('Selected Items:', selectedItems);
    
    // Extract and push the IDs to the selectedIds array
    const selectedIdas = selectedItems.id;
    this.selectedIds.push(selectedIdas);

    // Add your logic to process the selected items
  }

  unsetPreferredService(unselectedItems: any): void {
    // Handle the deselection logic here
    console.log('Unselected Items:', unselectedItems);
    
    // Extract and remove the IDs from the selectedIds array
    const unselectedIds = unselectedItems.id;
    this.selectedIds = this.selectedIds.filter((id) => !unselectedIds.includes(id));

    // Add your logic to process the unselected items
  }

  submitFiltersService(): void {
    this.getServiceRevenue();
  }

  clearFiltersService(): void {
    this.startDateService = '';
    this.endDateService = '';
    this.selectedIds = [];
    this.getServiceRevenue();
  }

  getServiceRevenue() {

    let params = {
      sp: this.currentBranch,
      start_date: this.startDateService,
      end_date:this.endDateService,
      selectedServices: this.selectedIds

    }

       //now we will get a list of categories from the backend
      this.statService.getServiceRevenue(params).subscribe({
      
        next : ( res : any ) => {

          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {
            this.serviceRevenue = res.data.totalRevenue;
            this.bestSellerServices = res.data.bestSellers;

          } 
        },
        error: ( err: any ) => {

          console.log(err)

        }
    
      })

  }

  getCategoryList() {

      //now we will get a list of categories from the backend
      this._serviceCategory.getCategoryList().subscribe({
      
       next : ( res : any ) => {
   
         //in case of success the api returns 0 as a status code
         if( res.status === APIResponse.Success) {
   
           this.categoryList = res.data
           this.getCategoryRevenue();
         }
         
       },
       error: ( err: any ) => {
   
         console.log(err)
   
       }
    
     })
   
  }

  setPreferredCategory(selectedItems: any): void {
    // Handle the selection logic here
    console.log('Selected Items:', selectedItems);
    
    // Extract and push the IDs to the selectedIds array
    const selectedIdas = selectedItems.id;
    this.categoryIds.push(selectedIdas);

    // Add your logic to process the selected items
  }

  unsetPreferredCategory(unselectedItems: any): void {
    // Handle the deselection logic here
    console.log('Unselected Items:', unselectedItems);
    
    // Extract and remove the IDs from the selectedIds array
    const unselectedIds = unselectedItems.id;
    this.categoryIds = this.categoryIds.filter((id) => !unselectedIds.includes(id));

    // Add your logic to process the unselected items
  }

  submitFiltersCategory(): void {
    this.getCategoryRevenue();
  }

  clearFiltersCategory(): void {
    this.startDateCategory = '';
    this.endDateCategory = '';
    this.categoryIds = [];
    this.getCategoryRevenue();
  }

  getCategoryRevenue() {

    let params = {
      sp: this.currentBranch,
      start_date: this.startDateCategory,
      end_date:this.endDateCategory,
      selectedCategory: this.categoryIds

    }

    //now we will get a list of categories from the backend
    this.statService.getCategoryRevenue(params).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          this.categoryRevenue = res.data.totalRevenue;
          this.bestSellerCategory = res.data.bestSellers;

        } 
      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })

  }

  getNumberOfStaff() {

    
    let params = {

      branh_id: this.currentBranch

    }

    //now we will get a list of categories from the backend
    this.statService.getNumberOfStaff(params).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.numberOfStaff = res.data.totalUsers;
          this.totalAdmin = res.data.totalAdmin;
          this.totalPracticeUsers = res.data.totalPracticeUsers;
          this.totalManagers = res.data.totalManagers;
          this.totalSupervisor = res.data.totalSupervisors;
          this.totalCC = res.data.totalCustomerCare;
          this.totalIT = res.data.totalIT;

        } 

      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })

  }

  getStaffPerformance(): void {

    let params = {
      sp: this.currentBranch,
      start_date: "2023"
    }

    //now we will get a list of categories from the backend
    this.statService.getStaffPerformance(params).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          console.log(res.data);
          this.staffPerformance = res.data;

        } 
      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })

  }

  getUtilizationRate() {
   
    let params = {
      sp: this.currentBranch,
      start_date: this.startDateUtilizationRate
      
    }

    //now we will get a list of categories from the backend
    this.statService.getUtilizationRate(params).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          console.log(res.data);
          this.utilizationRate = res.data;

        } 
      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })

  }

  submitFiltersUtilizationRate(): void {
    this.getUtilizationRate();
  }

  clearFiltersUtilizationRate(): void {
    this.startDateUtilizationRate = '';
    this.getUtilizationRate();
  }

  getBranchList() {

    //now we will get a list of branches from the backend
    this._branchService.getBranchList().subscribe({
   
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.branchList = res.data

          if((this.userRoles['role'] !== 'manager')) {

            this.currentBranch = this.userRoles['sp']
            this.calculateStats();
          } else {

            this.calculateStats();

          }

        }
        
      },
      error: ( err: any ) => {

        console.log(err)

      }
   
    })

  }

  calculateStats() {

    this.getPatientCount(); // Fetch initial patient count
    this.getPatientCountPerDay(); // Fetch initial patient count
    this.getAppointmentScheduled(); // Fetch initial patient count
    this.getAppointmentCanceled(); // Fetch initial patient count
    this.getConfidenceInTreatment();
    this.getServiceList();
    this.getCategoryList();
    this.getNumberOfStaff();
    this.getStaffPerformance();
    this.getUtilizationRate();
  }

  setCurrentBranch(event) {

    this.currentBranch = event.value;
    this.calculateStats();
  }

  
formatCurrency(value: number): string {
  // Use Angular currency pipe to format the number as currency
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(value);
}


}