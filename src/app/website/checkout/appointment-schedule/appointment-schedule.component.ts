import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/utils/util.service';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { APIResponse } from 'src/utils/app-enum';
import { formatDate } from '@angular/common';
import { WebsocketService  } from 'src/service/web-socket.service';
import { Subscription } from 'rxjs';
import { WebsiteDataService } from 'src/service/website-data.service';
import { PatientsService } from 'src/service/patient.service';
import { LanguageService } from 'src/service/language.service';

@Component({
  selector: 'app-appointment-schedule',
  templateUrl: './appointment-schedule.component.html',
  styleUrls: ['./appointment-schedule.component.css']
})

export class AppointmentScheduleComponent implements OnInit {

  loginAlert: boolean = false
  errorOccured: boolean = false
  userId: any
  cartData: any = []
  totalCost: number = 0
  total_inc_cost: number = 0
  
  //calendar
  currentDate: Date = new Date()
  currentWeek: Date[] = []
  currentMonthAndYear: string = ''

  selectedDate: Date | null = null

  serviceProvidersServices: any
  userDependants: any = []

  //date & time to store in local storage
  preferredTime: any
  preferredDate: any

  private fetchedData: any = {
    serviceProviders: [],
    appointments: []
  }

  private dataSubscription: Subscription;

  timeSlots: string[] = [] // Array to hold time slots

  constructor(
    private router: Router,
    private _utilService: UtilService,
    private _b2c: BusinessToCustomerSchedulingService,
    private websocketService: WebsocketService,
    private dataService: WebsiteDataService,
    private _patientService: PatientsService,
    public languageService: LanguageService

  ) {     

    for (let hour = 12; hour <= 23; hour++) {

      this.timeSlots.push(this.formatTimeSlot(hour))

    }
    
  }

  ngOnInit(): void {

    this.userId = localStorage.getItem("THSUserId")
    
    if(this.userId !== null) {
  
      this.cartData = this._utilService.getCartData()

      if(!this.cartData || this.cartData.length === 0) {

        this.router.navigate(['/medical-services'])

      } else {

        let services = this.cartData

        let data = {

          services: services
        }


        this._b2c.verifyTotal(data).subscribe({
          
          next : ( res : any ) => {
    
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success ) {

              //after fetching all service providers we will now check if their gender match with selected user or not 
            this.totalCost = res.data

            let user_data = {

              user_id: this.userId
          
            }

            this._patientService.getProfileInformation(user_data).subscribe({
      
              next : ( res : any ) => {
        
                //in case of success the api returns 0 as a status code
                if( res.status === APIResponse.Success ) {
        
                    if(!res.data.id_number.startsWith("1")) {

                      const taxRate = 0.15;
                      const taxAmount = this.totalCost * taxRate;
                
                      this.total_inc_cost =  Math.round(this.totalCost + taxAmount);
                
                    } else {
              
                      this.total_inc_cost =  Math.round(this.totalCost);
              
                    }
                  
                  
                } 
                
              },
          
            })

           

            }
            
          },
          error: ( err: any ) => {
            
            console.log(err)
    
          }
      
        }) 
        
      }
    
    } else {

      this.loginAlert = true

    }

    let data = {

      user_id: this.userId

    }

