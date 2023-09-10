import type { CompanyOrReport } from '$types/company-or-report';


export interface Company extends CompanyOrReport {
	name                : string;
	industry?           : Industry[];
	otherIndustry?      : string;
	businessModel?      : BusinessModel[];
	otherBusinessModel? : string;
	hqLocation?         : string;
	founderQuality?     : FounderQuality;
	featureSet?         : string[];
}

export type Industry =
	| 'technology'
	| 'healthcare'
	| 'financial services'
	| 'retail and consumer goods'
	| 'manufacturing'
	| 'media and entertainment'
	| 'telecommunications'
	| 'transportation and logistics'
	| 'energy'
	| 'government'
	| 'other'
	;

export type BusinessModel =
	| 'product'
	| 'retail'
	| 'wholesale'
	| 'manufacturer'
	| 'subscription'
	| 'freemium'
	| 'service'
	| 'franchising'
	| 'advertising'
	| 'other'
	;

export interface FounderQuality extends FounderQualityMap {
	aggregateScore?            : number;
	optionalCompletenessScore? : number;
}

type FounderQualityMap = {
	[ key in FounderQualityType ]? : number;
}

export type FounderQualityType =
	| 'track record'
	| 'industry expertise'
	| 'leadership ability'
	| 'technical abilities'
	| 'persistence and grit'
	| 'culture and values'
	| 'skin in the game'
	| 'coachability'
	| 'past exits'
	;
