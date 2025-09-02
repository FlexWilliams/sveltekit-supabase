// Returns string[] of [""key=value", "key2=value2", ...]
export function parseSearchParams(): string[] {
	return window.location.search
		.replace('?', '&')
		.split('&')
		.filter((s) => s);
}

export function extractSearchParamValue(param: string): string | null {
	const params = parseSearchParams();

	const pair = params.find((p) => p.indexOf(`${param}=`) === 0);
	if (!pair) {
		return null;
	}

	const tokens = pair.split('=');
	if (tokens.length == 2) {
		return tokens[1];
	}

	return null;
}
