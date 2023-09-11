import { authentication } from '$services/authnz';


export const ssr = false;

authentication.init();
