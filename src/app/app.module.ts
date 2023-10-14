import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { NgSelect2Module } from 'ng-select2';
import { NgxSummernoteModule } from 'node_modules/ngx-summernote';
import * as $ from "jquery";
import {MatTabsModule} from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./header/header.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EmployeesComponent } from "./employees/employees.component";
import { PhysiotherapistComponent } from "./physiotherapist/physiotherapist.component";
import { NurseComponent } from "./nurse/nurse.component";
import { TechnicianComponent } from "./technician/technician.component";
import { ReceptionistComponent } from "./receptionist/receptionist.component";
import { AccountantComponent } from "./accountant/accountant.component";
import { PatientlistComponent } from "./patientlist/patientlist.component";
import { AdddocComponent } from "./adddoc/adddoc.component";
import { DoclistComponent } from "./doclist/doclist.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { LablistComponent } from "./lablist/lablist.component";
import { RoleManagerComponent } from "./role-manager/role-manager.component";
import { ListComponent } from "./list/list.component";
import { PackageComponent } from "./package/package.component";
import { LabtechPackagelistComponent } from "./labtech-packagelist/labtech-packagelist.component";
import { EmployerPackagelistComponent } from "./employer-packagelist/employer-packagelist.component";
import { MasterComponent } from "./master/master.component";
import { TreatmentsComponent } from "./treatments/treatments.component";
import { TestsComponent } from "./tests/tests.component";
import { ServicesComponent } from "./services/services.component";
import { TestComponent } from "./test/test.component";
import { SettingsComponent } from "./settings/settings.component";
import { AppointmentComponent } from "./appointment/appointment.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { RateandreviewComponent } from "./rateandreview/rateandreview.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SubmenuComponent } from "./submenu/submenu.component";
import { AddUserComponent } from "./add-user/add-user.component";
import { AddDoctorComponent } from "./add-doctor/add-doctor.component";
import { AddPhysiotherapistComponent } from "./add-physiotherapist/add-physiotherapist.component";
import { AddNurseComponent } from "./add-nurse/add-nurse.component";
import { AddReceptionistComponent } from "./add-receptionist/add-receptionist.component";
import { AddAccountantComponent } from "./add-accountant/add-accountant.component";
//import { AppointmentsViewComponent } from './appointments-view/appointments-view.component';
import { DoctorsComponent } from "./doctors/doctors.component";
import { AddTechnicianComponent } from "./add-technician/add-technician.component";
import { ScheduledComponent } from "./scheduled/scheduled.component";
import { NotScheduledComponent } from "./not-scheduled/not-scheduled.component";
import { ViewDoctorComponent } from "./view-doctor/view-doctor.component";
import { EditDoctorComponent } from "./edit-doctor/edit-doctor.component";
import { AddTreatmentComponent } from "./add-treatment/add-treatment.component";
import { AddTestComponent } from "./add-test/add-test.component";
import { EditNursepackageComponent } from "./edit-nursepackage/edit-nursepackage.component";
import { EditLabtechpackageComponent } from "./edit-labtechpackage/edit-labtechpackage.component";
import { EditRoleComponent } from "./edit-role/edit-role.component";
import { EditApplicationComponent } from "./edit-application/edit-application.component";
import { EditAppointmentComponent } from "./edit-appointment/edit-appointment.component";
import { ViewPhysiotherapistComponent } from "./view-physiotherapist/view-physiotherapist.component";
import { EditPhysiotherapistComponent } from "./edit-physiotherapist/edit-physiotherapist.component";
import { ViewNurseComponent } from "./view-nurse/view-nurse.component";
import { EditNurseComponent } from "./edit-nurse/edit-nurse.component";
import { ViewTechnicianComponent } from "./view-technician/view-technician.component";
import { ViewUserComponent } from "./view-user/view-user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { ViewdocComponent } from "./viewdoc/viewdoc.component";
import { ViewBillComponent } from "./view-bill/view-bill.component";
import { LabDashboardComponent } from "./lab-dashboard/lab-dashboard.component";
import { LabEmployeeComponent } from "./lab-employee/lab-employee.component";
import { LabAppointmentsComponent } from "./lab-appointments/lab-appointments.component";
import { LabTestComponent } from "./lab-test/lab-test.component";
import { LabOthersComponent } from "./lab-others/lab-others.component";
import { LabSettingsComponent } from "./lab-settings/lab-settings.component";
import { LabViewAppointmentComponent } from "./lab-view-appointment/lab-view-appointment.component";
import { LabPackagesComponent } from "./lab-packages/lab-packages.component";
import { LabAddAppointmentsComponent } from "./lab-add-appointments/lab-add-appointments.component";
import { AddLabEmployeeComponent } from "./add-lab-employee/add-lab-employee.component";
import { ProfileComponent } from "./profile/profile.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { DepartmentsComponent } from "./departments/departments.component";

