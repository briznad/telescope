import type { Writable, Readable } from 'svelte/store';

import type { List } from '$types/list';

import { writable, derived } from 'svelte/store';

import { firestore } from '$services/firestore';


class ListStore {
	public id     : Writable<string>;

	public currentList : Readable<null | List>;


	constructor() {
		this.id          = writable('');
		this.currentList = this.initCurrentList();
	}


	private initCurrentList() : Readable<null | List> {
		return derived(
			this.id,
			(
				$id : string,
				set : (value : any) => void,
			) : void => {
				this.setCurrentList($id, set);
			},
			null,
		);
	}

	private async setCurrentList(id : string, set : (value : any) => void) : Promise<void> {
		const list = await firestore.getList(id);

		set(list);
	}
}

export const list = new ListStore();
