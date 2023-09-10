import type { RequestHandler } from './$types';

import { json } from '@sveltejs/kit';

import { firestore } from '$services/firestore';


export const GET : RequestHandler = async ({ params }) => {
	const item = await firestore.getCompany(params.id);

	return json(item);
};
