export interface UserMeta {
	id: string;
	createdOn: string;
	userName: string;
	profilePic?: ArrayBuffer;
	profilePicUrl?: string;
	emailConfirmed: boolean;
	resetPassword: boolean;
}

export interface UserMetaFromDb {
	id: string;
	created_on: string;
	user_name: string;
	profile_pic_url?: string;
	email_confirmed: boolean;
	reset_password: boolean;
}

export function userMetaFromDb(userMeta: UserMetaFromDb): UserMeta {
	return {
		id: userMeta.id,
		createdOn: userMeta.created_on,
		userName: userMeta.user_name,
		profilePicUrl: userMeta.profile_pic_url,
		emailConfirmed: userMeta.email_confirmed,
		resetPassword: userMeta.reset_password
	};
}

export function userMetaFromDbList(list: UserMetaFromDb[]): UserMeta[] {
	return list.map(userMetaFromDb);
}
