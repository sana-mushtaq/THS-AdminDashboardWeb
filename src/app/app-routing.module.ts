import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { PhysiotherapistComponent } from './physiotherapist/physiotherapist.component';
import { NurseComponent } from './nurse/nurse.component';
import { TechnicianComponent } from './technician/technician.component';
import { ReceptionistComponent } from './receptionist/receptionist.component';
import { AccountantComponent } from './accountant/accountant.component';
import { PatientlistComponent } from './patientlist/patientlist.component';
import { AdddocComponent } from './adddoc/adddoc.component';
import { DoclistComponent } from './doclist/doclist.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AccountsComponent } from './accounts/accounts.component';
import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { LabEmployeeComponent } from './lab-employee/lab-employee.component';
import { LabAppointmentsComponent } from './lab-appointments/lab-appointments.component';
import { LabPackagesComponent } from './lab-packages/lab-packages.component';
import { LabTestComponent } from './lab-test/lab-test.component';
import { LabOthersComponent } from './lab-others/lab-others.component';
import { LabViewAppointmentComponent } from './lab-view-appointment/lab-view-appointment.component';
import { LabAddAppointmentsComponent } from './lab-add-appointments/lab-add-appointments.component';
import { AddLabEmployeeComponent } from './add-lab-employee/add-lab-employee.component';
import { LabSettingsComponent } from './lab-settings/lab-settings.component';
import { LablistComponent } from './lablist/lablist.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { ListComponent } from './list/list.component';
import { PackageComponent } from './package/package.component';
import { LabtechPackagelistComponent } from './labtech-packagelist/labtech-packagelist.component';
import { EmployerPackagelistComponent } from './employer-packagelist/employer-packagelist.component';
import { MasterComponent } from './master/master.component';
import { TreatmentsComponent } from './treatments/treatments.component';
import { TestsComponent } from './tests/tests.component';
import { ServicesComponent } from './services/services.component';
import { TestComponent } from './test/test.component';
import { SettingsComponent } from './settings/settings.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { RateandreviewComponent } from './rateandreview/rateandreview.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { AddPhysiotherapistComponent } from './add-physiotherapist/add-physiotherapist.component';
import { AddNurseComponent } from './add-nurse/add-nurse.component';
import { AddReceptionistComponent } from './add-receptionist/add-receptionist.component';
import { AddAccountantComponent } from './add-accountant/add-accountant.component';
import { AddTechnicianComponent } from './add-technician/add-technician.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { NotScheduledComponent } from './not-scheduled/not-scheduled.component';
import { ViewDoctorComponent } from './view-doctor/view-doctor.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import { AddTreatmentComponent } from './add-treatment/add-treatment.component';
import { AddTestComponent } from './add-test/add-test.component';
import { EditNursepackageComponent } from './edit-nursepackage/edit-nursepackage.component';
import { EditLabtechpackageComponent } from './edit-labtechpackage/edit-labtechpackage.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { ViewPhysiotherapistComponent } from './view-physiotherapist/view-physiotherapist.component';
import { EditPhysiotherapistComponent } from './edit-physiotherapist/edit-physiotherapist.component';
import { ViewNurseComponent } from './view-nurse/view-nurse.component';
import { EditNurseComponent } from './edit-nurse/edit-nurse.component';
import { ViewTechnicianComponent } from './view-technician/view-technician.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewdocComponent } from './viewdoc/viewdoc.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DepartmentsComponent } from './departments/departments.component';
import { OthersComponent } from './others/others.component';
import { GeneralphysicianComponent } from './generalphysician/generalphysician.component';
import { AddPhysicianComponent } from './add-physician/add-physician.component';
import { ViewPhysicianComponent } from './view-physician/view-physician.component';
import { GiftPromotionComponent } from './gift-promotion/gift-promotion.component';
import { GiftsComponent } from './gifts/gifts.component';
import { PromotionHistoryComponent } from './promotion-history/promotion-history.component';
import { GiftCardHistoryComponent } from './gift-card-history/gift-card-history.component';
import { PatientSourceComponent } from './patient-source/patient-source.component';
import { EmployeersComponent } from './employeers/employeers.component';
import { ServiceRequestsComponent } from './service-requests/service-requests.component';
import { ResultReadingComponent } from './result-reading/result-reading.component';
import { RequestNonScheduleComponent } from './request-non-schedule/request-non-schedule.component';
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
import { OtherServiceCategoryComponent } from './other-service-category/other-service-category.component';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceAppointmentsComponent } from './insurance-appointments/insurance-appointments.component';
import { InsuranceNotScheduledComponent } from './insurance-not-scheduled/insurance-not-scheduled.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramRequestComponent } from './program-request/program-request.component';
import { EscortServiceComponent } from './escort-service/escort-service.component';
import { EscortRequestsComponent } from './escort-requests/escort-requests.component';
import { EscortNotScheduledComponent } from './escort-not-scheduled/escort-not-scheduled.component';
import { ProgramNotScheduledComponent } from './program-not-scheduled/program-not-scheduled.component';
import { GiftCardLogsComponent } from './gift-card-logs/gift-card-logs.component';
import { AddProgramComponent } from './add-program/add-program.component';
import { AppointmentsNewComponent } from "./appointments/appointments-new/appointments-new.component";
import { ThirdPartyRequestsComponent } from './third-party-requests/third-party-requests.component';
import { ThirdPartyRequestViewComponent } from "./third-party-requests/third-party-request-view/third-party-request-view.component";
import { ThirdPartyRequestsAppointmentsNewComponent } from "./third-party-requests/third-party-request-appointments-new/third-party-request-appointments-new";


