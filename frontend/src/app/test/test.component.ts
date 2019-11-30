import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {timeout} from "rxjs/operators";

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
	tests: Test[] = [];
	timeOutHttpRequest = 2000;

	constructor(private http: HttpClient) {
	}

	ngOnInit() {
		this.getTests();
	}

	getTests() {
		this.http.get<Test[]>('/api/test').pipe(timeout(this.timeOutHttpRequest)).subscribe(rs => {
			if (!!rs) {
				this.tests = rs;
			}
		}, error => {
			console.log(`Error: ${error}`);
			this.tests = [];
		}, () => {
			//Spinner hide
		});
	}
}

interface Test {
	id: number;
	name: string;
	detail: string;
	updateDate: Date;
}