import { Component, OnInit } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InitializationService } from 'src/service/initialization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    Location, {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ]
})

export class AppComponent {
  title = 'Taib';
  location: any;
  routerSubscription: any;
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private initializationService: InitializationService
    ) {
      this.initializeApp();
  }


  ngOnInit() {
  
    this.recallJsFuntions();
   

  }

  initializeApp(): void {
    // Call the initialization service method here
    this.initializationService.initializeApp().subscribe(
      () => {
        console.log('App initialized successfully.');
        // You can perform any other logic after initialization here
      },
      error => {
        console.error('App initialization error:', error);
        // Handle initialization error here
      }
    );
  }


  recallJsFuntions() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
      .subscribe(event => {
        $.getScript('../assets/js/custom.js');
        this.location = this.router.url;
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
  }
}
