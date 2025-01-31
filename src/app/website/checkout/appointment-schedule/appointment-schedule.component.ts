import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UtilService } from "src/utils/util.service";
import { BusinessToCustomerSchedulingService } from "src/service/business-to-customer-scheduling.service";
import { APIResponse } from "src/utils/app-enum";
import { formatDate } from "@angular/common";
import { WebsocketService } from "src/service/web-socket.service";
import { Subscription } from "rxjs";
import { WebsiteDataService } from "src/service/website-data.service";
import { PatientsService } from "src/service/patient.service";
import { LanguageService } from "src/service/language.service";
import { InitializationService } from "src/service/initialization.service";

@Component({
  selector: "app-appointment-schedule",
  templateUrl: "./appointment-schedule.component.html",
  styleUrls: ["./appointment-schedule.component.css"],
})
export class AppointmentScheduleComponent implements OnInit {
  allCartCategoriesData: any = {};

  loginAlert: boolean = false;
  errorOccured: boolean = false;
  userId: any;
  cartData: any = [];
  totalCost: number = 0;
  total_inc_cost: number = 0;

  //calendar
  currentDate: Date = new Date();
  currentWeek: Date[] = [];
  currentMonthAndYear: string = "";

  selectedDate: Date | null = null;

  serviceProvidersServices: any;
  userDependants: any = [];

  //date & time to store in local storage
  preferredTime: any;
  preferredDate: any;

  weekDays: any = [];

  private fetchedData: any = {
    serviceProviders: [],
    appointments: [],
  };

  private dataSubscription: Subscription;

  timeSlots: string[] = []; // Array to hold time slots
  displayShowCheckout: any;
  homeVist: number = 0;

  constructor(
    private router: Router,
    private _utilService: UtilService,
    private _b2c: BusinessToCustomerSchedulingService,
    private websocketService: WebsocketService,
    private dataService: WebsiteDataService,
    private _patientService: PatientsService,
    public languageService: LanguageService,
    private initializationService: InitializationService
  ) {
    for (let hour = 12; hour <= 23; hour++) {
      this.timeSlots.push(this.formatTimeSlot(hour));
    }
  }

