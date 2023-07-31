import { AppointmentDetails } from "./appointment-details.model";

export class AppointmentService {
    patientId: number;
    serviceSectorId: number;
    orgServiceSectorId: number;
    serviceCategoryId: number;
    serviceType: number;
    serviceId: number;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: number;
    idNumber:string;
    gender: number;
    genderText: string;
    bloodGroup: string;
    dob: string;
    serviceName: string;
    serviceNameArabic: string;
    instructions: string;

    static getServiceList(serviceResponse): AppointmentService[] {
        let services: AppointmentService[] = [];

        serviceResponse.forEach(service => {
            let appointmentService = new AppointmentService();
            appointmentService.patientId = service.patientId;
            appointmentService.orgServiceSectorId = service?.orgServiceSectorId || -1;
            appointmentService.serviceSectorId = service.serviceSectorId;
            appointmentService.serviceCategoryId = service.serviceCategoryId;
            appointmentService.serviceType = service.serviceType;
            appointmentService.serviceId = service.serviceId;
            appointmentService.firstName = service.firstName;
            appointmentService.lastName = service.lastName;
            appointmentService.email = service.email;
            appointmentService.idNumber = service.idNumber;
            appointmentService.mobileNumber = service.mobileNumber;
            appointmentService.gender = service.gender;
            appointmentService.bloodGroup = service.bloodGroup;
            appointmentService.dob = service.dob;
            appointmentService.instructions = service.instructions;
            appointmentService.serviceName = service.serviceName;
            appointmentService.serviceNameArabic = service.serviceNameArabic

            if (appointmentService.gender == 1) {
                appointmentService.genderText = "Male";
            } else {
                appointmentService.genderText = "Female";
            }
            services.push(appointmentService);
        });

        return services;
    }

}


