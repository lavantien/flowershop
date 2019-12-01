import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataTranslateService {
	constructor() {
	}

	getPrice(price: number, lang: string): number {
		const ratio = 23000.0;
		const offset = 9770;
		if (lang === 'vi') {
			return price * ratio - offset;
		}
		return (price + offset) / ratio;
	}

	getLocale(lang: string): string {
		if (lang === 'vi') {
			return 'vi-VN';
		}
		return 'en-US';
	}
}
