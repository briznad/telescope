<script
	lang="ts"
	context="module"
>
	import type { BooleanMap } from 'briznads-helpers';

	import type { Company, Industry, BusinessModel, FounderQualityType } from '$types/company';

	import { informationCircleOutline, add } from 'ionicons/icons';

	import { objectEntries, roundToDecimals } from 'briznads-helpers';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';


	const industryOptions : Industry[] = [
		'technology',
		'healthcare',
		'financial services',
		'retail and consumer goods',
		'manufacturing',
		'media and entertainment',
		'telecommunications',
		'transportation and logistics',
		'energy',
		'government',
		'other',
	];

	const businessModelOptions : BusinessModel[] = [
		'product',
		'retail',
		'wholesale',
		'manufacturer',
		'subscription',
		'freemium',
		'service',
		'franchising',
		'advertising',
		'other',
	];

	const founderQualityOptionsMap : { [ key in FounderQualityType ] : string } = {
		'track record'         : 'What previous startups or companies have they founded or worked at? What were their roles and responsibilities? What successes or failures did they drive?',
		'industry expertise'   : 'How much experience do they have in the specific market the startup is tackling? Do they have relevant skills and connections?',
		'leadership ability'   : 'Do they display strategic vision and ability to inspire teams? Are they able to recruit top talent?',
		'technical abilities'  : 'If building a tech-driven company, how strong are their technical skills? Can they architect solutions and make solid technical decisions?',
		'persistence and grit' : 'Do they have a demonstrated ability to push through tough challenges and lead under pressure?',
		'culture and values'   : 'Do they exhibit integrity, transparency, humility and other desired leadership qualities?',
		'skin in the game'     : 'How much of their own "skin" or money are they putting on the line? Are they personally invested and incentivized?',
		'coachability'         : 'Are they open to feedback and self-improvement to evolve as a leader?',
		'past exits'           : 'Have they successfully built and exited companies in the past?',
	};

	const optionalPropertiesMap : BooleanMap = {
		industry           : true,
		otherIndustry      : true,
		businessModel      : true,
		otherBusinessModel : true,
		hqLocation         : true,
		founderQuality     : true,
		featureSet         : true,
	};
</script>


