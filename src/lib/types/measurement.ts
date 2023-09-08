export type MeasurementType =
	| 'volume'
	| 'weight'
	| 'length'
	| 'count'
	;

export type Measurement =
	| Volume
	| Weight
	| Length
	| Count
	;

type Volume =
	| 'dash'
	| 'pinch'
	| 'teaspoon'
	| 'tablespoon'
	| 'cup'
	| 'pint'
	| 'quart'
	| 'gallon'
	| 'milliliter'
	| 'liter'
	| 'fluid ounce'
	;

type Weight =
	| 'ounce'
	| 'pound'
	| 'milligram'
	| 'gram'
	| 'kilogram'
	;

type Length =
	| 'millimeter'
	| 'centimeter'
	| 'meter'
	| 'inch'
	| 'yard'
	| 'foot'
	;

type Count =
	| 'part'
	| 'bushel'
	| 'head'
	| 'bunch'
	| 'thing'
	| 'box'
	| 'piece'
	| 'portion'
	| 'bit'
	| 'slice'
	| 'chunk'
	| 'segment'
	| 'section'
	| 'lump'
	| 'hunk'
	| 'wedge'
	| 'slab'
	| 'block'
	| 'cake'
	| 'bar'
	| 'cube'
	| 'stick'
	| 'case'
	| 'flat'
	| 'can'
	;