import { LoaderComponent } from "./loader/loader/loader.component";
import { LoaderInterceptor } from "../../src/utils/loader.interceptor";
import { JwtInterceptor } from "../../src/utils/jwt.interceptor";
import { LoaderService } from "src/utils/loader.service";
import { OthersComponent } from "./others/others.component";
import { GeneralphysicianComponent } from "./generalphysician/generalphysician.component";
import { AddPhysicianComponent } from "./add-physician/add-physician.component";
import { ViewPhysicianComponent } from "./view-physician/view-physician.component";
import { GiftPromotionComponent } from "./gift-promotion/gift-promotion.component";
import { GiftsComponent } from "./gifts/gifts.component";
import { PromotionHistoryComponent } from "./promotion-history/promotion-history.component";
import { GiftCardHistoryComponent } from "./gift-card-history/gift-card-history.component";
import { PatientSourceComponent } from "./patient-source/patient-source.component";
import { EmployeersComponent } from "./employeers/employeers.component";
import { ServiceRequestsComponent } from "./service-requests/service-requests.component";
import { ResultReadingComponent } from "./result-reading/result-reading.component";
import { RequestNonScheduleComponent } from "./request-non-schedule/request-non-schedule.component";
import { NotificaionsComponent } from './notificaions/notificaions.component';
import { AddLabComponent } from './add-lab/add-lab.component';
import { LabAppointmentSwapComponent } from './lab-appointment-swap/lab-appointment-swap.component';
import { ViewPatientComponent } from './view-patient/view-patient.component';
import { ReportsComponent } from './reports/reports.component';
import { EditLabComponent } from './edit-lab/edit-lab.component';
import { UnregisteredPatientlistComponent } from './unregistered-patientlist/unregistered-patientlist.component';
import { AddLabAppointmentComponent } from './add-lab-appointment/add-lab-appointment.component';
import { LabEmployeerCheckComponent } from './lab-employeer-check/lab-employeer-check.component';
import { LabRequestNonScheduleComponent } from './lab-request-non-schedule/lab-request-non-schedule.component';

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { OtherServiceCategoryComponent } from './other-service-category/other-service-category.component';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceAppointmentsComponent } from './insurance-appointments/insurance-appointments.component';
import { InsuranceNotScheduledComponent } from './insurance-not-scheduled/insurance-not-scheduled.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramRequestComponent } from './program-request/program-request.component';
import { EscortServiceComponent } from './escort-service/escort-service.component';
import { EscortRequestsComponent } from './escort-requests/escort-requests.component';
import { ProgramNotScheduledComponent } from './program-not-scheduled/program-not-scheduled.component';
import { EscortNotScheduledComponent } from './escort-not-scheduled/escort-not-scheduled.component';
import { GiftCardLogsComponent } from './gift-card-logs/gift-card-logs.component';
import { AddProgramComponent } from './add-program/add-program.component';

import { AppointmentsNewComponent } from "./appointments/appointments-new/appointments-new.component";
import { AgmCoreModule } from '@agm/core';
import { ThirdPartyRequestsComponent } from './third-party-requests/third-party-requests.component';
import { ThirdPartyRequestViewComponent } from "./third-party-requests/third-party-request-view/third-party-request-view.component";
import { ThirdPartyRequestsAppointmentsNewComponent } from "./third-party-requests/third-party-request-appointments-new/third-party-request-appointments-new";
import { LoginComponent } from './website/auth/login/login.component';
import { ForgetPasswordComponent } from './website/auth/forget-password/forget-password.component';
import { RegisterComponent } from './website/auth/register/register.component';
import { AllServicesComponent } from './website/services/all-services/all-services.component';
import { UserProfileComponent } from './user-dashboard/user-profile/user-profile.component';
import { AllCategoriesComponent } from './website/categories/all-categories/all-categories.component';
import { ServiceDetailsComponent } from './website/services/service-details/service-details.component';
import { CartComponent } from './website/checkout/cart/cart.component';
import { AppointmentScheduleComponent } from './website/checkout/appointment-schedule/appointment-schedule.component';
import { ServiceViewComponent } from "./service/service-view/service-view.component";
import { CaretgoryViewComponent } from "./service_category/caretgory-view/caretgory-view.component";
import { BranchViewComponent  } from "./branch/branch-view/branch-view.component";
import { CustomAlertComponent } from './website/custom-alert/custom-alert.component';

//INITIALIZATION BY SANA
import { InitializationService  } from "src/service/initialization.service";
import { WebsiteDataService } from "src/service/website-data.service";
import { CheckoutAppointmentComponent } from './website/checkout/checkout-appointment/checkout-appointment.component';
import { PaymentConfirmationComponent } from './website/checkout/payment-confirmation/payment-confirmation.component';
import { CheckoutHeaderComponent } from './website/checkout-header/checkout-header.component';
import { BusinessToBusinessSchedulingComponent } from './business-to-business-scheduling/business-to-business-scheduling.component';
import { CheckoutFooterComponent } from './website/checkout-footer/checkout-footer.component';
import { ServiceproviderComponent } from './serviceprovider/serviceprovider.component';
import { BusinessToBusinessAppointmentsComponent } from './business-to-business-appointments/business-to-business-appointments.component';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServicetagComponent } from './servicetag/servicetag.component';

