import type { Writable, Readable, Unsubscriber } from 'svelte/store';

import type { Report } from '$types/report';

import { writable, derived } from 'svelte/store';

import { Query } from 'briznads-helpers';

import { firestore } from '$services/firestore';


class Reports {
	public query  : Writable<string>;
	public recent : Writable<Report[]>;

	public all : Readable<Report[]>;


	constructor() {
		this.query  = writable('');
		this.recent = this.initRecent();
		this.all    = this.initAll();
	}


	private initRecent() : Writable<Report[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getReportsReactive(
					(reports : Report[]) => set(reports),
					4,
				);

				return () => unsubscribe();
			},
		);
	}

	private initAll() : Readable<Report[]> {
		return derived(
			this.query,
			(
				$query : string,
				set    : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getReportsReactive(
					(reports : Report[]) => set(Query.matchObject(reports, $query, 'companyName')),
				);

				return () => unsubscribe();
			},
			[],
		);
	}
}

export const reports = new Reports();
