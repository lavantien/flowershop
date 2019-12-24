import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
	faAngleDoubleDown,
	faAngleDoubleUp,
	faArrowLeft,
	faArrowRight,
	faChartLine,
	faCubes,
	faHandshake,
	faMinus,
	faPlus,
	faSearch,
	faShoppingCart,
	faSignInAlt,
	faSignOutAlt,
	faStore,
	faUser,
	faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InputValidatorService} from './_services/input-validator.service';
import {SharedService} from './_services/shared.service';
import {Subscription} from 'rxjs';
import {SessionService} from './_services/session.service';
import {Product} from './_models/product';
import {Router} from "@angular/router";

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
	faMinus = faMinus;
	faPlus = faPlus;
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
		answer: '',
		reAnswer: '',
		phone: '',
		address: '',
		district: 'Bình Thạnh',
		city: 'Hồ Chí Minh'
	};
	forgotPasswordForm = {
		email: '',
		answer: '',
		password: '',
		rePassword: ''
	};
	cities: City[] = [];
	districts: District[] = [];
	bgPrimary = '';
	tcPrimary = '';
	displayBg = 'LIGHT';
	displayBgs = ['LIGHT', 'BLUE', 'GRAY', 'GREEN', 'RED', 'YELLOW', 'TEAL', 'BLACK', 'WHITE', 'TRANS'];
	bgs = ['bg-light', 'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark', 'bg-white', 'bg-transparent'];
	tcs = ['text-dark', 'text-white', 'text-white', 'text-white', 'text-white', 'text-dark', 'text-white', 'text-white', 'text-dark', 'text-dark'];
	countOfIndividualProduct: number[] = [];
	totalPriceOfIndividualProduct: number[] = [];
	addedProducts: Product[] = [];
	countAddedProduct = 0;
	totalPriceOfAddedProduct = 0;
	wrongLogin = false;
	wrongCreate = false;
	wrongForgot = false;
	private subscriptions = new Subscription();

	constructor(private http: HttpClient,
	            private router: Router,
	            private modalService: BsModalService,
	            private inputValidator: InputValidatorService,
	            private sharedService: SharedService,
	            private sessionService: SessionService,
	            public translate: TranslateService) {
		translate.addLangs(['en', 'vi']);
		translate.setDefaultLang('en');
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
		this.subscriptions.add(this.sharedService.getGlobalBackgroundPrimary().subscribe(bg => {
			this.bgPrimary = bg[0];
			this.tcPrimary = bg[1];
		}));
		this.subscriptions.add(this.sessionService.getNewlyAddedProduct().subscribe(product => {
			if (!!product) {
				const prodIndex = this.addedProducts.findIndex(x => x.id === product.id);
				if (prodIndex === -1) {
					this.addedProducts.push(product);
					this.countOfIndividualProduct.push(1);
					this.totalPriceOfIndividualProduct.push(product.price);
					++this.countAddedProduct;
				} else {
					++this.countOfIndividualProduct[prodIndex];
					this.totalPriceOfIndividualProduct[prodIndex] += product.price;
				}
				this.totalPriceOfAddedProduct += product.price;
			} else {
				this.countAddedProduct = 0;
			}
		}));
	}

	ngOnInit() {
		this.getCities();
		this.getDistricts();
		this.isLoggedIn = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')) !== '0+GUESS';
		this.isAdmin = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')).substring(atob(localStorage.getItem('token')).indexOf('+') + 1) === 'ADMIN';
		if (this.isAdmin) {
			this.router.navigate(['/admin']);
		}
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	getCities() {
		this.http.get<City[]>('../assets/data/cities.json').subscribe(data => {
			if (!!data) {
				this.cities = data;
				this.signUpForm.city = this.cities[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.cities = [];
			this.signUpForm.city = '';
		}, () => {
		});
	}

	getDistricts() {
		this.http.get<District[]>('../assets/data/districts.json').subscribe(data => {
			if (!!data) {
				this.districts = data;
				this.signUpForm.district = this.districts[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.districts = [];
			this.signUpForm.district = '';
		}, () => {
		});
	}

	onChangeThemeColor() {
		this.sharedService.updateGlobalBackgroundPrimary([this.bgs[this.displayBgs.findIndex(x => x === this.displayBg)], this.tcs[this.displayBgs.findIndex(x => x === this.displayBg)]]);
	}

	openLoginModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	onLogin() {
		if (this.inputValidator.isEmail(this.loginForm.email) || this.inputValidator.isPassword(this.loginForm.password)) {
			this.wrongLogin = true;
			this.onRefreshLoginForm();
			return;
		}
		this.wrongLogin = false;
		this.http.post<TokenDto>('/api/user/login', btoa(this.loginForm.email + 'j0z' + this.loginForm.password), {headers: new HttpHeaders({'Content-Type': 'text/plain'})}).subscribe((rs) => {
			localStorage.setItem('token', rs.token);
			this.isLoggedIn = true;
			this.isAdmin = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')).substring(atob(localStorage.getItem('token')).indexOf('+') + 1) === 'ADMIN';
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
			this.modalRef.hide();
		});
	}

	onLogout() {
		let tokenDto: TokenDto = {
			token: localStorage.getItem('token')
		};
		console.log(tokenDto);
		this.http.post<TokenDto>('/api/user/logout', tokenDto).subscribe((rs) => {
			localStorage.setItem('token', rs.token);
			this.isLoggedIn = false;
			this.isAdmin = false;
			this.router.navigate(['/shop']);
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
		});
	}

	openSignUpModal(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template);
	}

	onCreateUser() {
		if (this.inputValidator.isEmail(this.signUpForm.email) || this.inputValidator.isPassword(this.signUpForm.password) || this.signUpForm.password !== this.signUpForm.rePassword || this.signUpForm.email !== this.signUpForm.reEmail || this.signUpForm.answer !== this.signUpForm.reAnswer) {
			this.wrongCreate = true;
			this.onRefreshSignUpForm();
			return;
		}
		this.wrongCreate = false;
		this.http.post<User>('/api/user/create', this.signUpForm).subscribe(() => {
			alert('Create user successful!');
			this.loginForm.email = this.signUpForm.email;
			this.loginForm.password = this.signUpForm.password;
			this.onLogin();
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
			this.modalRef2.hide();
		});
	}

	openForgotPasswordModal(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template);
	}

	onVerify() {
		if (this.inputValidator.isEmail(this.forgotPasswordForm.email) || this.inputValidator.isPassword(this.forgotPasswordForm.password) || this.forgotPasswordForm.password !== this.forgotPasswordForm.rePassword) {
			this.wrongForgot = true;
			this.onRefreshForgotPasswordForm();
			return;
		}
		this.wrongForgot = false;
		this.forgotPasswordForm.answer = btoa(this.forgotPasswordForm.answer);
		this.forgotPasswordForm.password = btoa(this.forgotPasswordForm.password);
		this.forgotPasswordForm.rePassword = btoa(this.forgotPasswordForm.rePassword);
		this.http.post<TokenDto>('/api/user/resetPassword', this.forgotPasswordForm).subscribe((rs) => {
			if (atob(rs.token) === '0+GUESS') {
				alert('Reset password failed!');
			} else {
				alert('Reset password successful!');
				this.loginForm.email = this.forgotPasswordForm.email;
				this.loginForm.password = atob(this.forgotPasswordForm.password);
				this.onLogin();
			}
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
			this.modalRef2.hide();
		});
	}

	openCartModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
	}

	cancelAndDecreaseItem(index: number) {
		if (index === -1) {
			this.totalPriceOfAddedProduct = 0;
			this.countAddedProduct = 0;
			this.addedProducts.length = 0;
			this.countOfIndividualProduct.length = 0;
			this.totalPriceOfIndividualProduct.length = 0;
			return;
		}
		this.totalPriceOfAddedProduct -= this.addedProducts[index].price;
		if (this.countOfIndividualProduct[index] === 1) {
			this.addedProducts.splice(index, 1);
			this.countOfIndividualProduct.splice(index, 1);
			this.totalPriceOfIndividualProduct.splice(index, 1);
			--this.countAddedProduct;
		} else {
			--this.countOfIndividualProduct[index];
			this.totalPriceOfIndividualProduct[index] -= this.addedProducts[index].price;
		}
	}

	increaseItem(index: number) {
		++this.countOfIndividualProduct[index];
		this.totalPriceOfIndividualProduct[index] += this.addedProducts[index].price;
		this.totalPriceOfAddedProduct += this.addedProducts[index].price;
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
			answer: '',
			reAnswer: '',
			phone: '',
			address: '',
			district: 'Bình Thạnh',
			city: 'Hồ Chí Minh'
		};
	}

	onRefreshForgotPasswordForm() {
		this.forgotPasswordForm = {
			email: '',
			answer: '',
			password: '',
			rePassword: ''
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

interface User {
	name: string,
	email: string,
	password: string,
	answer: string,
	phone: string,
	address: string,
	district: string,
	city: string
}

interface TokenDto {
	token: string;
}
