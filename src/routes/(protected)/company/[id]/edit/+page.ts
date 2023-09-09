import type { PageLoad } from './$types';

import { company } from '$stores/company';


export const load : PageLoad = ({ params }) => {
	company.id.set(params.id ?? '');

  return {};
};
