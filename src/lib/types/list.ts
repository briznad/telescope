import type { StringListMap } from 'briznads-helpers';

import type { ListOrRecipe } from '$types/list-or-recipe';
import type { Department } from '$types/department';


export interface List extends ListOrRecipe {
	customOrderMap?   : CustomOrderMap;
	groupBy?          : GroupBy;
	recipeOrGroupMap? : RecipeOrGroupMap;
}

type GroupBy =
	| 'department'
	| 'recipeOrGroup'
	;

type CustomOrderMap = {
	ungrouped     : string[];
	recipeOrGroup : StringListMap;
	department    : {
		[ key in Department ]? : string[];
	};
}

type RecipeOrGroupMap = {
	[ key : string ] : RecipeOrGroup;
}

type RecipeOrGroup = {
	title : string;
	scale : number;
}
