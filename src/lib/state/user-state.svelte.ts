export interface UserState {
	id: string | null;
}

const initialUserState: UserState = {
	id: null
};

export const userState = $state(initialUserState);

/** Reducers */

/**
 * Sets the id
 */
export function userState$$setId(id: string | null): void {
	userState.id = id;
}
