import type { Writable, Readable } from 'svelte/store';

import type { Company } from '$types/company';

import { writable, derived } from 'svelte/store';

import { firestore } from '$services/firestore';


class CompanyStore {
	public id     : Writable<string>;

	public currentCompany : Readable<null | Company>;


	constructor() {
		this.id          = writable('');
		this.currentCompany = this.initCurrentCompany();
	}


	private initCurrentCompany() : Readable<null | Company> {
		return derived(
			this.id,
			(
				$id : string,
				set : (value : any) => void,
			) : void => {
				this.setCurrentCompany($id, set);
			},
			null,
		);
	}

	private async setCurrentCompany(id : string, set : (value : any) => void) : Promise<void> {
		const company = await firestore.getCompany(id);

		set(company);
	}
}

export const company = new CompanyStore();
