import type { Writable, Readable, Unsubscriber } from 'svelte/store';

import type { Company } from '$types/company';

import { writable, derived } from 'svelte/store';

import { Query } from 'briznads-helpers';

import { firestore } from '$services/firestore';


class Companies {
	public query  : Writable<string>;
	public recent : Writable<Company[]>;

	public all : Readable<Company[]>;


	constructor() {
		this.query  = writable('');
		this.recent = this.initRecent();
		this.all    = this.initAll();
	}


	private initRecent() : Writable<Company[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getCompaniesReactive(
					(companies : Company[]) => set(companies),
					4,
				);

				return () => unsubscribe();
			},
		);
	}

	private initAll() : Readable<Company[]> {
		return derived(
			this.query,
			(
				$query : string,
				set    : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getCompaniesReactive(
					(companies : Company[]) => set(Query.matchObject(companies, $query, 'name')),
				);

				return () => unsubscribe();
			},
			[],
		);
	}
}

export const companies = new Companies();
