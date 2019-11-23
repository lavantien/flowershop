import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isAdmin = true;
	isTest = true;
	isLoggedIn = true;

	constructor() {
	}

	ngOnInit() {
	}

	reloadPage() {
		window.scrollTo(0, 0);
	}
}