// Create a loader for translation files
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
    HeaderComponent,
    DashboardComponent,
    EmployeesComponent,
    PhysiotherapistComponent,
    NurseComponent,
    TechnicianComponent,
    ReceptionistComponent,
    AccountantComponent,
    PatientlistComponent,
    AdddocComponent,
    DoclistComponent,
    AppointmentsComponent,
    AccountsComponent,
    LablistComponent,
    RoleManagerComponent,
    ListComponent,
    PackageComponent,
    LabtechPackagelistComponent,
    EmployerPackagelistComponent,
    MasterComponent,
    TreatmentsComponent,
    TestsComponent,
    ServicesComponent,
    TestComponent,
    SettingsComponent,
    AppointmentComponent,
    ScheduleComponent,
    RateandreviewComponent,
    SidebarComponent,
    SubmenuComponent,
    AddUserComponent,
    AddDoctorComponent,
    AddPhysiotherapistComponent,
    AddNurseComponent,
    AddReceptionistComponent,
    AddAccountantComponent,
    //AppointmentsViewComponent,
    DoctorsComponent,
    AddTechnicianComponent,
    ScheduledComponent,
    NotScheduledComponent,
    ViewDoctorComponent,
    EditDoctorComponent,
    AddTreatmentComponent,
    AddTestComponent,
    EditNursepackageComponent,
    EditLabtechpackageComponent,
    EditRoleComponent,
    EditApplicationComponent,
    EditAppointmentComponent,
    ViewPhysiotherapistComponent,
    EditPhysiotherapistComponent,
    ViewNurseComponent,
    EditNurseComponent,
    ViewTechnicianComponent,
    ViewUserComponent,
    EditUserComponent,
    ViewdocComponent,
    ViewBillComponent,
    LabDashboardComponent,
    LabEmployeeComponent,
    LabAppointmentsComponent,
    LabTestComponent,
    LabOthersComponent,
    LabSettingsComponent,
    LabPackagesComponent,
    LabViewAppointmentComponent,
    LabAddAppointmentsComponent,
    AddLabEmployeeComponent,
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    DepartmentsComponent,
    LoaderComponent,
    OthersComponent,
    GeneralphysicianComponent,
    AddPhysicianComponent,
    ViewPhysicianComponent,
    GiftPromotionComponent,
    GiftsComponent,
    PromotionHistoryComponent,
    GiftCardHistoryComponent,
    PatientSourceComponent,
    EmployeersComponent,
    ServiceRequestsComponent,
    ResultReadingComponent,
    RequestNonScheduleComponent,
    NotificaionsComponent,
    AddLabComponent,
    LabAppointmentSwapComponent,
    ViewPatientComponent,
    ReportsComponent,
    EditLabComponent,
    UnregisteredPatientlistComponent,
    AddLabAppointmentComponent,
    LabEmployeerCheckComponent,
    LabRequestNonScheduleComponent,
    OtherServiceCategoryComponent,
    InsuranceListComponent,
    InsuranceAppointmentsComponent,
    InsuranceNotScheduledComponent,
    ProgramsComponent,
    ProgramRequestComponent,
    EscortServiceComponent,
    EscortRequestsComponent,
    ProgramNotScheduledComponent,
    EscortNotScheduledComponent,
    GiftCardLogsComponent,
    AddProgramComponent,
    AppointmentsNewComponent,
    ThirdPartyRequestsComponent,
    ThirdPartyRequestViewComponent,
    ThirdPartyRequestsAppointmentsNewComponent,
    LoginComponent,
    ForgetPasswordComponent,
    RegisterComponent,
    AllServicesComponent,
    UserProfileComponent,
    AllCategoriesComponent,
    ServiceDetailsComponent,
    CartComponent,
    AppointmentScheduleComponent,
    ServiceViewComponent,
    CaretgoryViewComponent,
    BranchViewComponent,
    CustomAlertComponent,
    CheckoutAppointmentComponent,
    PaymentConfirmationComponent,
    CheckoutHeaderComponent,
    BusinessToBusinessSchedulingComponent,
    CheckoutFooterComponent,
    ServiceproviderComponent,
    BusinessToBusinessAppointmentsComponent,
    ServicetagComponent
   ],
  imports: [
    BrowserModule, 
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDw0RNwKY1k0NU8VTe_nrljW_gPYn8_RLE',
      libraries: ['places']
    }),
    AppRoutingModule, HttpClientModule, MatSnackBarModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule,NgSelect2Module, NgMultiSelectDropDownModule.forRoot(), 
    NgxSummernoteModule, MatTabsModule, NgxPaginationModule, Ng2SearchPipeModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    
  ],
  providers: [
    InitializationService,
    LoaderService, WebsiteDataService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //{ provide: LocationStrategy, useClass: PathLocationStrategy },

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
