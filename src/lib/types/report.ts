import type { DBItem } from '$types/db-item';


export interface Report extends DBItem {
	companyId                : string;
	companyName              : string;
	revenue?                 : DollarTerm;
	cashBurn?                : DollarTerm;
	grossProfit?             : DollarTerm;
	grossProfitPercentage?   : number;
	EBIDTA?                  : DollarTerm;
	cashOnHand?              : number;
	customerAcquisitionCost? : number;
	lifetimeValue?           : number;
	averageRevenuePerUser?   : number;
	customerCount?           : number;
	nextFundraise?           : string;
}

export type DollarTerm = {
	value           : number;
	term            : Term;
	annualizedValue : number;
}

export type Term =
	| 'annually'
	| 'quarterly'
	| 'monthly'
	| 'weekly'
	| 'daily'
	;
