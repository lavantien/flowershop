import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
	tests: Test[] = [];

	constructor(private http: HttpClient) {
	}

	ngOnInit() {
		this.getTests();
	}

	getTests() {
		this.http.get<Test[]>('/api/test').subscribe(rs => {
			this.tests = rs;
		}, error => {
			console.log(`Error: ${error}`);
			this.tests = [];
		});
	}
}

interface Test {
	id: number;
	name: string;
	detail: string;
	updateDate: Date;
}