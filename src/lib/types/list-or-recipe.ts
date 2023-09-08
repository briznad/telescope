import type { DBItem } from '$types/db-item';
import type { SortBy } from '$types/sort-by';
import type { ItemMap } from '$types/item';


export interface ListOrRecipe extends DBItem {
	description? : string;
	editors?     : string[];
	itemMap?     : ItemMap;
	sortBy?      : SortBy;
	title        : string;
	viewers?     : string[];
}