<script lang="ts">
	export let company : Company | undefined = undefined;

	let companyInput : Partial<Company> = {};

	function reset(company? : Company) : void {
		companyInput = {
			...(company),
		};
	}

	$: reset(company);

	function parseCompletenessScore(companyInput : Partial<Company>) : void {
		const optionalFilledCount : number = objectEntries(companyInput)
			.filter(([ key, value ]) => {
				if (!optionalPropertiesMap[ key ]) {
					return false;
				}

				if (typeof value !== 'object') {
					return isValidValue(value);
				}

				return Array.isArray(value)
					? value.length > 0
					: value?.optionalCompletenessScore ?? 0 > 0;
			})
			.length;

		companyInput.optionalCompletenessScore = roundToDecimals(optionalFilledCount / Object.keys(optionalPropertiesMap).length, 5);
	}

	$ : parseCompletenessScore(companyInput);

	function isValidValue(value : any) : boolean {
		return !!value || value === 0;
	}

	function handleTextInput(event : any) {
		const name  : 'name' | 'hqLocation' | 'otherIndustry' | 'otherBusinessModel' = event.target?.name;
		const value : string = event.detail?.value;

		companyInput[ name ] = value;
	}

	function handleListChange(event : any) {
		const name  : 'industry' | 'businessModel' | 'featureSet' = event.target?.name;
		const value : Industry[] | BusinessModel[] | string[] = event.detail?.value;

		if (name === 'industry') {
			companyInput[ name ] = value as Industry[];
		} else if (name === 'businessModel') {
			companyInput[ name ] = value as BusinessModel[];
		} else {
			companyInput[ name ] = value as string[];
		}
	}

	function handleRangeInput(event : any) {
		const name  : FounderQualityType = event.target?.name;
		const value : number = event.detail?.value;

		if (!companyInput.founderQuality) {
			companyInput.founderQuality = {};
		}

		companyInput.founderQuality[ name ] = value;

		parseAggregateAndOptionalFounderScore();
	}

	function parseAggregateAndOptionalFounderScore() : void {
		const optionalFilledList : number[] = objectEntries(companyInput?.founderQuality ?? {})
			.filter(([ key, value ]) => {
				if ([ 'aggregateScore', 'optionalCompletenessScore' ].includes(key)) {
					return false;
				}

				return isValidValue(value);
			})
			.map(([ key, value ]) => value as any);

		if (!optionalFilledList.length) {
			return;
		}

		const aggregateScore = optionalFilledList.reduce((sum, item) => sum + item, 0);
		const optionalCompletenessScore = roundToDecimals(optionalFilledList.length / Object.keys(founderQualityOptionsMap).length, 5);

		companyInput.founderQuality = {
			...companyInput.founderQuality,
			aggregateScore,
			optionalCompletenessScore,
		};
	}

	let saveClicked : boolean;

	async function save() : Promise<void> {
		saveClicked = true;

		if (company?.id) {
			await firestore.updateCompany(company.id, $user?.id ?? '', companyInput);

			goto('/company/' + company.id);
		} else {
			const item = await firestore.createCompany($user?.id ?? '', companyInput);

			if (item?.id) {
				initActionSheet(item.id);
			}
		}

		saveClicked = false;
	}

	function initActionSheet(id : string) : void {
		actionSheetElement.buttons = [
			{
				text    : 'Add Report',
				handler : () => goto('/report/new?cid=' + id),
			},
			{
				text    : 'View Company',
				handler : () => goto('/company/' + id),
			},
			{
				text    : 'Add Another',
				handler : reset,
			},
			{
				text    : 'Go Home',
				role    : 'cancel',
				handler : () => goto('/homepage'),
			},
		];

		actionSheetElement.present();
	}

	function parseId(key : string) : string {
		return key.replace(/\s/g, '_');
	}

	let newItemInputElement : HTMLIonInputElement;

	function handleAddItemChange(event : any) : void {
		const message = event.detail?.value;

		if (!message) {
			return;
		}

		companyInput.featureSet = [ ...(companyInput.featureSet ?? []), message ];

		newItemInputElement.value = undefined;
	}

	function handleFeatureChange(event : any, index : number) : void {
		const message = event.detail?.value;

		if (message) {
			(companyInput.featureSet ?? [])[ index ] = message;
		} else {
			(companyInput.featureSet ?? []).splice(index, 1);
		}

		companyInput.featureSet = companyInput.featureSet;
	}

	let actionSheetElement : HTMLIonActionSheetElement;
</script>


<style lang="scss">
	.fixed-header {
		ion-progress-bar {
			opacity: var(--opacity-scale);
		}
	}

	ion-content {
		--padding-bottom: 60px;
	}

	ion-item-group {
		> ion-item {
			&:last-child {
				--border-style: none;
			}
		}
	}

	.range-item {
		&,
		ion-label {
			overflow: visible;
		}

		ion-label {
			margin: 0;
		}
	}

	.range-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		ion-button {
			position: relative;
			top: 8px;
		}
	}

	ion-popover {
		font-size: 14px;
	}
</style>


<ion-header
	class="fixed-header"
	translucent={ true }
