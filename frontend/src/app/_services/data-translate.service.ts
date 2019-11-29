import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataTranslateService {
	constructor() {
	}

	getPrice(price: number, lang: string): number {
		if (lang === 'vi') {
			return price * 23000 - 9770;
		}
		return price / 23000 + 9770;
	}

	getLocale(lang: string): string {
		if (lang === 'vi') {
			return 'vi-VN';
		}
		return 'en-US';
	}
}
