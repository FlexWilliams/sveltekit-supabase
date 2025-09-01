export interface Chat {
	id: number;
	createdOn: string;
	message: string;
	senderId: string;
	receiverId: string;
	stuffId: number;
	sent: boolean;
}

export interface ChatFromDb {
	id: number;
	created_on: string;
	message: string;
	sender_id: string;
	receiver_id: string;
	stuff_id: number;
}

export interface ChatGroup {
	stuffId: number;
	renteeId: string;
	createdOn: string;
}

export interface ChatGroupFromDb {
	stuff_id: number;
	rentee_id: string;
	created_on: string;
}

export function chatGroupFromDb(c: ChatGroupFromDb): ChatGroup {
	return {
		stuffId: c.stuff_id,
		renteeId: c.rentee_id,
		createdOn: c.created_on
	};
}

export function chatGroupFromDbList(list: ChatGroupFromDb[]): ChatGroup[] {
	return list.map(chatGroupFromDb);
}

export function chatFromDb(c: ChatFromDb): Chat {
	return {
		id: c.id,
		createdOn: c.created_on,
		message: c.message,
		senderId: c.sender_id,
		receiverId: c.receiver_id,
		stuffId: c.stuff_id,
		sent: true
	};
}

export function chatToDb(c: Chat): ChatFromDb {
	return {
		id: c.id,
		created_on: c.createdOn,
		message: c.message,
		sender_id: c.senderId,
		receiver_id: c.receiverId,
		stuff_id: c.stuffId
	};
}

export function chatsFromDbList(list: ChatFromDb[]): Chat[] {
	return list.map(chatFromDb);
}

export function createNewChat(
	senderId: string,
	receiverId: string,
	stuffId: number,
	message: string
): Partial<Chat> {
	return {
		senderId,
		receiverId,
		stuffId,
		message
	};
}

export const mockChats: Chat[] = [
	{
		id: 1,
		createdOn: '2025-09-01T00:32:29.769Z',
		senderId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		receiverId: 'bbb',
		stuffId: 50,
		message: 'Hey can I rent this?',
		sent: true
	},
	{
		id: 2,
		createdOn: '2025-09-01T00:33:29.769Z',
		senderId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		receiverId: 'bbb',
		stuffId: 50,
		message: 'I would like to borrow it for the weekend.',
		sent: true
	},
	{
		id: 3,
		createdOn: '2025-09-01T00:35:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Hey, there!',
		sent: true
	},
	{
		id: 4,
		createdOn: '2025-09-01T00:35:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Yes of course, when would be a good time to drop it off?',
		sent: true
	},
	{
		id: 5,
		createdOn: '2025-09-01T00:35:48.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Or would you rather pick it up?',
		sent: true
	},
	{
		id: 6,
		createdOn: '2025-09-01T00:37:29.769Z',
		senderId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		receiverId: 'bbb',
		stuffId: 50,
		message: 'How about tomorrow afternoon?',
		sent: true
	},
	{
		id: 7,
		createdOn: '2025-09-01T00:39:29.769Z',
		senderId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		receiverId: 'bbb',
		stuffId: 50,
		message: 'I can pick it up where ever...',
		sent: true
	},
	{
		id: 8,
		createdOn: '2025-09-01T00:42:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Ok',
		sent: true
	},
	{
		id: 9,
		createdOn: '2025-09-01T00:42:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'that works for me, just text me',
		sent: true
	},
	{
		id: 10,
		createdOn: '2025-09-01T00:44:29.769Z',
		senderId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		receiverId: 'bbb',
		stuffId: 50,
		message: 'Cool, see you soon!',
		sent: true
	},
	{
		id: 11,
		createdOn: '2025-09-01T00:45:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Sounds good',
		sent: true
	},
	{
		id: 12,
		createdOn: '2025-09-01T00:45:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Sounds good',
		sent: true
	},
	{
		id: 13,
		createdOn: '2025-09-01T00:45:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Sounds good',
		sent: true
	},
	{
		id: 14,
		createdOn: '2025-09-01T00:45:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Sounds good',
		sent: true
	},
	{
		id: 15,
		createdOn: '2025-09-01T00:45:29.769Z',
		senderId: 'bbb',
		receiverId: '485c3a40-bead-42a6-8f7c-df9798196abc',
		stuffId: 50,
		message: 'Sounds good',
		sent: true
	}
];
