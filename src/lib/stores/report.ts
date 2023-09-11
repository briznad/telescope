import type { Writable, Readable, Unsubscriber } from 'svelte/store';

import type { Report } from '$types/report';

import { writable, derived } from 'svelte/store';

import { firestore } from '$services/firestore';

import { company } from '$stores/company';


class ReportStore {
	public id : Writable<string>;

	public current       : Readable<undefined | Report>;
	public companyLatest : Readable<undefined | Report>;


	constructor() {
		this.id            = writable('');
		this.current       = this.initCurrent();
		this.companyLatest = this.initCompanyLatest();
	}


	private initCurrent() : Readable<undefined | Report> {
		return derived(
			this.id,
			(
				$id : string,
				set : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getReportReactive($id, (report : undefined | Report) => {
					set(report);
				});

				return () => unsubscribe();
			},
			undefined,
		);
	}

	private initCompanyLatest() : Readable<undefined | Report> {
		return derived(
			company.id,
			(
				$id : string,
				set : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getLatestCompanyReportReactive($id, (report : undefined | Report) => {
					set(report);
				});

				return () => unsubscribe();
			},
			undefined,
		);
	}
}

export const report = new ReportStore();
