import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {faFileDownload, faFileUpload, faPen, faPlusSquare, faSearch, faTrash, faSortAmountUp, faSortAmountDownAlt} from '@fortawesome/free-solid-svg-icons';
import {DataTranslateService} from "../_services/data-translate.service";
import {TranslateService} from "@ngx-translate/core";
import {SharedService} from "../_services/shared.service";
import * as XLSX from 'xlsx';
import {Lightbox} from "ngx-lightbox";
import {timeout} from "rxjs/operators";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {Product} from "../_models/product";
import {Category} from "../_models/category";
import {Type} from "../_models/type";

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
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
	faSortAmountUp = faSortAmountUp;
	faSortAmountDownAlt = faSortAmountDownAlt;
	bgPrimary = '';
	tcPrimary = '';
	excelData: any[] = [];
	timeOutHttpRequest = 2000;
	private subscriptions = new Subscription();
	numOfSortableCol = 5; // name, price, quantity, saleAmount, id
	sortFlip: boolean[] = [];
	firstTimeSort = true;
	isSelected: boolean[] = [];

	constructor(private http: HttpClient,
	            private modalService: BsModalService,
	            private dataTranslateService: DataTranslateService,
	            private sharedService: SharedService,
	            private lightbox: Lightbox,
	            private spinner: NgxSpinnerService,
	            public translate: TranslateService) {
		for (let i = 0; i < this.numOfSortableCol; ++i) {
			this.sortFlip[i] = false;
		}
	}

	ngOnInit() {
		this.getProducts();
		this.getCategories();
		this.getTypes();
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
				this.data = data;
				this.productsOriginalDescription.length = 0;
				this.data.forEach(product => {
					product.imgUrl = product.imgUrl ? atob(product.imgUrl) : '';
					this.productsOriginalDescription.push(product.description);
					product.description = product.description.substr(0, 50) + (product.description.length > 60 ? '...' : '');
					product.price = this.dataTranslateService.getPrice(product.price, 'vi');
				});
				this.searchResults = data;
				this.paging(this.searchResults);
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.data = [];
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	paging(data: Product[]) {
		this.pagination.totalItem = data.length;
		this.displayProducts = data.slice((this.pagination.currentPage - 1) * this.pagination.itemPerPage,
			this.pagination.currentPage * this.pagination.itemPerPage);
		this.isSelected.length = 0;
		for (let i = 0; i < this.displayProducts.length; ++i) {
			this.isSelected.push(false);
		}
	}

	onPageChanged(event: any) { // 1: 0 1 2 3   2: 4 5 6 7   3: 8 9 10 11
		this.displayProducts = this.searchResults.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage);
		this.isSelected.length = 0;
		for (let i = 0; i < this.displayProducts.length; ++i) {
			this.isSelected.push(false);
		}
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

	onChangeCategory(mode: string) {
		if (mode === 'search') {
			this.searchForm.name = '';
			this.searchForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.searchForm.categoryName)].name;
		} else if (mode === 'create') {
			this.createForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.createForm.categoryName)].name;
		} else if (mode === 'edit') {
			this.editForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.editForm.categoryName)].name;
		}
		this.firstTimeSort = false;
	}

	onChangeTypeSearch() {
		this.searchForm.name = '';
		this.firstTimeSort = false;
	}

	getCategories() {
		this.spinner.show();
		this.http.get<Category[]>('/api/category').pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
			if (!!data) {
				this.categories = data;
				this.createForm.categoryName = this.categories[0].name;
				this.searchForm.categoryName = this.categories[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.categories = [];
			this.createForm.categoryName = '';
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
				this.createForm.typeName = this.types[0].name;
				this.searchForm.typeName = this.types[0].name;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.types = [];
			this.createForm.typeName = '';
			this.searchForm.typeName = '';
		}, () => {
			// Spinner hide
			this.spinner.hide();
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

	openCreateModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	onCreate() {
		this.spinner.show();
		this.http.post<Product>('/api/product/create', () => {
			this.createForm.imgUrl = btoa(this.createForm.imgUrl);
			this.createForm.price = this.dataTranslateService.getPrice(this.createForm.price, 'en');
			return this.createForm;
		}).pipe(timeout(this.timeOutHttpRequest)).subscribe(() => {
			this.getProducts();
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	openEditModal(template: TemplateRef<any>, currentId: number) {
		this.modalRef = this.modalService.show(template);
		this.currentId = currentId;
		this.editForm = JSON.parse(JSON.stringify(this.data.find(x => x.id === this.currentId)));
		this.editIndex = this.data.findIndex(x => x.id === this.currentId);
		this.editForm.description = this.productsOriginalDescription[this.editIndex];
	}

	onEdit() {
		this.spinner.show();
		this.http.put<Product>(`/api/product/${this.currentId}`, () => {
			this.editForm.imgUrl = btoa(this.editForm.imgUrl);
			this.createForm.price = this.dataTranslateService.getPrice(this.createForm.price, 'en');
			return this.editForm;
		}).pipe(timeout(this.timeOutHttpRequest)).subscribe(() => {
			this.getProducts();
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	onCloseEdit() {
		this.editForm.description = this.data[this.editIndex].description;
	}

	openDeleteModal(template: TemplateRef<any>, currentId: number) {
		this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
		this.currentId = currentId;
	}

	onDelete() {
		this.spinner.show();
		if (this.isSelected.length === 1) {
			this.http.delete<any>(`/api/product/${this.currentId}`).pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
				this.getProducts();
			}, error => {
				console.log(`Error: ${error}`);
			}, () => {
				// Spinner hide
				this.spinner.hide();
			});
		} else {
			let delProdIds: number[] = [];
			for (let i = 0; i < this.isSelected.length; ++i) {
				if (this.isSelected[i]) {
					delProdIds.push(this.displayProducts[i].id);
				}
			}
			this.http.request<any>('delete', `/api/product`, {body: delProdIds}).pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
				this.getProducts();
			}, error => {
				console.log(`Error: ${error}`);
			}, () => {
				// Spinner hide
				this.spinner.hide();
			});
		}
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
		this.spinner.show();
		this.http.post<Product[]>('/api/product', () => {
			this.data.forEach(data => {
				data.price = this.dataTranslateService.getPrice(data.price, 'en');
			});
			return this.data;
		}).pipe(timeout(this.timeOutHttpRequest)).subscribe(data => {
			if (data === excelData) {
				alert('Import Successful!');
				this.getProducts();
			}
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
			// Spinner hide
			this.spinner.hide();
		});
	}

	onExportExcel() {
		/* prepare data */
		const tempDescriptions: string[] = [];
		this.data.forEach((data, index) => {
			tempDescriptions[index] = data.description;
			data.description = this.productsOriginalDescription[index];
			if (this.translate.currentLang !== 'en-US') {
				data.price = this.dataTranslateService.getPrice(data.price, 'en');
			}
		});

		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, `${this.translate.currentLang === 'en-US' ? 'Products' : 'Sản phẩm'}`);

		/* save to file */
		XLSX.writeFile(wb, `${this.translate.currentLang === 'en-US' ? 'data' : 'sản_phẩm'}__${new Date().toLocaleDateString(this.translate.currentLang)}__${new Date().toLocaleTimeString(this.translate.currentLang)}.xlsx`);

		/* restore data state */
		this.data.forEach((data, index) => {
			data.description = tempDescriptions[index];
			if (this.translate.currentLang !== 'en-US') {
				data.price = this.dataTranslateService.getPrice(data.price, 'vi');
			}
		});
	}

	onOpenImage(index: number) {
		let album: {
			src: string;
			caption: string;
			thumb: string;
		}[] = [];
		const src = this.displayProducts[index].imgUrl;
		const thumb = this.displayProducts[index].imgUrl;
		let caption = '<b>' + this.displayProducts[index].name;
		let category = '';
		let type = '';
		let description: string;
		this.translate.get('DATA.' + this.displayProducts[index].categoryName).subscribe(rs => {
			category = rs;
		});
		this.translate.get('DATA.' + this.displayProducts[index].typeName).subscribe(rs => {
			type = rs;
		});
		description = this.productsOriginalDescription[this.productsOriginalDescription.findIndex(x => x.includes(this.displayProducts[index].description.substring(0, this.displayProducts[index].description.length - 3)))];
		caption += '</b> - (' + category + ' - ' + type + ').<br><i>' + description + '</i>';
		album.push({
			src: src,
			caption: caption,
			thumb: thumb
		});
		this.lightbox.open(album, 0);
	}

	onSort(sortWhat: number) {
		// sortWhat <-> name, price, quantity, saleAmount, id
		if (this.sortFlip[sortWhat]) {
			switch (sortWhat) {
				case 0:
					this.data.sort((a, b) => a.name.localeCompare(b.name, this.translate.currentLang));
					break;
				case 1:
					this.data.sort((a, b) => a.price - b.price);
					break;
				case 2:
					this.data.sort((a, b) => a.quantity - b.quantity);
					break;
				case 3:
					this.data.sort((a, b) => a.saleAmount - b.saleAmount);
					break;
				case 4:
					this.data.sort((a, b) => a.id - b.id);
					break;
				default:
					break;
			}
		} else {
			switch (sortWhat) {
				case 0:
					this.data.sort((a, b) => b.name.localeCompare(a.name, this.translate.currentLang));
					break;
				case 1:
					this.data.sort((a, b) => b.price - a.price);
					break;
				case 2:
					this.data.sort((a, b) => b.quantity - a.quantity);
					break;
				case 3:
					this.data.sort((a, b) => b.saleAmount - a.saleAmount);
					break;
				case 4:
					this.data.sort((a, b) => b.id - a.id);
					break;
				default:
					break;
			}
		}
		const prevName = this.searchForm.name;
		this.searchForm.name = this.firstTimeSort && this.searchForm.name === '' ? ' ' : this.searchForm.name;
		this.onSearch();
		this.searchForm.name = prevName;
		this.sortFlip[sortWhat] = !this.sortFlip[sortWhat];
	}

	selectRow(index: number) {
		this.isSelected[index] = !this.isSelected[index];
	}

	trackByFn(index, item) {
		return index;
	}
}
