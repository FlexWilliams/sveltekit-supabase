export interface Stuff {
	id: string;
	userId: string;
	createdOn: string;
	name: string;
	trustRating: number;
	available: boolean;
	description?: string;
	imageUrl?: string;
}

export interface StuffFromDb {
	id: string;
	user_id: string;
	created_on: string;
	name: string;
	trust_rating: number;
	available: boolean;
	description?: string;
	image_url?: string;
}

export function fromDbList(list: StuffFromDb[]): Stuff[] {
	return list.map((l) => ({
		id: l.id,
		userId: l.user_id,
		createdOn: l.created_on,
		name: l.name,
		trustRating: l.trust_rating,
		available: l.available,
		description: l.description,
		imageUrl: l.image_url
	}));
}
