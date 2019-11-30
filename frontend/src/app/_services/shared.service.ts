import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	private globalLanguage = new BehaviorSubject<string>('en');
	private globalBackgroundPrimary = new BehaviorSubject<[string, string]>(['bg-light', 'text-dark']);
	// private globalIsFirefox = new BehaviorSubject<boolean>(typeof InstallTrigger !== 'undefined');

	constructor() {
	}

	public getGlobalLanguage() {
		return this.globalLanguage.asObservable();
	}

	public updateGlobalLanguage(lang: string) {
		this.globalLanguage.next(lang);
	}

	public getGlobalBackgroundPrimary() {
		return this.globalBackgroundPrimary.asObservable();
	}

	public updateGlobalBackgroundPrimary(bg: [string, string]) {
		this.globalBackgroundPrimary.next(bg);
	}
}
