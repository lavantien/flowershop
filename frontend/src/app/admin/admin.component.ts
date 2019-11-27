import {Component, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {faPen, faPlusSquare, faSearch, faTrash} from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from "@ngx-translate/core";

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
	modalRef: BsModalRef;
	data: Product[] = [];
	products: Product[] = [];
	productsDescription: string[] = [];
	categories: Category[] = [];
	types: Type[] = [];
	pagination = {
		totalItem: 0,
		itemPerPage: 10,
		currentPage: 1,
		maxSize: 8
	};
	createForm = {
		name: '',
		description: '',
		price: 0,
		imgUrl: '',
		quantity: 0,
		saleAmount: 0,
		categoryName: '',
		typeName: ''
	};
	editForm = {
		name: '',
		description: '',
		price: 0,
		imgUrl: '',
		quantity: 0,
		saleAmount: 0,
		categoryName: '',
		typeName: ''
	};
	searchForm = {
		name: '',
		categoryName: '',
		typeName: ''
	};
	currentId = 0;
	faSearch = faSearch;
	faPlusSquare = faPlusSquare;
	faPen = faPen;
	faTrash = faTrash;

	constructor(private http: HttpClient, private modalService: BsModalService, public translate: TranslateService) {
	}

	ngOnInit() {
		this.getProducts();
		this.getCategories();
		this.getTypes();
	}

	getProducts() {
		this.http.get<Product[]>('api/product').subscribe(data => {
			this.data = data;
			this.data.forEach(product => {
				product.imgUrl = product.imgUrl ? atob(product.imgUrl) : '';
				this.productsDescription.push(product.description.substr(0, 60) + (product.description.length > 60 ? '...' : ''));
			});
			this.pagination.totalItem = this.data.length;
			this.repaging(data);
		});
	}

	getCategories() {
		this.http.get<Category[]>('api/category').subscribe(data => {
			this.categories = data;
			if (!!data) {
				this.createForm.categoryName = this.categories[0].name;
				this.searchForm.categoryName = this.categories[0].name;
			}
		});
	}

	getTypes() {
		this.http.get<Type[]>('api/type').subscribe(data => {
			this.types = data;
			if (!!data) {
				this.createForm.typeName = this.types[0].name;
				this.searchForm.typeName = this.types[0].name;
			}
		});
	}

	repaging(data: Product[]) {
		this.products = data.slice((this.pagination.currentPage - 1) * this.pagination.itemPerPage,
			this.pagination.currentPage * this.pagination.itemPerPage);
	}

	onSearch() {
		let searchResults: Product[] = [];
		this.productsDescription.length = 0;
		this.data.forEach(product => {
			if (this.searchForm.name === '' && this.searchForm.typeName === product.typeName && this.searchForm.categoryName === product.categoryName) {
				searchResults.push(product);
				this.productsDescription.push(product.description.substr(0, 60) + (product.description.length > 60 ? '...' : ''));
			} else if (this.searchForm.name !== '' && product.name.includes(this.searchForm.name)) {
				searchResults.push(product);
				this.productsDescription.push(product.description.substr(0, 60) + (product.description.length > 60 ? '...' : ''));
			}
		});
		this.pagination.totalItem = searchResults.length;
		this.repaging(searchResults);
		this.searchForm.name = '';
	}

	onCreate() {
		this.http.post<Product>('api/product/create', () => {
			this.createForm.imgUrl = btoa(this.createForm.imgUrl);
			return this.createForm;
		}).subscribe(data => {
			this.getProducts();
			alert('Created!');
		});
	}

	onEdit() {
		this.http.put<Product>(`api/product/${this.currentId}`, () => {
			this.editForm.imgUrl = btoa(this.editForm.imgUrl);
			return this.editForm;
		}).subscribe(data => {
			this.getProducts();
			alert('Edited!');
		});
	}

	onDelete(id: number) {
		this.http.delete<any>('api/product/delete?id=' + id).subscribe(data => {
			this.getProducts();
			alert('Deleted!');
		});
	}

	onRefreshCreateForm() {
		this.createForm = {
			name: '',
			description: '',
			price: 0,
			imgUrl: '',
			quantity: 0,
			saleAmount: 0,
			categoryName: '',
			typeName: ''
		};
	}

	onRefreshEditForm() {
		this.editForm = {
			name: '',
			description: '',
			price: 0,
			imgUrl: '',
			quantity: 0,
			saleAmount: 0,
			categoryName: '',
			typeName: ''
		};
	}

	onPageChanged(event: any) { // 1: 0 1 2 3   2: 4 5 6 7   3: 8 9 10 11
		this.products = this.data.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage);
	}

	openCreateModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	openEditModal(template: TemplateRef<any>, currentId: number) {
		this.modalRef = this.modalService.show(template);
		this.currentId = currentId;
		this.editForm = this.products.find(x => x.id === this.currentId);
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
