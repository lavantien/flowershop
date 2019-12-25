import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Product} from "../_models/product";
import {Bill} from "../_models/bill";
import {DataTranslateService} from "../_services/data-translate.service";
import {User} from "../_models/user";

@Component({
	selector: 'app-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
	isAdmin = false;
	isLoggedIn = false;
	user: User = {
		name: 'GUESS',
		email: 'a@mail.com',
		password: 'abcxyz',
		answer: '112233',
		phone: '012',
		address: 'A',
		district: 'Bình Thạnh',
		city: 'Hồ Chí Minh'
	};
	products: Product[] = [];
	billsRender: Product[] = [];
	userId: number;
	countOfIndividualProduct: number[] = [];
	totalPriceOfIndividualProduct: number[] = [];
	totalPriceOfAddedProduct = 0;
	settlementDate: string[] = [];
	
	constructor(private http: HttpClient,
	            private router: Router,
	            private dataTranslateService: DataTranslateService,
	            public translate: TranslateService) {
	}

	ngOnInit() {
		this.isLoggedIn = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')) !== '0+GUESS';
		this.isAdmin = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')).substring(atob(localStorage.getItem('token')).indexOf('+') + 1) === 'ADMIN';
		if (this.isAdmin) {
			this.router.navigate(['/admin']);
		}
		if (!this.isLoggedIn) {
			this.router.navigate(['/shop']);
		}
		this.userId = parseInt(atob(localStorage.getItem('token')).substr(0, 1));
		this.getUser();
		this.getProducts();
	}

	ngOnDestroy() {
	}
	
	getUser() {
		if (this.userId === 0) {
			this.user = {
				name: 'GUESS',
				email: 'a@mail.com',
				password: 'abcxyz',
				answer: '112233',
				phone: '012',
				address: 'A',
				district: 'Bình Thạnh',
				city: 'Hồ Chí Minh'
			}
		} else {
			this.http.get<User>(`api/user/${this.userId}`).subscribe(rs => {
				if (!!rs) {
					this.user = rs;
					this.user.address = localStorage.getItem('detailAddress');
				}
			}, error => {
				console.log(`Error: ${error}`);
			}, () => {
			});
		}
	}

	getProducts() {
		this.http.get<Product[]>('/api/product').subscribe(products => {
			if (!!products) {
				this.products = products;
				this.products.forEach(product => {
					product.imgUrl = product.imgUrl ? atob(product.imgUrl) : '';
					product.price = this.dataTranslateService.getPrice(product.price, 'vi');
				});
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.products = [];
		}, () => {
			this.getBills();
		});
	}
	
	getBills() {
		this.http.get<Bill[]>(`/api/bill/user/${this.userId}`).subscribe(rs => {
			if (!!rs) {
				rs.forEach((item, i) => {
					this.billsRender.push(this.products[this.products.findIndex(x => x.id === item.productId)]);
					this.countOfIndividualProduct.push(item.productQuantity);
					this.totalPriceOfIndividualProduct.push(item.price);
					this.totalPriceOfAddedProduct += item.price;
					this.settlementDate.push(item.settlementDate);
				});
			}
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
		});
	}
}
