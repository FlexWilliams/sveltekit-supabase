export interface MyRentalsState {
	rentalPhotos: Map<number, string>;
}

const initialMyRentalsState: MyRentalsState = {
	rentalPhotos: new Map()
};

export const myRentalsState = $state(initialMyRentalsState);

/** Reducers */

/**
 * Sets a photo
 */
export function userState$$setPhoto(id: number, url: string): void {
	myRentalsState.rentalPhotos.set(id, url);
}
