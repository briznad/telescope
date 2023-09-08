import type { DBItem } from '$types/db-item';


export interface User extends DBItem {
	provider     : string;
	email        : string;
	displayName? : string;
	imageUrl?    : string;
}