>
  <ion-toolbar>
		{#if company?.id }
			<ion-buttons
				slot="start"
				collapse={ true }
			>
				<ion-button
					color="dark"
					size="small"
					href="/company/{ company.id }"
				>
					Cancel
				</ion-button>
			</ion-buttons>
		{/if}

    <ion-title>{ company?.name ?? 'New Company' }</ion-title>

		<ion-buttons
			slot="end"
			collapse={ true }
		>
      <ion-button
				strong={ true }
				disabled={ saveClicked || !companyInput.name }
				on:click={ save }
				on:keydown={ (e) => HEK(e, save) }
			>Save</ion-button>
    </ion-buttons>

		<ion-progress-bar color="success" value={ companyInput.optionalCompletenessScore ?? 0 }></ion-progress-bar>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen={ true }>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">{ company?.name ?? 'New Company' }</ion-title>

			<ion-buttons
				slot="end"
				collapse={ true }
			>
				{#if company?.id }
					<ion-button
						color="dark"
						size="small"
						href="/company/{ company.id }"
					>
						Cancel
					</ion-button>
				{/if}

        <ion-button
					strong={ true }
					disabled={ saveClicked || !companyInput.name }
					on:click={ save }
					on:keydown={ (e) => HEK(e, save) }
				>Save</ion-button>
      </ion-buttons>

			<ion-progress-bar color="success" value={ companyInput.optionalCompletenessScore ?? 0 }></ion-progress-bar>
    </ion-toolbar>
  </ion-header>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Name/Location</ion-label>
		</ion-item-divider>

		<ion-item>
			<ion-input
				label="Name*"
				name="name"
				label-placement="stacked"
				type="text"
				placeholder="enter text"
				required={ true }
				value={ companyInput.name }
				on:ionInput={ handleTextInput }
			></ion-input>
		</ion-item>

		<ion-item>
			<ion-input
				label="HQ Location"
				name="hqLocation"
				label-placement="stacked"
				type="text"
				placeholder="enter text"
				value={ companyInput.hqLocation }
				on:ionInput={ handleTextInput }
			></ion-input>
		</ion-item>
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Industry</ion-label>
		</ion-item-divider>

		<ion-item>
			<ion-select
				name="industry"
				aria-label="Industry(s)"
				placeholder="select one or more"
				multiple={ true }
				value={ companyInput.industry }
				on:ionChange={ handleListChange }
			>
				{#each industryOptions as option }
					<ion-select-option value={ option }>{ option }</ion-select-option>
				{/each}
			</ion-select>
		</ion-item>

		{#if companyInput.industry?.includes('other') }
			<ion-item>
				<ion-input
					label="Other Industry"
					name="otherIndustry"
					label-placement="stacked"
					type="text"
					placeholder="enter text"
					value={ companyInput.otherIndustry }
					on:ionInput={ handleTextInput }
				></ion-input>
			</ion-item>
		{/if}
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Business Model</ion-label>
		</ion-item-divider>

		<ion-item>
			<ion-select
				name="businessModel"
				aria-label="Business Model(s)"
				placeholder="select one or more"
				multiple={ true }
				value={ companyInput.businessModel }
				on:ionChange={ handleListChange }
			>
				{#each businessModelOptions as option }
					<ion-select-option value={ option }>{ option }</ion-select-option>
				{/each}
			</ion-select>
		</ion-item>

		{#if companyInput.businessModel?.includes('other') }
			<ion-item>
				<ion-input
					label="Other Business Model"
					name="otherBusinessModel"
					label-placement="stacked"
					type="text"
					placeholder="enter text"
					value={ companyInput.otherBusinessModel }
					on:ionInput={ handleTextInput }
				></ion-input>
			</ion-item>
		{/if}
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Feature Set</ion-label>
		</ion-item-divider>

		{#each companyInput.featureSet ?? [] as feature, index }
			<ion-item>
				<ion-input
					aria-label="feature"
					value={ feature }
					on:ionChange={ (event) => handleFeatureChange(event, index) }
				></ion-input>
			</ion-item>
		{/each}

		<ion-item>
			<ion-icon
				slot="start"
				icon={ add }
			></ion-icon>

			<ion-input
				bind:this={ newItemInputElement }
				aria-label="Add feature"
				placeholder="Add feature"
				on:ionChange={ handleAddItemChange }
			></ion-input>
		</ion-item>
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Founder Quality</ion-label>
		</ion-item-divider>

		<ion-item>
			<ChunkyLabel>Aggregate Score: { companyInput.founderQuality?.aggregateScore ?? 0 }</ChunkyLabel>
		</ion-item>

		{#each objectEntries(founderQualityOptionsMap) as [ key, value ] }
			{ @const id = parseId(key) }

			<ion-item class="range-item">
				<ion-label>
					<div class="range-header">
						<ChunkyLabel>{ key }: { companyInput.founderQuality?.[ key ] ?? 0 }</ChunkyLabel>

						<ion-button
							{ id }
							fill="clear"
							size="small"
							color="dark"
						>
							<ion-icon
								slot="icon-only"
								icon={ informationCircleOutline }
							></ion-icon>
						</ion-button>

						<ion-popover trigger={ id }>
							<div class="ion-padding">{ value }</div>
						</ion-popover>
					</div>

					<ion-range
						name={ key }
						aria-label={ key }
						min={ -2 }
						max={ 2 }
						value={ companyInput.founderQuality?.[ key ] ?? 0 }
						ticks={ false }
						snaps={ true }
						on:ionInput={ handleRangeInput }
					></ion-range>
				</ion-label>
			</ion-item>
		{/each}
	</ion-item-group>
</ion-content>

<ion-action-sheet
	bind:this={ actionSheetElement }
	header="Company Saved Successfully"
	sub-header="What Now?"
	backdrop-dismiss={ false }
></ion-action-sheet>
