import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataTranslateService {
	constructor() {
	}

	getPrice(price: number, lang: string): number {
		const ratio = 23000.0;
		if (lang === 'vi') {
			return price * ratio;
		}
		return price / ratio;
	}

	getLocale(lang: string): string {
		if (lang === 'vi') {
			return 'vi-VN';
		}
		return 'en-US';
	}
}
