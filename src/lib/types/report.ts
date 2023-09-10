import type { CompanyOrReport } from '$types/company-or-report';


export interface Report extends CompanyOrReport {
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
