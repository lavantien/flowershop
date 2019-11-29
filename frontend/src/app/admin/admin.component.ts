import {Component, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {
	faPen,
	faPlusSquare,
	faSearch,
	faTrash,
	faFileUpload,
	faFileDownload
} from '@fortawesome/free-solid-svg-icons';
import {DataTranslateService} from "../_services/data-translate.service";
import {TranslateService} from "@ngx-translate/core";
import {SharedService} from "../_services/shared.service";
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
	modalRef: BsModalRef;
	data: Product[] = [];
	displayProducts: Product[] = [];
	productsOriginalDescription: string[] = [];
	categories: Category[] = [];
	types: Type[] = [];
	pagination = {
		totalItem: 0,
		itemPerPage: 20,
		currentPage: 1,
		maxSize: 5
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
	searchResults: Product[] = [];
	currentId = 0;
	editIndex = 0;
	faSearch = faSearch;
	faPlusSquare = faPlusSquare;
	faPen = faPen;
	faTrash = faTrash;
	faFileUpload = faFileUpload;
	faFileDownload = faFileDownload;
	locale = '';
	bgPrimary = '';
	tcPrimary = '';
	excelData: any[] = [];

	constructor(private http: HttpClient,
	            private modalService: BsModalService,
	            private dataTranslateService: DataTranslateService,
	            private sharedService: SharedService,
	            public translate: TranslateService) {
		this.sharedService.getGlobalLanguage().subscribe(lang => {
			this.locale = this.dataTranslateService.getLocale(lang);
		});
		this.sharedService.getGlobalBackgroundPrimary().subscribe(bg => {
			this.bgPrimary = bg[0];
			this.tcPrimary = bg[1];
		});
	}

	ngOnInit() {
		this.getProducts();
		this.getCategories();
		this.getTypes();
		this.translate.onLangChange.subscribe(event => {
			this.locale = this.dataTranslateService.getLocale(event.lang);
			this.data.forEach(product => {
				product.price = this.dataTranslateService.getPrice(product.price, event.lang);
			});
		});
	}

	getProducts() {
		this.http.get<Product[]>('/api/product').subscribe(data => {
			this.data = data;
			this.productsOriginalDescription.length = 0;
			this.data.forEach(product => {
				product.imgUrl = product.imgUrl ? atob(product.imgUrl) : '';
				this.productsOriginalDescription.push(product.description);
				product.description = product.description.substr(0, 60) + (product.description.length > 60 ? '...' : '');
			});
			this.searchResults = data;
			this.paging(this.searchResults);
		});
	}

	getCategories() {
		this.http.get<Category[]>('/api/category').subscribe(data => {
			if (!!data) {
				this.categories = data;
				this.createForm.categoryName = this.categories[0].name;
				this.searchForm.categoryName = this.categories[0].name;
			}
		});
	}

	getTypes() {
		this.http.get<Type[]>('/api/type').subscribe(data => {
			if (!!data) {
				this.types = data;
				this.createForm.typeName = this.types[0].name;
				this.searchForm.typeName = this.types[0].name;
			}
		});
	}

	paging(data: Product[]) {
		this.pagination.totalItem = data.length;
		this.displayProducts = data.slice((this.pagination.currentPage - 1) * this.pagination.itemPerPage,
			this.pagination.currentPage * this.pagination.itemPerPage);
	}

	onSearch() {
		let searchResults: Product[] = [];
		this.data.forEach(product => {
			if (this.searchForm.name === '' && this.searchForm.typeName === product.typeName && this.searchForm.categoryName === product.categoryName) {
				searchResults.push(product);
			} else if (this.searchForm.name !== '' && product.name.toLowerCase().includes(this.searchForm.name.toLowerCase())) {
				searchResults.push(product);
			}
		});
		this.paging(searchResults);
		this.searchResults = searchResults;
	}

	onCreate() {
		this.http.post<Product>('/api/product/create', () => {
			this.createForm.imgUrl = btoa(this.createForm.imgUrl);
			return this.createForm;
		}).subscribe(data => {
			this.getProducts();
		});
	}

	onEdit() {
		this.http.put<Product>(`/api/product/${this.currentId}`, () => {
			this.editForm.imgUrl = btoa(this.editForm.imgUrl);
			return this.editForm;
		}).subscribe(data => {
			this.getProducts();
		});
	}

	onDelete() {
		this.http.delete<any>(`/api/product/${this.currentId}`).subscribe(data => {
			this.getProducts();
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
		this.displayProducts = this.searchResults.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage);
	}

	openCreateModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	openEditModal(template: TemplateRef<any>, currentId: number) {
		this.modalRef = this.modalService.show(template);
		this.currentId = currentId;
		this.editForm = JSON.parse(JSON.stringify(this.data.find(x => x.id === this.currentId)));
		this.editIndex = this.data.findIndex(x => x.id === this.currentId);
		this.editForm.description = this.productsOriginalDescription[this.editIndex];
	}

	onCloseEdit() {
		this.editForm.description = this.data[this.editIndex].description;
	}

	openDeleteModal(template: TemplateRef<any>, currentId: number) {
		this.modalRef = this.modalService.show(template);
		this.currentId = currentId;
	}

	openImportExcelModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	onFileChange(evt: any) {
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>(evt.target);
		if (target.files.length !== 1) {
			throw new Error('Cannot use multiple files');
		}
		if (target.files.item(0).type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			alert('Not Excel!');
			return;
		}
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			/* save data */
			this.excelData = XLSX.utils.sheet_to_json(ws, {header: ['id', 'name', 'description', 'imgUrl', 'price', 'quantity', 'saleAmount', 'typeName', 'categoryName']}).slice(1);
			if (!!this.excelData && typeof this.excelData === typeof this.data) {
				this.onImportExcel(<Product[]>this.excelData);
			} else {
				alert('Wrong Format!');
			}
		};
		reader.readAsBinaryString(target.files[0]);
	}
	
	onImportExcel(excelData: Product[]) {
		this.http.post<Product[]>('/api/product', this.data).subscribe(data => {
			if (data === excelData) {
				alert('Import Successful!');
				this.getProducts();
			}
		});
	}

	onExportExcel() {
		/* prepare data */
		const tempDescriptions: string[] = [];
		this.data.forEach((data, index) => {
			tempDescriptions[index] = data.description;
			data.description = this.productsOriginalDescription[index];
			if (this.locale !== 'en-US') {
				data.price = this.dataTranslateService.getPrice(data.price, 'en');
			}
		});

		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, `${this.locale === 'en-US' ? 'Products' : 'Sản phẩm'}`);

		/* save to file */
		XLSX.writeFile(wb, `${this.locale === 'en-US' ? 'products' : 'sản_phẩm'}__${new Date().toLocaleDateString(this.locale)}__${new Date().toLocaleTimeString(this.locale)}.xlsx`);

		/* restore data state */
		this.data.forEach((data, index) => {
			data.description = tempDescriptions[index];
			if (this.locale !== 'en-US') {
				data.price = this.dataTranslateService.getPrice(data.price, 'vi');
			}
		});
	}

	onChangeCategory(mode: string) {
		if (mode === 'search') {
			this.searchForm.name = '';
			this.searchForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.searchForm.categoryName)].name;
		} else if (mode === 'create') {
			this.createForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.createForm.categoryName)].name;
		} else if (mode === 'edit') {
			this.editForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.editForm.categoryName)].name;
		}
	}

	onChangeTypeSearch() {
		this.searchForm.name = '';
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
