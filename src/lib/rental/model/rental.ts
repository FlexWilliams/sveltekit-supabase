import type { Stuff, StuffFromDb } from '$lib/stuff/model/stuff';

export enum RentalStatus {
	Reserved = 1,
	Cancelled = 2,
	Rejected = 3,
	Approved = 4,
	Rented = 5,
	Returned = 6
}

export interface MyRental {
	id?: number;
	createdOn?: string;
	renterId: string;
	renterName?: string;
	renteeId: string;
	renteeName?: string;
	itemId: number;
	itemName?: string;
	pickupDate?: string;
	returnDate?: string;
	pickupMethod?: string;
	returnMethod?: string;
	status: RentalStatus;
	imageUrl?: string;
}

export interface MyRentalFromDb {
	id?: number;
	created_on?: string;
	renter_id: string;
	renter_name?: string;
	rentee_id: string;
	rentee_name?: string;
	item_id: number;
	item_name?: string;
	pickup_date?: string;
	return_date?: string;
	pickup_method?: string;
	return_method?: string;
	status: RentalStatus;
	user_stuff?: Partial<StuffFromDb>;
}

export function rentalFromDb(m: MyRentalFromDb): MyRental {
	return {
		id: m.id,
		createdOn: m.created_on,
		renterId: m.renter_id,
		renterName: m.renter_name,
		renteeId: m.rentee_id,
		renteeName: m.rentee_name,
		itemId: m.item_id,
		itemName: m.item_name,
		pickupDate: m.pickup_date,
		returnDate: m.return_date,
		pickupMethod: m.pickup_method,
		returnMethod: m.return_method,
		status: m.status,
		imageUrl: m?.user_stuff?.image_url
	};
}

export function rentalFromDbList(list: MyRentalFromDb[]): MyRental[] {
	return list.map(rentalFromDb);
}

export function rentalToDb(m: MyRental): MyRentalFromDb {
	return {
		id: m.id,
		created_on: m.createdOn,
		renter_id: m.renterId,
		renter_name: m.renterName,
		rentee_id: m.renteeId,
		rentee_name: m.renteeName,
		item_id: m.itemId,
		item_name: m.itemName,
		pickup_date: m.pickupDate,
		return_date: m.returnDate,
		pickup_method: m.pickupMethod,
		return_method: m.returnMethod,
		status: m.status
	};
}

export function rentalToDbList(list: MyRental[]): MyRentalFromDb[] {
	return list.map(rentalToDb);
}

export function createMyRentalForReservation(stuff: Stuff, userId: string): MyRental {
	const myRental: MyRental = {
		renterId: stuff.userId,
		renterName: stuff?.userMeta?.userName || 'Unknown Renter', // TODO: remove and get via join on select
		renteeId: userId,
		renteeName: 'Unknown Rentee', // TODO: remove and get via join on select
		itemId: parseInt(stuff.id),
		itemName: stuff.name, // TODO: remove and get via join on select
		status: RentalStatus.Reserved
	};

	return myRental;
}
