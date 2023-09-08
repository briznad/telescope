import type { DBItem } from '$types/db-item';


export interface Report extends DBItem {
	revenue?                 : DollarTerm;
	cashBurn?                : DollarTerm;
	grossProfit?             : DollarTerm;
	grossProfitPercent?      : number;
	EBIDTA?                  : DollarTerm;
	cashOnHand?              : number;
	customerAcquisitionCost? : number;
	lifetimeValue?           : number;
	averageRevenuePerUser?   : number;
	customerCount?           : number;
	nextFundraise?           : string;
}

type DollarTerm = {
	value           : number;
	term            : Term;
	annualizedValue : number;
}

type Term =
	| 'annually'
	| 'quarterly'
	| 'monthly'
	| 'weekly'
	| 'daily'
	;
