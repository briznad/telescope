import type { RequestHandler } from './$types';

import { json } from '@sveltejs/kit';

import { firestore } from '$services/firestore';


export const GET : RequestHandler = async ({ params }) => {
	const item = await firestore.getReport(params.id);

	return json(item);
};
