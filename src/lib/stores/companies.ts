import type { Writable, Readable } from 'svelte/store';

import type { Company } from '$types/company';

import { writable, derived } from 'svelte/store';

import { firestore } from '$services/firestore';


class CompaniesStore {
	public recent : Writable<Company[]>;
	public all    : Writable<Company[]>;


	constructor() {
		this.recent = this.initRecent();
		this.all    = this.initAll();
	}


	private initRecent() : Writable<Company[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getCompaniesReactive(
					(companies : Company[]) => set(companies),
					5,
				);

				return () => unsubscribe();
			},
		);
	}

	private initAll() : Writable<Company[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getCompaniesReactive(
					(companies : Company[]) => set(companies),
				);

				return () => unsubscribe();
			},
		);
	}
}

export const companies = new CompaniesStore();
