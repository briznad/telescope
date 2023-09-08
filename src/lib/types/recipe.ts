import type { ListOrRecipe } from '$types/list-or-recipe';


export interface Recipe extends ListOrRecipe {
	customOrder? : string[];
	scale?       : number;
}
