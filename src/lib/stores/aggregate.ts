import type { Readable } from 'svelte/store';

import type { User } from '$types/user';
import type { Company } from '$types/company';
import type { Report } from '$types/report';

import { derived } from 'svelte/store';

import { users } from '$stores/user';
import { companies } from '$stores/companies';
import { reports } from '$stores/reports';


type AggregateData = any;


class Aggregate {
	public data : Readable<AggregateData>;


	constructor() {
		this.data = this.initData();
	}


	private initData() : Readable<AggregateData> {
		return derived(
			[
				users,
				companies.all,
				reports.all,
			],
			(
				[
					$users,
					$companies,
					$reports,
				],
			) : AggregateData => {
				return this.parseData($users, $companies, $reports);
			},
			{},
		);
	}

	private parseData(users : User[], companies : Company[], reports : Report[]) : AggregateData {


		return {
			users,
			companies,
			reports,
		};
	}
}

export const aggregate = new Aggregate();
