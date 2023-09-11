import type { Readable } from 'svelte/store';

import type { User } from '$types/user';
import type { Company } from '$types/company';
import type { Report } from '$types/report';

import { derived } from 'svelte/store';

import { get, roundToDecimals } from 'briznads-helpers';

import { user, users } from '$stores/user';
import { companies } from '$stores/companies';
import { reports } from '$stores/reports';


type CompletenessData = {
	[ key in 'company' | 'founder quality' | 'report' ]? : UserVsTotalComparison;
};

type UserVsTotalComparison = {
	userDecimal          : number;
	userPercentage       : number;
	totalPercentage      : number;
	absoluteDifference   : number;
	comparativeAdjective : 'more' | 'less' | 'equal';
};


class Aggregate {
	public completeness : Readable<CompletenessData>;


	constructor() {
		this.completeness = this.initCompleteness();
	}


	private initCompleteness() : Readable<CompletenessData> {
		return derived(
			[
				user,
				companies.all,
				reports.all,
			],
			(
				[
					$user,
					$companies,
					$reports,
				],
			) : CompletenessData => this.parseData($user, $companies, $reports),
			{},
		);
	}

	private parseData(currentUser : User | undefined, companies : Company[], reports : Report[]) : CompletenessData {
		if (!currentUser?.id) {
			return {};
		}

		return {
			company : this.parseUserVsTotal(
				this.parseAverageCompletenessScore(companies, currentUser.id),
				this.parseAverageCompletenessScore(companies),
			),
			'founder quality' : this.parseUserVsTotal(
				this.parseAverageCompletenessScore(companies, currentUser.id, 'founderQuality.optionalCompletenessScore'),
				this.parseAverageCompletenessScore(companies, undefined, 'founderQuality.optionalCompletenessScore'),
			),
			report : this.parseUserVsTotal(
				this.parseAverageCompletenessScore(reports, currentUser.id),
				this.parseAverageCompletenessScore(reports),
			),
		};
	}

	private parseAverageCompletenessScore(items : Company[] | Report[], userId? : string, path? : string) : number {
		const pathArr : string[] = (path ?? 'optionalCompletenessScore').split('.');

		return (items as any[])
			.filter((item : Company | Report) => (userId ? item.createdBy === userId : true) && get(item, pathArr) != undefined)
			.map((item : Company | Report) => get(item, pathArr))
			.reduce((sum : number, item : number, index : number, array : number[]) => {
				sum += item;

				if (index === array.length - 1) {
					return sum / array.length;
				}

				return sum;
			}, 0);
	}

	private parseUserVsTotal(user : number, total : number) : UserVsTotalComparison {
		const userPercentage  = roundToDecimals(user * 100, 1);
		const totalPercentage = roundToDecimals(total * 100, 1);
		const absoluteDifference = roundToDecimals(Math.abs(userPercentage - totalPercentage), 1);
		const comparativeAdjective = userPercentage === totalPercentage
			? 'equal'
			: userPercentage > totalPercentage
				? 'more'
				: 'less';

		return {
			userPercentage,
			totalPercentage,
			absoluteDifference,
			comparativeAdjective,
			userDecimal : user,
		};
	}
}

export const aggregate = new Aggregate();
