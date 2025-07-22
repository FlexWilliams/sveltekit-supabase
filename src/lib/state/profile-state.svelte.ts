export interface ProfileState {
	profilePic: Blob | null;
	profilePicLoading: boolean;
}

const initialProfileState: ProfileState = {
	profilePic: null,
	profilePicLoading: true
};

export const profileState = $state(initialProfileState);

/** Reducers */

/**
 * Sets the profilePic
 */
export function profileState$$setProfilePic(profilePic: Blob | null): void {
	profileState.profilePic = profilePic;
}

/**
 * Sets the profilePicLoading
 */
export function profileState$$setProfilePicLoading(profilePicLoading: boolean): void {
	profileState.profilePicLoading = profilePicLoading;
}
