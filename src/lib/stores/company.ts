import type { Writable, Readable, Unsubscriber } from 'svelte/store';

import type { Company } from '$types/company';

import { writable, derived } from 'svelte/store';

import { firestore } from '$services/firestore';


class CompanyStore {
	public id : Writable<string>;

	public current : Readable<null | Company>;


	constructor() {
		this.id      = writable('');
		this.current = this.initCurrent();
	}


	private initCurrent() : Readable<null | Company> {
		return derived(
			this.id,
			(
				$id : string,
				set : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getCompanyReactive($id, (company : null | Company) => {
					set(company);
				});

				return () => unsubscribe();
			},
			null,
		);
	}
}

export const company = new CompanyStore();
