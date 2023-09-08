import type { Writable, Readable } from 'svelte/store';

import type { List } from '$types/list';

import { writable, derived } from 'svelte/store';

import { firestore } from '$services/firestore';


class ListsStore {
	public recent : Writable<List[]>;
	public all    : Writable<List[]>;


	constructor() {
		this.recent = this.initRecent();
		this.all    = this.initAll();
	}


	private initRecent() : Writable<List[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getListsReactive(
					(lists : List[]) => set(lists),
					5,
				);

				return () => unsubscribe();
			},
		);
	}

	private initAll() : Writable<List[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getListsReactive(
					(lists : List[]) => set(lists),
				);

				return () => unsubscribe();
			},
		);
	}
}

export const lists = new ListsStore();