/* LOGIN */
import { LoginComponent } from './website/auth/login/login.component';
import { ForgetPasswordComponent } from './website/auth/forget-password/forget-password.component';
import { RegisterComponent } from './website/auth/register/register.component';
import { AllServicesComponent } from './website/services/all-services/all-services.component';
import { AllCategoriesComponent } from './website/categories/all-categories/all-categories.component';
import { UserProfileComponent } from './user-dashboard/user-profile/user-profile.component';
import { ServiceDetailsComponent } from './website/services/service-details/service-details.component';
import { CartComponent } from './website/checkout/cart/cart.component';
import { AppointmentScheduleComponent } from './website/checkout/appointment-schedule/appointment-schedule.component';

const routes: Routes = [
 { path: '', component: HomeComponent},
 { path: 'dashboard', component: DashboardComponent},
 { path: 'users', component: EmployeesComponent},
 { path: 'doctor', component: DoctorsComponent},
 { path: 'physiotherapist', component: PhysiotherapistComponent},
 { path: 'nurse', component: NurseComponent},
 { path: 'technician', component: TechnicianComponent},
 { path: 'receptionist', component: ReceptionistComponent},
 { path: 'accountant', component: AccountantComponent},
 { path: 'patientlist', component: PatientlistComponent},
 { path: 'adddoc', component: AdddocComponent},
 { path: 'doclist', component: DoclistComponent},
 { path: 'appointments', component: AppointmentsComponent},
 { path: 'appointments/add', component: AppointmentsNewComponent},
 { path: 'lab-dashboard1', component: AccountsComponent},
 { path: 'labdashboard', component: LabDashboardComponent},
 { path: 'labemployee', component: LabEmployeeComponent},
 { path: 'lab-appointments', component: LabAppointmentsComponent},
 { path: 'lab-package-list', component: LabPackagesComponent},
 { path: 'lab-test', component: LabTestComponent},
 { path: 'lab-others', component: LabOthersComponent},
 { path: 'lab-add-appointments', component: LabAddAppointmentsComponent},
 { path: 'lab-view-appointment', component: LabViewAppointmentComponent},
 { path: 'lab-add-employee', component: AddLabEmployeeComponent},
 { path: 'lab-settings', component: LabSettingsComponent},
 { path: 'lab-list', component:LablistComponent},
 { path: 'add', component: RoleManagerComponent},
 { path: 'list', component: ListComponent},
 { path: 'nurse-packagelist', component: PackageComponent},
 { path: 'labtech-packagelist', component: LabtechPackagelistComponent},
 { path: 'employer-package', component: EmployerPackagelistComponent},
 { path: 'department', component: MasterComponent},
 { path: 'services', component: ServicesComponent},
 { path: 'treatments', component: TreatmentsComponent},
 { path: 'tests', component: TestsComponent},
 { path: 'test', component: TestComponent},
 { path: 'application-setting', component: SettingsComponent},
 { path: 'appointment-setting', component: AppointmentComponent},
 { path: 'schedule-setting', component: ScheduleComponent},
 { path: 'rateandreview', component: RateandreviewComponent},
 { path: 'add-user', component: AddUserComponent},
 { path: 'add-doctor', component: AddDoctorComponent},
 { path: 'add-physiotherapist', component: AddPhysiotherapistComponent},
 { path: 'add-nurse', component: AddNurseComponent},
 { path: 'add-receptionist', component: AddReceptionistComponent},
 { path: 'add-accountant', component: AddAccountantComponent},
 { path: 'add-technician', component: AddTechnicianComponent},
 { path: 'scheduled', component: ScheduledComponent},
 { path: 'not-scheduled', component: NotScheduledComponent},
 { path: 'view', component: ViewDoctorComponent},
 { path: 'edit-doctor', component: EditDoctorComponent},
 { path: 'add-treatment', component: AddTreatmentComponent},
 { path: 'add-test', component: AddTestComponent},
 { path: 'edit-nursepackage', component: EditNursepackageComponent},
 { path: 'edit-labtechpackage', component: EditLabtechpackageComponent},
 { path: 'edit-role', component: EditRoleComponent},
 { path: 'edit-application', component: EditApplicationComponent},
 { path: 'edit-appointment', component: EditAppointmentComponent},
 { path: 'view-physiotherapist', component: ViewPhysiotherapistComponent},
 { path: 'edit-physiotherapist', component: EditPhysiotherapistComponent},
 { path: 'view-nurse', component: ViewNurseComponent},
 { path: 'edit-nurse', component: EditNurseComponent},
 { path: 'view-technician', component: ViewTechnicianComponent},
 { path: 'view-user', component: ViewUserComponent},
 { path: 'edit-user', component: EditUserComponent},
 { path: 'viewdoc', component: ViewdocComponent},
 { path: 'view-bill', component: ViewBillComponent},
 { path: 'profile', component: ProfileComponent},
 { path: 'edit-profile', component: EditProfileComponent},
 { path: 'change-password', component: ChangePasswordComponent},
 { path: 'forgot-password', component: ForgotPasswordComponent},
 { path: 'departments', component:DepartmentsComponent },
 { path: 'others',component:OthersComponent },
 { path:'general-physician', component:GeneralphysicianComponent},
 { path:'add-physician', component:AddPhysicianComponent},
 { path:'view-physician', component:ViewPhysicianComponent},
 { path:'gifts-promotion', component:GiftPromotionComponent},
 { path:'gifts', component:GiftsComponent},
 { path:'promotion-history', component:PromotionHistoryComponent},
 { path:'gift-card-history', component:GiftCardHistoryComponent},
 { path:'patient-source', component:PatientSourceComponent},
 { path:'employers', component:EmployeersComponent},
 { path:'service-request', component:ServiceRequestsComponent},
 { path:'result-reading', component:ResultReadingComponent},
 { path:'request-non-schedule', component:RequestNonScheduleComponent},
 { path:'notification', component:NotificaionsComponent},
 { path:'add-lab', component:AddLabComponent},
 { path:'lab-appointment-swap', component:LabAppointmentSwapComponent},
 { path:'view-patient', component:ViewPatientComponent},
 { path:'reports-list', component:ReportsComponent},
 { path:'edit-lab', component:EditLabComponent},
 { path:'unregistered-patientlist', component:UnregisteredPatientlistComponent},
 { path:'add-lab-appointment', component:AddLabAppointmentComponent},
 { path:'lab-employers-check', component:LabEmployeerCheckComponent},
 { path:'lab-request-non-schedule', component:LabRequestNonScheduleComponent},
 { path:'other-service-category', component:OtherServiceCategoryComponent},
 { path:'insurance-list', component:InsuranceListComponent},
 { path:'insurance-appointments', component:InsuranceAppointmentsComponent},
 { path:'insurance-not-scheduled', component:InsuranceNotScheduledComponent},
 { path:'programs', component:ProgramsComponent},
 { path:'program-requests', component:ProgramRequestComponent},
 { path:'escort-service', component:EscortServiceComponent},
 { path:'escort-requests', component:EscortRequestsComponent},
 { path:'escort-not-scheduled', component:EscortNotScheduledComponent},
 { path:'program-not-scheduled', component:ProgramNotScheduledComponent},
 { path:'gift-logs', component:GiftCardLogsComponent},
 { path:'add-program', component:AddProgramComponent},
 { path:'third-party-requests', component: ThirdPartyRequestsComponent},
 { path:'third-party-requests/:id', component: ThirdPartyRequestViewComponent},
 { path:'third-party-requests/:id/appointment', component: ThirdPartyRequestsAppointmentsNewComponent},

 /* LOGIN */
 { path:'login', component: LoginComponent },
 { path:'forget-password', component: ForgetPasswordComponent },
 { path:'register', component: RegisterComponent },
 { path: 'medical-services', component: AllServicesComponent },
 { path: 'medical-category', component: AllCategoriesComponent },
 { path: 'user/profile', component: UserProfileComponent },
 { path: 'medical-services/service-detail', component: ServiceDetailsComponent },
 { path: 'checkout/cart', component: CartComponent },
 { path: 'checkout/schedule', component: AppointmentScheduleComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
