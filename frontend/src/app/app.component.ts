import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isAdmin = true;
	isTest = true;
	isLoggedIn = true;

	constructor(public translate: TranslateService) {
		translate.addLangs(['en', 'vi']);
		translate.setDefaultLang('en');
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
	}

	ngOnInit() {
	}

	scrollTop() {
		window.scrollTo(0, 0);
	}
}
