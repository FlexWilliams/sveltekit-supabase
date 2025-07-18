import { Subject } from 'rxjs/internal/Subject';

export interface ToastrConfig {
	message: string;
	duration?: number;
	bgColor?: string;
}

export class ToastrService {
	private static _toastr$ = new Subject<ToastrConfig>();

	public static toastr$ = this._toastr$.asObservable();

	public static alert(message: string): void {
		this._toastr$.next({
			message
		});
	}
}
