export interface UserMeta {
	id: string;
	createdOn: string;
	userName: string;
	profilePic?: ArrayBuffer;
	profilePicUrl?: string;
}

export interface UserMetaFromDb {
	id: string;
	created_on: string;
	user_name: string;
	profile_pic_url?: string;
}

export function userMetaFromDb(userMeta: UserMetaFromDb): UserMeta {
	return {
		id: userMeta.id,
		createdOn: userMeta.created_on,
		userName: userMeta.user_name,
		profilePicUrl: userMeta.profile_pic_url
	};
}

export function userMetaFromDbList(list: UserMetaFromDb[]): UserMeta[] {
	return list.map(userMetaFromDb);
}
