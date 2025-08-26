export interface MyStuffState {
	myStuffImages: Map<string, string>;
}

const initialMyStuffState: MyStuffState = {
	myStuffImages: new Map<string, string>()
};

export const myStuffState = $state(initialMyStuffState);

/** Reducers */

/**
 * Sets an image for a stuff object
 */
export function myStuffState$$setStuffImage(defaultImage: string, stuffImageUrl: string): void {
	myStuffState.myStuffImages.set(defaultImage, stuffImageUrl); // TODO: review, currently the supabase image lasts for 30min?
}
