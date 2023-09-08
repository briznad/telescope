import type { PageLoad } from './$types';

import { recipe } from '$stores/recipe';


export const load : PageLoad = ({ params }) => {
	recipe.id.set(params.id ?? '');

  return {};
};
