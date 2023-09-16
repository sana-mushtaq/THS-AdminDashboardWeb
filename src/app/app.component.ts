import { Component, OnInit, Renderer2, Inject  } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InitializationService } from 'src/service/initialization.service';
import { DOCUMENT } from '@angular/common';
import { LanguageService } from 'src/service/language.service';

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
    private initializationService: InitializationService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private languageService: LanguageService
    ) {
      this.initializeApp();
  }


  ngOnInit() {
  
    this.recallJsFuntions();
    const language = this.languageService.getCurrentLanguage();
    const body = document.getElementsByTagName('body')[0];

    if (language === 'ar') {

      body.setAttribute('dir', 'rtl');
      body.classList.add('web-font-ar');
      body.classList.remove('web-font');

    } else {

      body.setAttribute('dir', 'ltr');
      body.classList.add('web-font');
      body.classList.remove('web-font-ar');

    }
   
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

  getDirection(language: string): string {

    // Determine direction based on language code
    return language === 'ar' ? 'rtl' : 'ltr';

  }

  // Example code to handle language changes
  onLanguageChange(language: string) {
    this.languageService.setLanguage(language);

    const currentLanguage = this.languageService.getCurrentLanguage();

    if (currentLanguage === 'ar') {
      this.renderer.setAttribute(this.document.body, 'dir', 'rtl');
    } else {
      this.renderer.setAttribute(this.document.body, 'dir', 'ltr');
    }
}

}
