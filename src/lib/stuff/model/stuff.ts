export interface NewStuff {
	name: string;
	trustLevel: number;
	available: boolean;
	description?: string;
}

export interface Stuff extends NewStuff {
	id: string;
	userId: string;
	createdOn: string;
	imageUrl?: string;
}

export interface StuffFromDb {
	id: string;
	user_id: string;
	created_on: string;
	name: string;
	trust_level: number;
	available: boolean;
	description?: string;
	image_url?: string;
}

export function stuffFromDb(s: StuffFromDb): Stuff {
	return {
		id: s.id,
		userId: s.user_id,
		createdOn: s.created_on,
		name: s.name,
		trustLevel: s.trust_level,
		available: s.available,
		description: s.description,
		imageUrl: s.image_url
	};
}

export function stuffFromDbList(list: StuffFromDb[]): Stuff[] {
	return list.map(stuffFromDb);
}

export function stuffToDb(s: Stuff): StuffFromDb {
	return {
		id: s.id,
		user_id: s.userId,
		created_on: s.createdOn,
		name: s.name,
		trust_level: s.trustLevel,
		available: s.available,
		description: s.description,
		image_url: s.imageUrl
	};
}

export function stuffToDbList(list: Stuff[]): StuffFromDb[] {
	return list.map(stuffToDb);
}