  ngOnInit(): void {

    this.displayShowCheckout = localStorage.getItem("showCheckout");
    if(this.displayShowCheckout === 'true') {
      this.router.navigate(['/'])
    }

    this.userId = localStorage.getItem("THSUserId");

    if (this.userId !== null) {
      this.cartData = this._utilService.getCartData();

      if (!this.cartData || this.cartData.length === 0) {
        this.router.navigate(["/medical-services"]);
      } else {
        let services = this.cartData;

        let data = {
          services: services,
        };

        this._b2c.verifyTotal(data).subscribe({
          next: (res: any) => {
            //in case of success the api returns 0 as a status code
            if (res.status === APIResponse.Success) {
              //after fetching all service providers we will now check if their gender match with selected user or not
              this.totalCost = res.data;

              let checkIfCategory1 = this.cartData.some(data => data.category_id === 1);
              // If there are items with category_id === 1, add home visit cost
              if (checkIfCategory1) {
                this.homeVist = 150;
              }

              let user_data = {
                user_id: this.userId,
              };

              this._patientService.getProfileInformation(user_data).subscribe({
                next: (res: any) => {
                  //in case of success the api returns 0 as a status code
                  if (res.status === APIResponse.Success) {
                    let idType = res.data.id_number;
                    let ifSaudiId = this.validateNationalId(idType);

                 this.totalCost = this.totalCost + this.homeVist;


                    if (ifSaudiId === -1  || ifSaudiId === 2) {
                      const taxRate = 0.15;
                      const taxAmount = this.totalCost * taxRate;

                      this.total_inc_cost = Math.round(
                        this.totalCost + taxAmount
                      );
                    } else {
                      this.total_inc_cost = Math.round(this.totalCost);
                    }
                  }
                },
              });
            }
          },
          error: (err: any) => {
            console.log(err);
          },
        });

        //here we will identidy cart categories and item associated with each category
        this.dataService.data$.subscribe((res) => {
          if (res) {
            if (Object.keys(res).length === 0) {
              this.router.navigate(["/"]);
            }

            let categories = res.categories;
            this.cartData.forEach((item) => {
              let filteredCategories = categories.filter((category) => {
                return category.id === item.category_id;
              });

              if (filteredCategories.length > 0) {
                if (!this.allCartCategoriesData[filteredCategories[0].id]) {
                  this.allCartCategoriesData[filteredCategories[0].id] = [];

                  item["category_title"] = filteredCategories[0].title;
                  this.allCartCategoriesData[filteredCategories[0].id].push(
                    item
                  );
                } else {
                  item["category_title"] = filteredCategories[0].title;
                  this.allCartCategoriesData[filteredCategories[0].id].push(
                    item
                  );
                }
              }
            });
          } else {
            this.router.navigate(["/"]);
          }
        });

        const dataArray = Object.values(this.allCartCategoriesData) as any;
        this.allCartCategoriesData = dataArray;
        this.calculateTimeSlots();
      }
    } else {
      this.loginAlert = true;
    }

    let data = {
      user_id: this.userId,
    };

    this._patientService.getDependantsList(data).subscribe({
      next: (res: any) => {
        //in case of success the api returns 0 as a status code
        if (res.status === APIResponse.Success) {
          res.data.forEach((dependant) => {
            this.userDependants.push(dependant);
          });
        }
      },

      error: (err: any) => {},
    });

    //this.websocketService.connect(); // Assuming you have a connect() method in your service

    let sa = {
      user_id: this.userId,
    };

    this._b2c.getSocketData(sa).subscribe({
      next: (res: any) => {
        //in case of success the api returns 0 as a status code
        if (res.status === APIResponse.Success) {
          //after fetching all service providers we will now check if their gender match with selected user or not
          this.fetchedData = res.data;

          this.dataService.data$.subscribe((res) => {
            if (res) {
              // ... handle the received data here
              let services = res.services;
              let filteredServices = [];

              this.cartData.forEach((cartItem) => {
                let temp = services.filter((service) => {
                  return service.id === cartItem.id;
                });

                if (temp.length > 0) {
                  filteredServices.push(temp[0]);
                }
              });

              let branch = localStorage.getItem("THSBranch") || 1;

              let spData = {
                branch: branch,
                services: filteredServices,
                patients: this.userDependants,
              };

              this._b2c.checkServiceProviderEligibilty(spData).subscribe({
                next: (ress: any) => {
                  //in case of success the api returns 0 as a status code
                  if (ress.status === APIResponse.Success) {
                    //after fetching all service providers we will now check if their gender match with selected user or not
                    this.serviceProvidersServices = ress.data;

                    for (let key in this.serviceProvidersServices) {
                      this.serviceProvidersServices[key].forEach((s) => {
                        s.days = JSON.parse(s.days);
                      });
                    }

                    this.selectCurrentDay();
                    this.generateWeek();
                    this.updateCurrentMonthAndYear();
                  } else {
                  }
                },
                error: (err: any) => {
                  console.log(err);
                },
              });
            }
          });
        } else {
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });

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

  initializeApp(): void {
    // Call the initialization service method here
    this.initializationService.initializeApp().subscribe(
      () => {
        console.log("App initialized successfully.");
        // You can perform any other logic after initialization here
      },
      (error) => {
        console.error("App initialization error:", error);
        // Handle initialization error here
      }
    );
  }
  selectCurrentDay() {
    this.selectDate(new Date());
  }

  generateWeek() {
    this.currentWeek = [];
    const currentDay = this.currentDate.getDay();

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const currentDayIndex = this.currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Reorder the days of the week to start from the current day.
    this.weekDays = [
      ...daysOfWeek.slice(currentDayIndex),
      ...daysOfWeek.slice(0, currentDayIndex),
    ];

    for (let i = 0; i < 7; i++) {
      const day = new Date(this.currentDate);
      day.setDate(this.currentDate.getDate() + i);
      this.currentWeek.push(day);
    }
  }

  updateCurrentMonthAndYear() {
    this.currentMonthAndYear = formatDate(this.currentDate, "MMMM y", "en-US");
  }

  goToNextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeek();
    this.updateCurrentMonthAndYear();
  }

  goToPreviousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeek();
    this.updateCurrentMonthAndYear();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.timeSlots = [];
    this.calculateTimeSlots();
  }

  isPreviousDisabled(): boolean {
    const today = new Date();
    const firstDateOfWeek = this.currentWeek[0];

    return firstDateOfWeek <= today;
  }

  ngOnDestroy() {
    //this.dataSubscription.unsubscribe() // Unsubscribe from the data stream
  }

  sendMessage(message: string): void {
    this.websocketService.sendMessage(message);
  }

  formatTimeSlot(hour: number): string {
    const amPm = hour >= 12 ? "pm" : "am";

    const formattedHour = hour > 12 ? hour - 12 : hour;

    return `${formattedHour === 0 ? 12 : formattedHour}:00${amPm}`;
  }

  //this function will calculate time slots if date is selected
  calculateTimeSlots() {
    this.timeSlots = [];
    // Assuming fetchedData.appointments contains the list of appointments
    if (!this.selectedDate || this.cartData.length === 0) {
      // No selected date or no services in cart, return empty time slots
      this.timeSlots = [];
      return;
    }

    this.allCartCategoriesData.forEach((data) => {
      this.timeSlots = [];

      data[0]["timeSlots"] = []
      
      const formattedSelectedDate = this.formatSelectedDate(this.selectedDate);

      this.setPreferredDate(formattedSelectedDate);

      // Create a list to store time slots to be removed
      const timeSlotsToRemove = [];

      const serviceIds = data.map((item) => item.id);

      // Get all service providers for the selected services
      let sps = serviceIds.map((serviceId) => {
        return this.serviceProvidersServices[serviceId].filter(
          (sp) => sp.service_id === serviceId
        );
      });

        // Flatten the array of arrays into a single array of service providers
        const flattenedProviders = [].concat(...sps);
        sps = flattenedProviders;

        if(sps.length>0){

          let sd = this.formatSelectedDate(this.selectedDate).toString();

          let day = this.selectedDate.toISOString();
          // Create an array to map the day index to its name
          const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
  
          // Create a new Date object from the selected date
          const dateObject = new Date(day);
          // Get the day index (0 for Sunday, 1 for Monday, etc.)
          const dayIndex = dateObject.getDay();
  
          // Get the day name from the dayNames array using the day index
          const dayName = dayNames[dayIndex].toLowerCase();
          // Initialize a variable to store the minimum time
          let minTime = undefined;
          let maxTime = undefined;
  
          // Iterate through the service providers again to find the minimum time for Tuesday
          sps.forEach((s) => {
            // Extract the Tuesday availability from the service provider
            const dayAvailability = s.days[dayName];
  
            // Check if the availability is defined
            if (dayAvailability) {
              // Extract the start time for Tuesday
              const startTime = new Date(
                `1970-01-01T${dayAvailability.start_time}`
              );
  
              // Convert end time to a Date object
              const endTime = new Date(`1970-01-01T${dayAvailability.end_time}`);
  
              // If minTime is undefined or the current start time is earlier than minTime
              if (!minTime || startTime < minTime) {
                minTime = startTime;
              }
  
              if (!maxTime || endTime > maxTime) {
                maxTime = endTime;
              }
            }
          });
  
          this.fetchedData.appointments = this.fetchedData.appointments.filter(
            (app) => {
              return app.serviceAssigneeId !== null;
            }
          );
          sps = sps.filter((s) => {
            return s[dayName] === 1;
          });

          let uniqueScheduledTimes = this.fetchedData.appointments
            .filter((app) => {
              // Check if app.serviceAssigneeId is not null and there's a matching sp in sps
              return (
                sps.some(
                  (sp) => Number(sp.user_id) === Number(app.serviceAssigneeId)
                ) && app.serviceDate === sd
              );
            })
            .map((app) => {
              // Convert the database time format (e.g., "2023-09-04T19:00:00.000Z") to time slots format (e.g., "4:00pm")
              const dbTime = app.serviceTime;
  
              const [hours, minutes] = dbTime.split(":");
              const ampm = hours >= 12 ? "pm" : "am";
              const formattedTime = `${hours % 12 || 12}:${minutes}${ampm}`;
              return formattedTime;
            });
  
          const timeSlotCounts = {};
          uniqueScheduledTimes.forEach((time) => {
            timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
          });
          // Filter the time slots where all service providers are booked
          const filteredTimeSlots = Object.keys(timeSlotCounts).filter((time) => {
            return timeSlotCounts[time] === sps.length;
          });
  
          // Function to check if a time slot is available
          const isTimeSlotAvailable = (timeSlot: string) => {
            return !filteredTimeSlots.includes(timeSlot);
          };
  
          const currentDate = new Date();
          const currentHour = currentDate.getHours();
          const currentDateString = currentDate.toISOString().slice(0, 10); // Get current date in "yyyy-mm-dd" format

          const selectedDate = this.formatSelectedDate(this.selectedDate);
          
          // Calculate 3 hours later from the current time
          const threeHoursLater = new Date(
            currentDate.getTime() + 3 * 60 * 60 * 1000
          );
          const threeHoursLaterHour = threeHoursLater.getHours();
  
          // Calculate 3 hours later from the current time
  
          // Convert minTime and maxTime to hours (as integers)
          const minHour = minTime.getHours();
          const maxHour = maxTime.getHours();
          for (let hour = minHour; hour <= maxHour; hour++) {
            const timeSlot = this.formatTimeSlot(hour);
            // Check if the selectedDate is today
            if (selectedDate === currentDateString) {
              // Calculate the hour 3 hours later for the current day
              const threeHoursLaterCurrent = new Date(
                currentDate.getTime() + 4 * 60 * 60 * 1000
              );
  
              const threeHoursLaterCurrentHour =
                threeHoursLaterCurrent.getHours();
  
              if (hour < threeHoursLaterCurrentHour) {
                continue; // Skip past time slots for today
              } else {
                this.timeSlots.push(timeSlot);
              }
            } else {
              // For future dates, include all time slots
              if (isTimeSlotAvailable(timeSlot)) {
                this.timeSlots.push(timeSlot);
              }
            }
          }
  
          // Remove the time slots that need to be removed
          this.timeSlots = this.timeSlots.filter(
            (slot) => !timeSlotsToRemove.includes(slot)
          );
  
          if(sps.length  === 0) { 
            data[0]["timeSlots"] = []

          }
          else {

            data[0]["timeSlots"] = this.timeSlots;

          }

        }
      
    });

    //  }
  }

  findAllCommonServiceProviders() {
    if (this.cartData.length <= 1) {
      // If there's only one service or no services, return an empty array
      return [];
    }

    const serviceIds = this.cartData.map((item) => item.id);

    // Find the providers for the first service in the cart
    const providersOfFirstService =
      this.serviceProvidersServices[serviceIds[0]];

    if (!providersOfFirstService) {
      return [];
    }

    // Check if each provider of the first service provides all other services in the cart
    const commonProviders = providersOfFirstService.filter((provider) => {
      return serviceIds.every((serviceId) => {
        const providersForService = this.serviceProvidersServices[serviceId];

        return (
          providersForService &&
          providersForService.some((p) => p.user_id === provider.user_id)
        );
      });
    });

    return commonProviders.map((provider) => provider.user_id);
  }

  isTimeSlotBooked(providerIds: string[], timeSlot: string) {
    return this.fetchedData.appointments.some((appointment) => {
      return (
        providerIds.includes(appointment.serviceAssigneeId) &&
        appointment.serviceTime === timeSlot
      );
    });
  }

  // Assuming selectedDate is a Date object
  formatSelectedDate(selectedDate: Date) {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  setPreferredTimeSlot(time) {
    this.preferredTime = time;
  }

  setPreferredDate(date) {
    this.preferredDate = date;
  }

  proceedToPay() {
    let count = 0;

    for (let data of this.allCartCategoriesData) {
      if (data) {
        if (!data[0].preferredTime || !data[0].selectedDate) {
          count = count + 1;
        }

        if (data[0].selectedDate instanceof Date) {
          const currentDate = new Date(data[0].selectedDate);

          // Add one day to the current date to get the selected date
          currentDate.setDate(currentDate.getDate());

          // Convert the selected date to an ISO string in UTC format
          const selectedDateISO = currentDate.toISOString();
          data[0]["selectedDate"] = selectedDateISO;
        }
      }
    }

    if (count > 0) {
      this.errorOccured = true;
    } else {
      let patient_note = (document.getElementById("patient_note") as any).value;
      let data = {
        cartData: this.cartData,
        preferredTime: this.preferredTime,
        preferredDate: this.formatSelectedDate(this.selectedDate),
        patient_note: patient_note,
      };

      localStorage.setItem("THSPaylaod", JSON.stringify(data));

      localStorage.setItem(
        "THSMultiAppointment",
        JSON.stringify(this.allCartCategoriesData)
      );

      this.router.navigate(["/checkout/confirmation"]);
    }
  }

  navigateToCart() {
    this.router.navigate(["/checkout/cart"]);
  }

  handleCancelClick(): void {}

  //alert continue button handler
  handleContinueClick(): void {
    this.router.navigate(["/login"]);
  }

  handleContinueClickTimeDate() {
    this.errorOccured = false;
  }

  setCartDataTimeValue(value, time) {
    this.allCartCategoriesData[value][0]["preferredTime"] = time;
  }

  setCartDataDateValue(value, date) {
    this.allCartCategoriesData[value][0]["selectedDate"] = date;
  }

  getDate(date1, date2) {
    let expression = false;

    let x = new Date(date1);
    if (x?.toDateString() === date2) {
      expression = true;
    }

    return expression;
  }

  validateNationalId(id) {
    const type = id.substr(0, 1);
    const _idLength = 10;
    const _type1 = "1";
    const _type2 = "2";
    let sum = 0;

    id = id.trim();

    if (
      isNaN(parseInt(id)) ||
      id.length !== _idLength ||
      (type !== _type2 && type !== _type1)
    ) {
      return -1;
    }
    for (let num = 0; num < 10; num++) {
      const digit = Number(id[num]);

      if (num % 2 === 0) {
        const doubled = digit * 2;
        const ZFOdd = `00${doubled}`.slice(-2);
        sum += Number(ZFOdd[0]) + Number(ZFOdd[1]);
      } else {
        sum += digit;
      }
    }

    return sum % 10 !== 0 ? -1 : Number(type);
  }
}
