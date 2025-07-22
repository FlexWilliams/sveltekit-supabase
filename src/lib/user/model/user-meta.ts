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

export function fromDbList(list: UserMetaFromDb[]): UserMeta[] {
	return list.map((l) => ({
		id: l.id,
		createdOn: l.created_on,
		userName: l.user_name,
		profilePicUrl: l.profile_pic_url
	}));
}
