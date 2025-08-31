export interface MyRentalsState {
	rentalPhotos: Map<string, string>;
}

const initialMyRentalsState: MyRentalsState = {
	rentalPhotos: new Map()
};

export const myRentalsState = $state(initialMyRentalsState);

/** Reducers */

/**
 * Sets a photo
 */
export function userState$$setPhoto(id: string, url: string): void {
	myRentalsState.rentalPhotos.set(id, url);
}
