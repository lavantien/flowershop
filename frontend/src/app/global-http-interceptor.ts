import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, retry, timeout} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {
	constructor(private spinner: NgxSpinnerService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Add Auth Token
		const hardcodedToken = 'VUlULiBTRTM0Ny5LMTEuUE1DTCAtIEdWLiBUcmFuIEFuaCBEdW5nLiBOaG9tIDEgLSBMYSBWYW4gVGllbiwgTmd1eWVuIFR1YW4gUGh1b25nIE5hbSwgTGUgVmlldCBIdXluaC4=';
		req = req.clone({
			setHeaders: {
				Authorization: `Basic ${hardcodedToken}`
			}
		});
		this.spinner.show();
		return next.handle(req).pipe(
			timeout(3000),
			retry(2),
			catchError((error: HttpErrorResponse) => {
				// TODO: Add error handling logic here
				console.log(`HTTP Error ${error.status}: ${req.url}`);
				return throwError(error);
			}),
			// PROFILING
			finalize(() => {
				// const profilingMsg = `${req.method} "${req.urlWithParams}"`;
				// console.log(profilingMsg);
				this.spinner.hide();
			}));
	}
}
