import type { PageLoad } from './$types';

import { report } from '$stores/report';


export const load : PageLoad = ({ params }) => {
	report.id.set(params.id ?? '');

  return {};
};
