import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let sessionDetails = localStorage.getItem("SessionDetails");
    if (typeof sessionDetails !== "undefined" && sessionDetails !== null) {
      let session = JSON.parse(sessionDetails);
      if (session && session.authToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${session.authToken}`,
          },
        });
      }
    }
    return next.handle(request);
  }
}
