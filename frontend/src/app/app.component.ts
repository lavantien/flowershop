import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {
	faAngleDoubleDown,
	faAngleDoubleUp,
	faArrowLeft,
	faArrowRight,
	faChartLine,
	faCubes,
	faHandshake,
	faSearch,
	faShoppingCart,
	faSignInAlt,
	faSignOutAlt,
	faStore,
	faUser,
	faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {HttpClient} from "@angular/common/http";
import {InputValidatorService} from "./_services/input-validator.service";
import {SharedService} from "./_services/shared.service";
import {timeout} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {Subscription} from "rxjs";
// TODO: Add footer
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	isAdmin = true;
	isTest = true;
	isLoggedIn = false;
	faAngleDoubleUp = faAngleDoubleUp;
	faAngleDoubleDown = faAngleDoubleDown;
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
	faShoppingCart = faShoppingCart;
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
	bgPrimary = '';
	tcPrimary = '';
	displayBg = 'LIGHT';
	displayBgs = ['LIGHT', 'BLUE', 'GRAY', 'GREEN', 'RED', 'YELLOW', 'TEAL', 'BLACK', 'WHITE', 'TRANS'];
	bgs = ['bg-light', 'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark', 'bg-white', 'bg-transparent'];
	tcs = ['text-dark', 'text-white', 'text-white', 'text-white', 'text-white', 'text-dark', 'text-white', 'text-white', 'text-dark', 'text-dark'];
	timeOutHttpRequest = 2000;
	private subscriptions = new Subscription();

	constructor(private http: HttpClient,
	            private modalService: BsModalService,
	            private inputValidator: InputValidatorService,
	            private sharedService: SharedService,
	            private spinner: NgxSpinnerService,
	            public translate: TranslateService) {
		translate.addLangs(['en', 'vi']);
		translate.setDefaultLang('en');
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
		this.subscriptions.add(this.sharedService.getGlobalBackgroundPrimary().subscribe(bg => {
			this.bgPrimary = bg[0];
			this.tcPrimary = bg[1];
		}));
	}

	ngOnInit() {
		this.getCities();
		this.getDistricts();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	getCities() {
		this.spinner.show();
		this.http.get<City[]>('../assets/data/cities.json').pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
			if (!!data) {
				this.cities = data;
				this.signUpForm.city = this.cities[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.cities = [];
			this.signUpForm.city = '';
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	getDistricts() {
		this.spinner.show();
		this.http.get<District[]>('../assets/data/districts.json').pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
			if (!!data) {
				this.districts = data;
				this.signUpForm.district = this.districts[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.districts = [];
			this.signUpForm.district = '';
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	onChangeThemeColor() {
		this.sharedService.updateGlobalBackgroundPrimary([this.bgs[this.displayBgs.findIndex(x => x === this.displayBg)], this.tcs[this.displayBgs.findIndex(x => x === this.displayBg)]]);
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
	}

	openSignUpModal(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template);
	}

	onCreateUser() {
		alert('Created!');
	}

	openForgotPasswordModal(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template);
	}

	onVerifyEmail() {
		// TODO: Implement verify email for forgot password.
		alert('Verified!');
	}

	openCartModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	onSettle() {
		alert('confirmed transaction!');
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