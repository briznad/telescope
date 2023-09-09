import type { PageLoad } from './$types';

import { firestore } from '$services/firestore';


type CompanyPayload = {
	companyId?   : string;
	companyName? : string;
};


export const load : PageLoad = async ({ url }) => {
	const id = url.searchParams.get('cid');

	let companyPayload : CompanyPayload = {};

	if (id) {
		companyPayload = await getCompanyPayload(id);
	}

  return {
		...companyPayload,
	};
};

async function getCompanyPayload(id : string) : Promise<CompanyPayload> {
	const company = await firestore.getCompany(id);

	return company?.id
		? {
			companyId   : company.id,
			companyName : company.name,
		}
		: {};
}