    this._patientService.getDependantsList(data).subscribe({

      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {
            
          res.data.forEach(dependant => {

            this.userDependants.push(dependant)

          })
              
        } 
        
      },

      error: ( err: any ) => {}
  
    })

    //this.websocketService.connect(); // Assuming you have a connect() method in your service
    
    let sa =  {
      user_id: this.userId
    }

    this._b2c.getSocketData(sa).subscribe({
      
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success ) {

          //after fetching all service providers we will now check if their gender match with selected user or not 
          this.fetchedData = res.data

          this.dataService.data$.subscribe((res) => {

            if (res) {
    
              // ... handle the received data here
              let services = res.services
              let filteredServices = []
    
              this.cartData.forEach(cartItem => {
    
                let temp = services.filter(service => {
    
                  return service.id === cartItem.id
    
                })
    
                if( temp.length > 0 ) {
    
                  filteredServices.push(temp[0])
                  
                }
    
              })
    
              let spData  = {
    
                services: filteredServices,
                patients: this.userDependants
    
              }
    
              this._b2c.checkServiceProviderEligibilty(spData).subscribe({
          
                next : ( ress : any ) => {
          
                  //in case of success the api returns 0 as a status code
                  if( ress.status === APIResponse.Success ) {
    
                    //after fetching all service providers we will now check if their gender match with selected user or not 
                    this.serviceProvidersServices = ress.data
    
                    this.selectCurrentDay()
                    this.generateWeek()
                    this.updateCurrentMonthAndYear()
    
                  } else {
          
                 
                  }
                  
                },
                error: ( err: any ) => {
                  
                  console.log(err)
          
                }
            
              }) 
      
            }
      
          })

        } else {

       
        }
        
      },
      error: ( err: any ) => {
        
        console.log(err)

      }
  
    }) 

    
    /*this.dataSubscription = this.websocketService.onData().subscribe(data => {

      this.fetchedData = data
      this.dataService.data$.subscribe((res) => {

        if (res) {

          // ... handle the received data here
          let services = res.services
          let filteredServices = []

          this.cartData.forEach(cartItem => {

            let temp = services.filter(service => {

              return service.id === cartItem.id

            })

            if( temp.length > 0 ) {

              filteredServices.push(temp[0])
              
            }

          })

          let spData  = {

            services: filteredServices,
            patients: this.userDependants

          }

          this._b2c.checkServiceProviderEligibilty(spData).subscribe({
      
            next : ( ress : any ) => {
      
              //in case of success the api returns 0 as a status code
              if( ress.status === APIResponse.Success ) {

                //after fetching all service providers we will now check if their gender match with selected user or not 
                this.serviceProvidersServices = ress.data

                this.selectCurrentDay()
                this.generateWeek()
                this.updateCurrentMonthAndYear()

              } else {
      
             
              }
              
            },
            error: ( err: any ) => {
              
              console.log(err)
      
            }
        
          }) 
  
        }
  
      })

    })*/

  }

  selectCurrentDay() {

    this.selectDate(new Date())

  }

  generateWeek() {
 
    this.currentWeek = []

    for (let i = 0; i < 7; i++) {

      const day = new Date(this.currentDate)
      day.setDate(this.currentDate.getDate() + i)
      this.currentWeek.push(day)

    }

  }

  updateCurrentMonthAndYear() {

    this.currentMonthAndYear = formatDate(this.currentDate, 'MMMM y', 'en-US')

  }

  goToNextWeek() {

    this.currentDate.setDate(this.currentDate.getDate() + 7)
    this.generateWeek()
    this.updateCurrentMonthAndYear()

  }

  goToPreviousWeek() {

    this.currentDate.setDate(this.currentDate.getDate() - 7)
    this.generateWeek()
    this.updateCurrentMonthAndYear()

  }

  selectDate(date: Date) {

    this.selectedDate = date
    this.calculateTimeSlots()

  }

  isPreviousDisabled(): boolean {

    const today = new Date()
    const firstDateOfWeek = this.currentWeek[0]

    return firstDateOfWeek <= today

  }

  ngOnDestroy() {

    //this.dataSubscription.unsubscribe() // Unsubscribe from the data stream

  }

  sendMessage(message: string): void {

    this.websocketService.sendMessage(message);

  }

  formatTimeSlot(hour: number): string {

    const amPm = hour >= 12 ? 'pm' : 'am'

    const formattedHour = hour > 12 ? hour - 12 : hour
  
    return `${formattedHour === 0 ? 12 : formattedHour}:00${amPm}`

  }

  //this function will calculate time slots if date is selected 
  calculateTimeSlots() {
    // Assuming fetchedData.appointments contains the list of appointments
  
    if (!this.selectedDate || this.cartData.length === 0) {
      // No selected date or no services in cart, return empty time slots
      this.timeSlots = []
      return

    }

    // If cart contains only 1 service
    if (this.cartData.length === 1) {

      const serviceId = this.cartData[0].id;

      // Get all service providers for the selected service
      const sps = this.serviceProvidersServices[serviceId].filter(sps => {
        return sps.service_id === serviceId;
      });

      // Convert the selected date to "YYYY-MM-DD" format
      const selectedDate = this.formatSelectedDate(this.selectedDate);

      this.setPreferredDate(selectedDate);

      const uniqueScheduledTimes = this.fetchedData.appointments
      .filter(app => {
        // Check if app.serviceAssigneeId is not null and there's a matching sp in sps
        return (
          app.serviceAssigneeId !== null &&
          sps.some(sp => sp.user_id === app.serviceAssigneeId) &&
          app.serviceDate === selectedDate
          //mpare only the date part
          // You can add a time condition here if needed
        );
      }).map(app => {
        // Convert the database time format (e.g., "2023-09-04T19:00:00.000Z") to time slots format (e.g., "4:00pm")
        const dbTime = app.serviceTime;
        const [hours, minutes] = dbTime.split(':');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedTime = `${(hours % 12) || 12}:${minutes}${ampm}`;
        return formattedTime;
      });


      console.log(uniqueScheduledTimes)
      // Count the occurrences of each time slot
      const timeSlotCounts = {};
      uniqueScheduledTimes.forEach(time => {
      
        timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
    
      });

      console.log(timeSlotCounts)

      // Filter the time slots where all service providers are booked
      const filteredTimeSlots = Object.keys(timeSlotCounts).filter(time => {
      
        return timeSlotCounts[time] === sps.length;
      
      });

      // Function to check if a time slot is available
      const isTimeSlotAvailable = (timeSlot: string) => {
        
        return !filteredTimeSlots.includes(timeSlot);

      };
  

      this.timeSlots = [];
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      const currentDateString = currentDate.toISOString().slice(0, 10); // Get current date in "yyyy-mm-dd" format
      
      // Calculate 3 hours later from the current time
      const threeHoursLater = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
      const threeHoursLaterHour = threeHoursLater.getHours();

      for (let hour = 12; hour <= 23; hour++) {
        const timeSlot = this.formatTimeSlot(hour);
        
        // Check if the selectedDate is today
        if (selectedDate === currentDateString) {
          // Calculate the hour 3 hours later for the current day
          const threeHoursLaterCurrent = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
          const threeHoursLaterCurrentHour = threeHoursLaterCurrent.getHours();
          if (hour < currentHour && hour < threeHoursLaterCurrentHour) {
            continue; // Skip past time slots for today
            
          }


          
        } else {
          // For future dates, include all time slots
          if (isTimeSlotAvailable(timeSlot)) {
            this.timeSlots.push(timeSlot);
          }
        }
      }

           // Check if the selectedDate is today
      if (selectedDate === currentDateString) {
      // Calculate the hour 3 hours later for the current day
      const threeHoursLaterCurrent = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
      const threeHoursLaterCurrentHour = threeHoursLaterCurrent.getHours();
      const roundedHour = Math.ceil(threeHoursLaterCurrent.getMinutes() / 60);

      for (let hour = threeHoursLaterCurrentHour + roundedHour; hour <= 23; hour++) {
        const timeSlot = this.formatTimeSlot(hour);
       
        if (isTimeSlotAvailable(timeSlot)) {
      
          if(timeSlot !== '10:00am' && timeSlot !== '11:00am' && timeSlot !== '3:00am' && timeSlot !== '4:00am' && timeSlot !== '5:00am' &&
          timeSlot !== '6:00am' && timeSlot !== '7:00am' && timeSlot !== '8:00am' && timeSlot !== '9:00am' && timeSlot !== '12:00am' && timeSlot !== '1:00am' && timeSlot !== '2:00am')
          this.timeSlots.push(timeSlot);
       
        }
      
      }
  
    } 

    } else {
      
      const formattedSelectedDate = this.formatSelectedDate(this.selectedDate);

      this.setPreferredDate(formattedSelectedDate)

      // Rest of your logic for handling multiple services and common providers
      const selectedServiceIds = this.cartData.map(item => item.id)

      // Create a list to store time slots to be removed
      const timeSlotsToRemove = []
      const serviceId = this.cartData.map(i=> i.id);

      const serviceIds = this.cartData.map(item => item.id);

      // Get all service providers for the selected services
      let sps = serviceIds.map(serviceId => {
        return this.serviceProvidersServices[serviceId].filter(sp => sp.service_id === serviceId);
      });
      // Flatten the array of arrays into a single array of service providers
      const flattenedProviders = [].concat(...sps);
      sps = flattenedProviders;

      let sd = this.formatSelectedDate(this.selectedDate).toString()

  
      const uniqueScheduledTimes = this.fetchedData.appointments
      .filter(app => {
        // Check if app.serviceAssigneeId is not null and there's a matching sp in sps
        return (
          app.serviceAssigneeId !== null &&
          sps.some(sp => sp.user_id === app.serviceAssigneeId) &&
          app.serviceDate === sd
          //mpare only the date part
          // You can add a time condition here if needed
        );
      }).map(app => {
        // Convert the database time format (e.g., "2023-09-04T19:00:00.000Z") to time slots format (e.g., "4:00pm")
        const dbTime = app.serviceTime;
        const [hours, minutes] = dbTime.split(':');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedTime = `${(hours % 12) || 12}:${minutes}${ampm}`;
        return formattedTime;
    });

    const timeSlotCounts = {};
    uniqueScheduledTimes.forEach(time => {
    
      timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
  
    });

    // Filter the time slots where all service providers are booked
    const filteredTimeSlots = Object.keys(timeSlotCounts).filter(time => {
    
      return timeSlotCounts[time] === sps.length;
    
    });

    // Function to check if a time slot is available
    const isTimeSlotAvailable = (timeSlot: string) => {
      
      return !filteredTimeSlots.includes(timeSlot);

    };

    this.timeSlots = [];
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentDateString = currentDate.toISOString().slice(0, 10); // Get current date in "yyyy-mm-dd" format
    const selectedDate = this.formatSelectedDate(this.selectedDate);

    // Calculate 3 hours later from the current time
    const threeHoursLater = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
    const threeHoursLaterHour = threeHoursLater.getHours();
    
          // Calculate 3 hours later from the current time
     
    
          for (let hour = 12; hour <= 23; hour++) {
            const timeSlot = this.formatTimeSlot(hour);
            
            // Check if the selectedDate is today
            if (selectedDate === currentDateString) {
              // Calculate the hour 3 hours later for the current day
              const threeHoursLaterCurrent = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
              const threeHoursLaterCurrentHour = threeHoursLaterCurrent.getHours();
              if (hour < currentHour && hour < threeHoursLaterCurrentHour) {
                continue; // Skip past time slots for today
                
              }
    
    
              
            } else {
              // For future dates, include all time slots
              if (isTimeSlotAvailable(timeSlot)) {
                if(timeSlot !== '10:00am' && timeSlot !== '11:00am' && timeSlot !== '3:00am' && timeSlot !== '4:00am' && timeSlot !== '5:00am' &&
                timeSlot !== '6:00am' && timeSlot !== '7:00am' && timeSlot !== '8:00am' && timeSlot !== '9:00am' && timeSlot !== '12:00am' && timeSlot !== '1:00am' && timeSlot !== '2:00am') 
                {
      
                  this.timeSlots.push(timeSlot);

                }
              }
            }
          }
    
               // Check if the selectedDate is today
               if (selectedDate === currentDateString) {
                // Calculate the hour 3 hours later for the current day
                const threeHoursLaterCurrent = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
                const threeHoursLaterCurrentHour = threeHoursLaterCurrent.getHours();
                const roundedHour = Math.ceil(threeHoursLaterCurrent.getMinutes() / 60);
                for (let hour = threeHoursLaterCurrentHour+ roundedHour; hour <= 23; hour++) {
                  const timeSlot = this.formatTimeSlot(hour);
                  if (isTimeSlotAvailable(timeSlot)) {
                    
                    if(timeSlot !== '10:00am' && timeSlot !== '11:00am' && timeSlot !== '3:00am' && timeSlot !== '4:00am' && timeSlot !== '5:00am' &&
                timeSlot !== '6:00am' && timeSlot !== '7:00am' && timeSlot !== '8:00am' && timeSlot !== '9:00am' && timeSlot !== '12:00am' && timeSlot !== '1:00am' && timeSlot !== '2:00am') 
              {

                      this.timeSlots.push(timeSlot);
    
                    }
                    
                  }
                }
            
        
              } 
    
      // Remove the time slots that need to be removed
      this.timeSlots = this.timeSlots.filter(slot => !timeSlotsToRemove.includes(slot))

    }
  
  }
  
  findAllCommonServiceProviders() {

    if (this.cartData.length <= 1) {

      // If there's only one service or no services, return an empty array
      return []

    }
  
    const serviceIds = this.cartData.map(item => item.id)
  
    // Find the providers for the first service in the cart
    const providersOfFirstService = this.serviceProvidersServices[serviceIds[0]]
  
    if (!providersOfFirstService) {
    
      return []
    
    }
  
    // Check if each provider of the first service provides all other services in the cart
    const commonProviders = providersOfFirstService.filter(provider => {
      
      return serviceIds.every(serviceId => {

        const providersForService = this.serviceProvidersServices[serviceId]

        return providersForService && providersForService.some(p => p.user_id === provider.user_id)

      })
  
    })
  
    return commonProviders.map(provider => provider.user_id);

  }
    
  isTimeSlotBooked(providerIds: string[], timeSlot: string) {

    return this.fetchedData.appointments.some(appointment => {

      return providerIds.includes(appointment.serviceAssigneeId) &&
      
      appointment.serviceTime === timeSlot 
    
    })
 
  }

  // Assuming selectedDate is a Date object
  formatSelectedDate(selectedDate: Date) {

    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`

  }

  setPreferredTimeSlot(time) {

    this.preferredTime = time

  }

  setPreferredDate(date) {

    this.preferredDate = date
  
  }
    
  proceedToPay() {

    if(!this.preferredDate || !this.preferredTime) {

     this.errorOccured = true

    } else {

      let patient_note = (document.getElementById("patient_note") as any).value
      let data = {
  
        cartData: this.cartData,
        preferredTime: this.preferredTime,
        preferredDate: this.formatSelectedDate(this.selectedDate),
        patient_note: patient_note
  
      }
  
      localStorage.setItem("THSPaylaod", JSON.stringify(data))
      this.router.navigate(['/checkout/confirmation'])
    }

  
  }

  navigateToCart() {

    this.router.navigate(['/checkout/cart'])

  }

  handleCancelClick(): void {

  }

  //alert continue button handler
  handleContinueClick(): void {

    this.router.navigate(['/login'])

  }

  handleContinueClickTimeDate() {

    this.errorOccured = false
    
  }

}