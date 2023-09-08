import type { Writable } from 'svelte/store';

import type { Recipe } from '$types/recipe';

import { writable } from 'svelte/store';

import { firestore } from '$services/firestore';


class Recipes {
	public recent : Writable<Recipe[]>;
	public all    : Writable<Recipe[]>;


	constructor() {
		this.recent = this.initRecent();
		this.all    = this.initAll();
	}


	private initRecent() : Writable<Recipe[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getRecipesReactive(
					(recipes : Recipe[]) => set(recipes),
					5,
				);

				return () => unsubscribe();
			},
		);
	}

	private initAll() : Writable<Recipe[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getRecipesReactive(
					(recipes : Recipe[]) => set(recipes),
				);

				return () => unsubscribe();
			},
		);
	}
}

export const recipes = new Recipes();
