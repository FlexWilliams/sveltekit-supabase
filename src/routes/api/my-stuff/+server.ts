import { Logger } from '$lib/logging/logger';
import {
	stuffFromDbList,
	stuffToDb,
	type NewStuff,
	type Stuff,
	type StuffFromDb
} from '$lib/stuff/components/model/stuff';
import { forbidden, requiredFieldsMissing, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff API';

export const POST: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [POST]: Unable to add to My Stuff, user null.`);
	}

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const photo = formData.get('photo') as File;
	const trustRating = parseInt(formData.get('trust_rating') as string);
	const description = formData.get('description') as string;
	const available = formData.get('available') as string;

	// if (!name || !photo || !trustRating) {
	if (!name || !trustRating) {
		return requiredFieldsMissing(`${API_NAME} [POST]: Unable to add to My Stuff`);
	}

	const newStuff: NewStuff = {
		name,
		trustRating,
		available: available == 'true' ? true : false,
		description
	};

	Logger.debug(JSON.stringify(newStuff));
	Logger.debug(JSON.stringify(stuffToDb(newStuff as Stuff)));

	const { data } = await supabase
		.from('user_stuff')
		.insert(stuffToDb(newStuff as Stuff))
		.select();

	if (!data || data?.length === 0) {
		return unknown(
			`${API_NAME} [POST]: Error occurred at the DB level`,
			'Error occurred at the DB level'
		);
	}

	const newStuffFromDb = stuffFromDbList(data as StuffFromDb[])[0];

	Logger.debug(JSON.stringify(newStuffFromDb));

	// 	const fileName = `profile_pic.img`; // Using .img as extension to allow upserting diff file types to same file name

	// const { data, error } = await supabase.storage
	// 	.from(`user-meta`)
	// 	.upload(`${user?.id}/${fileName}`, profilePic, { upsert: true });

	Logger.debug(`${API_NAME} [POST]: Successfully added New Stuff to the user's inventory!`);

	return new Response(JSON.stringify(newStuffFromDb), {
		status: 201
	});
};
