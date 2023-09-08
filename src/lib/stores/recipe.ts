import type { Writable, Readable, Unsubscriber } from 'svelte/store';

import type { Recipe } from '$types/recipe';
import type { Item, ItemMap } from '$types/item';
import type { SortBy } from '$types/sort-by';

import { writable, derived } from 'svelte/store';

import { smartSort } from 'briznads-helpers';

import { firestore } from '$services/firestore';


type Info = {
	title        : string;
	description? : string;
};

type Sharing = {
	viewers? : string[];
	editors? : string[];
};


class RecipeStore {
	private recipe : Readable<null | Recipe>;

	public id     : Writable<string>;
	public sortBy : Writable<SortBy>;
	public scale  : Writable<number>;

	public info    : Readable<Info>;
	public sharing : Readable<Sharing>;
	public items   : Readable<Item[]>;


	constructor() {
		this.id      = writable('');
		this.sortBy  = writable('added');
		this.scale   = writable(1);
		this.recipe  = this.initRecipe();
		this.info    = this.initInfo();
		this.sharing = this.initSharing();
		this.items   = this.initItems();
	}


	private initRecipe() : Readable<null | Recipe> {
		return derived(
			this.id,
			(
				$id : string,
				set : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getRecipeReactive($id, (recipe : null | Recipe) => {
					this.sortBy.set(recipe?.sortBy ?? 'added');
					this.scale.set(recipe?.scale ?? 1);

					set(recipe);
				});

				return () => unsubscribe();
			},
			null,
		);
	}

	private initInfo() : Readable<Info> {
		return derived(
			this.recipe,
			($recipe : null | Recipe) : Info => ({
				title       : $recipe?.title ?? '',
				description : $recipe?.description,
			}),
			{
				title : '',
			},
		);
	}

	private initSharing() : Readable<Sharing> {
		return derived(
			this.recipe,
			($recipe : null | Recipe) : Sharing => ({
				viewers : $recipe?.viewers,
				editors : $recipe?.editors,
			}),
			{},
		);
	}

	private initItems() : Readable<Item[]> {
		return derived(
			[
				this.recipe,
				this.sortBy,
				this.scale,
			],
			([
				$recipe,
				$sortBy,
				$scale,
			]) : Item[] => this.parseItems($recipe, $sortBy, $scale),
			[],
		);
	}

	private parseItems(recipe : null | Recipe, sortBy : SortBy, scale : number) : Item[] {
		const itemMap : ItemMap = recipe?.itemMap ?? {};

		// sort items
		const items : Item[] = sortBy === 'custom'
			? this.sortByCustomOrder(itemMap, recipe?.customOrder ?? [])
			: smartSort(Object.values(itemMap), undefined, undefined, sortBy === 'alphabetical' ? 'description' : 'createdAt');

		// scale items, if applicable
		if (scale !== 1) {
			for (const item of items) {
				item.displayedQuantity = item.quantity * scale;
			}
		}

		return items;
	}

	private sortByCustomOrder(itemMap : ItemMap, customOrder : string[]) : Item[] {
		const sortedItems : Item[] = [];

		// iterate through the list of custom order ids
		for (const id of customOrder) {
			// attempt to locate the item in the item map
			const item = itemMap[ id ];

			// if it doesn't exist, move on
			if (!item) {
				continue;
			}

			// otherwise, add it to the sorted items list
			sortedItems.push(item);

			// and remove it from the item map
			delete itemMap[ id ];
		}

		// add any remaining items from the item map,
		// which don't exist in the custom order list,
		// to the end of the items list,
		// sorted by when they were added to the list
		const remainingItems = smartSort(Object.values(itemMap), undefined, undefined, 'createdAt');

		sortedItems.push(...remainingItems);

		return sortedItems;
	}
}

export const recipe = new RecipeStore();
