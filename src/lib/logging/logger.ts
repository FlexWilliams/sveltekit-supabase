export enum LogLevel {
	Debug,
	Info,
	Warn,
	Error,
	Fatal
}

export class Logger {
	// TODO: find out how to update this, via svelte/vite envs?
	private static readonly loglevel: LogLevel.Debug;

	private static canLog(): boolean {
		return true;
	}

	public static debug(message: string, data?: any): void {
		if (!Logger.canLog()) {
			return;
		}

		console.debug(message);

		if (data) {
			console.debug(data);
		}
	}

	public static info(message: string, data?: any): void {
		if (!Logger.canLog()) {
			return;
		}

		console.info(message);

		if (data) {
			console.info(data);
		}
	}

	public static warn(message: string, data?: any): void {
		if (!Logger.canLog()) {
			return;
		}

		console.warn(message);

		if (data) {
			console.warn(data);
		}
	}

	public static error(message: string, data?: any): void {
		if (!Logger.canLog()) {
			return;
		}

		console.error(message);

		if (data) {
			console.error(data);
		}
	}
}
