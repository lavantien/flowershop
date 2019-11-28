import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	private defaultLang = new BehaviorSubject<string>('en');

	constructor() {
	}

	public getDefaultLang() {
		return this.defaultLang.asObservable();
	}

	public updateDefaultLang(lang: string) {
		this.defaultLang.next(lang);
	}
}
