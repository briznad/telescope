import type { RequestHandler } from './$types';

import { json } from '@sveltejs/kit';

import { firestore } from '$services/firestore';


export const GET : RequestHandler = async () => {
	const items = await firestore.getCompanies();

	return json(items);
};
