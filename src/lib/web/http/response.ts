export interface CountResponse {
	count: number;
}

export interface PhotoNamesResponse {
	photoNames: string[];
}

export function prettyJson(data: any): string {
	return JSON.stringify(data, null, 2);
}
