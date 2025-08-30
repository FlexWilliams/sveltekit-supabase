import macbook from '$lib/assets/images/inventory-items/2019_macbook_pro_16gb.png';
import bluray from '$lib/assets/images/inventory-items/bluray.png';
import catCamper from '$lib/assets/images/inventory-items/cat_camper.jpg';
import dirtBike from '$lib/assets/images/inventory-items/dirt_bike.jpg';
import mules from '$lib/assets/images/inventory-items/mules.jpeg';
import nintendo from '$lib/assets/images/inventory-items/nintendo_switch.png';
import { userMetaFromDb, type UserMeta, type UserMetaFromDb } from '$lib/user/model/user-meta';

export interface NewStuff {
	name: string;
	userId: string;
	trustLevel: number; // REVIEW: how to only expose this for the user's items.
	available: boolean;
	description?: string;
}

export interface StuffEdit extends NewStuff {
	updatedOn: string;
	imageUrl?: string;
}

export interface Stuff extends StuffEdit {
	id: string;
	createdOn: string;
	imageUrl?: string;
	userMeta?: UserMeta;
	rentalId?: string;
}

export interface StuffFromDb {
	id: string;
	user_id: string;
	created_on: string;
	updated_on: string;
	name: string;
	trust_level: number;
	available: boolean;
	description?: string;
	image_url?: string;
	user_meta?: UserMetaFromDb;
	rental_id?: string;
}

export interface StuffSocial {
	renterName: string;
	renteeName: string;
	itemName: string;
	currentlyRenting: boolean;
	returnDate?: string;
	image?: string;
}

export function stuffFromDb(s: StuffFromDb): Stuff {
	return {
		id: s.id,
		userId: s.user_id,
		createdOn: s.created_on,
		updatedOn: s.updated_on,
		name: s.name,
		trustLevel: s.trust_level,
		available: s.available,
		description: s.description,
		imageUrl: s.image_url,
		userMeta: s.user_meta ? userMetaFromDb(s.user_meta) : undefined,
		rentalId: s.rental_id
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
		updated_on: s.updatedOn,
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

export const mockStuff: Stuff = {
	id: '09385fab-db5d-463d-b80c-410b93239ad7',
	userId: '8ed7176f-8cde-4b82-876c-d6e8ec61e01a',
	createdOn: '2025-08-06T00:21:24.287Z',
	updatedOn: '2025-08-06T00:21:24.287Z',
	name: 'BBQ Grill',
	trustLevel: 5,
	available: true,
	description: 'Great for BBQs and grilling'
};

export const mockSocials: StuffSocial[] = [
	{
		renterName: 'Alex',
		renteeName: 'Ian',
		itemName: 'Blu Ray Burner',
		currentlyRenting: false,
		returnDate: new Date().toISOString(),
		image: bluray
	} as StuffSocial,
	{
		renterName: 'Ian',
		renteeName: 'Alfredo',
		itemName: 'Dirt Bike',
		currentlyRenting: true,
		image: dirtBike
	} as StuffSocial,
	{
		renterName: 'Alfredo',
		renteeName: 'Alex',
		itemName: 'Copper Mugs (Moscow Mule)',
		currentlyRenting: false,
		returnDate: new Date().toISOString(),
		image: mules
	} as StuffSocial,
	{
		renterName: 'Ian',
		renteeName: 'Alex',
		itemName: 'Cat Camper',
		currentlyRenting: true,
		image: catCamper
	} as StuffSocial,
	{
		renterName: 'Alfredo',
		renteeName: 'Ian',
		itemName: '2022 Macbook Pro',
		currentlyRenting: false,
		returnDate: new Date().toISOString(),
		image: macbook
	} as StuffSocial,
	{
		renterName: 'Alex',
		renteeName: 'Alfredo',
		itemName: 'Nintendo Switch',
		currentlyRenting: true,
		image: nintendo
	} as StuffSocial
];
