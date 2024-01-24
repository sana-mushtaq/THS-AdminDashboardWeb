// language.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({

  providedIn: 'root',

})

export class LanguageService {
  
  constructor(private translate: TranslateService) {

    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('ar');
    this.setLanguage('ar');

  }

  setLanguage(lang: string) {
  
    // Set the language for ngx-translate
    this.translate.use(lang);

    // You can also implement logic to set text direction based on the language (LTR or RTL)
    // For example, check if the lang is 'ar' (Arabic) and set text direction to 'rtl' in your CSS.
  
  }

  getCurrentLanguage(): string {
  
    return this.translate.currentLang;
  
  }

}
