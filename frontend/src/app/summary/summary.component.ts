import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../_models/user";
import {Product} from "../_models/product";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {DataTranslateService} from "../_services/data-translate.service";
import {TranslateService} from "@ngx-translate/core";
import {Bill} from "../_models/bill";

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
	isAdmin = false;
	isLoggedIn = false;
	products: Product[] = [];
	billsRender: Product[] = [];
	userIds: number[] = [];
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
		if (!this.isLoggedIn) {
			this.router.navigate(['/shop']);
		}
		this.getProducts();
	}

	ngOnDestroy() {
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
		this.http.get<Bill[]>('/api/bill').subscribe(rs => {
			if (!!rs) {
				rs.forEach((item, i) => {
					this.billsRender.push(this.products[this.products.findIndex(x => x.id === item.productId)]);
					this.countOfIndividualProduct.push(item.productQuantity);
					this.totalPriceOfIndividualProduct.push(item.price);
					this.totalPriceOfAddedProduct += item.price;
					this.settlementDate.push(item.settlementDate);
					this.userIds.push(item.userId);
				});
			}
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
		});
	}
}
