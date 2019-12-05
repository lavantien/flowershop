import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
	tests: Test[] = [];
	timeOutHttpRequest = 2000;

	constructor(private http: HttpClient,
	            private spinner: NgxSpinnerService) {
	}

	ngOnInit() {
		this.getTests();
	}

	getTests() {
		this.spinner.show();
		this.http.get<Test[]>('/api/test').subscribe(rs => {
			if (!!rs) {
				this.tests = rs;
			}
		});
	}
}

interface Test {
	id: number;
	name: string;
	detail: string;
	updateDate: Date;
}
