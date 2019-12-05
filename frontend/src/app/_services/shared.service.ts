import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	private globalBackgroundPrimary = new BehaviorSubject<[string, string]>(['bg-light', 'text-dark']);

	constructor() {
	}

	public getGlobalBackgroundPrimary() {
		return this.globalBackgroundPrimary.asObservable();
	}

	public updateGlobalBackgroundPrimary(bg: [string, string]) {
		this.globalBackgroundPrimary.next(bg);
	}
}
