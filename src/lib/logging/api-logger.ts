import { prettyJson } from '$lib/web/http/response';
import { Logger } from './logger';

export class ApiLogger {
	private apiName: string = '[No Api Name]';

	public currentRequestType: string = 'GET';

	constructor(apiName: string) {
		this.apiName = apiName;
	}

	public setRequestType(type: string): void {
		this.currentRequestType = type;
	}

	public debug(message: string, data?: any): void {
		Logger.debug(`${this.apiName} ${this.currentRequestType}: ${message}`);

		if (data) {
			Logger.debug(prettyJson(data));
		}
	}

	public info(message: string, data?: any): void {
		Logger.info(`${this.apiName} ${this.currentRequestType}: ${message}`);

		if (data) {
			Logger.info(prettyJson(data));
		}
	}

	public warn(message: string, data?: any): void {
		Logger.warn(`${this.apiName} ${this.currentRequestType}: ${message}`);

		if (data) {
			Logger.warn(prettyJson(data));
		}
	}

	public error(message: string, data?: any): void {
		Logger.error(`${this.apiName} ${this.currentRequestType}: ${message}`);

		if (data) {
			Logger.error(prettyJson(data));
		}
	}
}
