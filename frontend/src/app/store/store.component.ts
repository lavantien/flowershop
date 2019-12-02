import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {DataTranslateService} from "../_services/data-translate.service";
import {SharedService} from "../_services/shared.service";
import {Lightbox} from "ngx-lightbox";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {timeout} from "rxjs/operators";
import {faSearch} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {
	faSearch = faSearch;
	timeOutHttpRequest = 2000;
	private subscriptions = new Subscription();
	modalRef: BsModalRef;
	products: Product[] = [];
	categories: Category[] = [];
	types: Type[] = [];
	bgPrimary = '';
	tcPrimary = '';
	locale = '';
	pagination = {
		totalItem: 0,
		itemPerPage: 24,
		currentPage: 1,
		maxSize: 9
	};
	displayProducts: Product[] = [];
	searchForm = {
		name: '',
		categoryName: '',
		typeName: ''
	};
	searchResults: Product[] = [];

	constructor(private http: HttpClient,
	            private modalService: BsModalService,
	            private dataTranslateService: DataTranslateService,
	            private sharedService: SharedService,
	            private lightbox: Lightbox,
	            private spinner: NgxSpinnerService,
	            public translate: TranslateService) {
	}

	ngOnInit() {
		this.getProducts();
		this.getCategories();
		this.getTypes();
		this.subscriptions.add(this.sharedService.getGlobalLanguage().subscribe(lang => {
			this.locale = this.dataTranslateService.getLocale(lang);
		}));
		this.subscriptions.add(this.sharedService.getGlobalBackgroundPrimary().subscribe(bg => {
			this.bgPrimary = bg[0];
			this.tcPrimary = bg[1];
		}));
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	getProducts() {
		this.spinner.show();
		this.http.get<Product[]>('/api/product').pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
			if (!!data) {
				this.products = data;
				this.products.forEach(product => {
					product.imgUrl = product.imgUrl ? atob(product.imgUrl) : '';
					product.price = this.dataTranslateService.getPrice(product.price, 'vi');
				});
				this.searchResults = data;
				this.paging(this.searchResults);
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.products = [];
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	getCategories() {
		this.spinner.show();
		this.http.get<Category[]>('/api/category').pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
			if (!!data) {
				this.categories = data;
				this.searchForm.categoryName = this.categories[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.categories = [];
			this.searchForm.categoryName = '';
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	getTypes() {
		this.spinner.show();
		this.http.get<Type[]>('/api/type').pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
			if (!!data) {
				this.types = data;
				this.searchForm.typeName = this.types[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.types = [];
			this.searchForm.typeName = '';
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	paging(data: Product[]) {
		this.pagination.totalItem = data.length;
		this.displayProducts = data.slice((this.pagination.currentPage - 1) * this.pagination.itemPerPage,
			this.pagination.currentPage * this.pagination.itemPerPage);
	}

	onPageChanged(event: any) { // 1: 0 1 2 3   2: 4 5 6 7   3: 8 9 10 11
		this.displayProducts = this.searchResults.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage);
	}

	onSearch() {
		let searchResults: Product[] = [];
		this.products.forEach(product => {
			if (this.searchForm.name === '' && this.searchForm.typeName === product.typeName && this.searchForm.categoryName === product.categoryName) {
				searchResults.push(product);
			} else if (this.searchForm.name !== '' && product.name.toLowerCase().includes(this.searchForm.name.toLowerCase())) {
				searchResults.push(product);
			}
		});
		this.paging(searchResults);
		this.searchResults = searchResults;
	}

	onChangeCategory(mode: string) {
		if (mode === 'search') {
			this.searchForm.name = '';
			this.searchForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.searchForm.categoryName)].name;
		}
	}

	onChangeTypeSearch() {
		this.searchForm.name = '';
	}

	onOpenImage(index: number) {
		let album: {
			src: string;
			caption: string;
			thumb: string;
		}[] = [];
		const src = this.displayProducts[index].imgUrl;
		const thumb = this.displayProducts[index].imgUrl;
		let caption = this.displayProducts[index].name;
		let category = '';
		let type = '';
		this.translate.get('DATA.' + this.displayProducts[index].categoryName).subscribe(rs => {
			category = rs;
		});
		this.translate.get('DATA.' + this.displayProducts[index].typeName).subscribe(rs => {
			type = rs;
		});
		caption += ' - (' + category + ' - ' + type + ').';
		album.push({
			src: src,
			caption: caption,
			thumb: thumb
		});
		this.lightbox.open(album, 0);
	}

	trackByFn(index, item) {
		return index;
	}
}

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	imgUrl: string;
	quantity: number;
	saleAmount: number;
	categoryName: string;
	typeName: string;
}

interface Category {
	id: number;
	name: string;
}

interface Type {
	id: number;
	name: string;
	categoryName: string;
}
