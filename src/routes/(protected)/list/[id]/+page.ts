import type { PageLoad } from './$types';

import { list } from '$stores/list';


export const load : PageLoad = ({ params }) => {
	list.id.set(params.id ?? '');

  return {};
};
