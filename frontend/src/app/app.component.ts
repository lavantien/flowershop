import {Component, OnInit, TemplateRef} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {
	faArrowDown,
	faArrowLeft,
	faArrowRight,
	faArrowUp,
	faChartLine,
	faCubes,
	faHandshake,
	faSearch,
	faSignInAlt,
	faSignOutAlt,
	faStore,
	faUser,
	faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {HttpClient} from "@angular/common/http";
import {InputValidatorService} from "./_services/input-validator.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isAdmin = true;
	isTest = true;
	isLoggedIn = false;
	faArrowUp = faArrowUp;
	faArrowDown = faArrowDown;
	faArrowLeft = faArrowLeft;
	faArrowRight = faArrowRight;
	faStore = faStore;
	faUser = faUser;
	faWarehouse = faWarehouse;
	faHandshake = faHandshake;
	faCubes = faCubes;
	faSearch = faSearch;
	faSignInAlt = faSignInAlt;
	faSignOutAlt = faSignOutAlt;
	faChartLine = faChartLine;
	modalRef: BsModalRef;
	modalRef2: BsModalRef;
	loginForm = {
		email: '',
		password: ''
	};
	signUpForm = {
		name: '',
		email: '',
		reEmail: '',
		password: '',
		rePassword: '',
		phone: '',
		address: '',
		district: 'Bình Thạnh',
		city: 'Hồ Chí Minh',
		type: 'USER'
	};
	forgotPasswordForm = {
		email: '',
		newPassword: '',
		reNewPassword: ''
	};
	cities: City[] = [];
	districts: District[] = [];

	constructor(private http: HttpClient,
	            private modalService: BsModalService,
	            private inputValidator: InputValidatorService,
	            public translate: TranslateService) {
		translate.addLangs(['en', 'vi']);
		translate.setDefaultLang('en');
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
	}

	ngOnInit() {
		this.getCities();
		this.getDistricts();
	}

	getCities() {
		this.http.get<City[]>('../assets/data/cities.json').subscribe(data => {
			if (!!data) {
				this.cities = data;
				this.signUpForm.city = this.cities[0].name;
			}
		});
	}

	getDistricts() {
		this.http.get<District[]>('../assets/data/districts.json').subscribe(data => {
			if (!!data) {
				this.districts = data;
				this.signUpForm.district = this.districts[0].name;
			}
		});
	}

	openLoginModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	onLogin() {
		if (this.inputValidator.isEmail(this.loginForm.email)) {
			alert('Login!');
		} else {
			alert('Login Failed!');
		}
		console.log(this.loginForm);
		console.log(this.inputValidator.isInteger(1650));
		console.log(this.inputValidator.isInteger(165.213));
	}

	openSignUpModal(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template);
	}

	onCreateUser() {
		alert('Created!');
		console.log(this.signUpForm);
	}

	openForgotPasswordModal(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template);
	}

	onVerifyEmail() {
		// TODO: Implement verify email for forgot password.
		alert('Verified!');
		console.log(this.forgotPasswordForm);
	}

	onRefreshLoginForm() {
		this.loginForm = {
			email: '',
			password: ''
		};
	}

	onRefreshSignUpForm() {
		this.signUpForm = {
			name: '',
			email: '',
			reEmail: '',
			password: '',
			rePassword: '',
			phone: '',
			address: '',
			district: 'Bình Thạnh',
			city: 'Hồ Chí Minh',
			type: 'USER'
		};
	}

	onRefreshForgotPasswordForm() {
		this.forgotPasswordForm = {
			email: '',
			newPassword: '',
			reNewPassword: ''
		};
	}

	scrollTop() {
		window.scrollTo(0, 0);
	}

	scrollBottom() {
		window.scrollTo(0, document.body.scrollHeight);
	}

	scrollLeft() {
		window.scrollTo(0, window.pageYOffset);
	}

	scrollRight() {
		window.scrollTo(document.body.scrollWidth, window.pageYOffset);
	}
}

interface City {
	name: string;
}

interface District {
	name: string;
	cityName: string;
}