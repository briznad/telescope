<script
	lang="ts"
	context="module"
>
	import type { Company, Industry, BusinessModel, FounderQuality, FounderQualityType } from '$types/company';

	import { informationCircleOutline, add } from 'ionicons/icons';

	import { objectEntries } from 'briznads-helpers';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';

	import { company } from '$stores/company';

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
</script>


<script lang="ts">
	const {
		id,
		currentCompany,
	} = company;

	let companyInput : Partial<Company> = {};

	function reset(company? : Company | null) : void {
		companyInput = {
			...(company ?? $currentCompany),
		};
	}

	$: reset($currentCompany);

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

		if (companyInput.founderQuality === undefined) {
			companyInput.founderQuality = {};
		}

		companyInput.founderQuality[ name ] = value;

		companyInput.founderQuality.aggregateScore = parseAggregateFounderScore(companyInput.founderQuality);
	}

	let saveClicked : boolean;

	async function save() : Promise<void> {
		saveClicked = true;

		await firestore.updateCompany($id, $user?.id ?? '', companyInput);

		goto('/company/' + $currentCompany?.id);

		saveClicked = false;
	}

	function parseId(key : string) : string {
		return key.replace(/\s/g, '_');
	}

	function parseAggregateFounderScore(founderQuality : FounderQuality) : number {
		return objectEntries(founderQuality)
			.reduce((sum, [ key, value ]) => key === 'aggregateScore' ? sum : sum + value, 0);
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

{#if $currentCompany }
	<ion-header translucent={ true }>
		<ion-toolbar>
			<ion-buttons
				slot="start"
				collapse={ true }
			>
				<ion-button
					color="dark"
					size="small"
					href="/company/{ $id }"
				>Cancel</ion-button>
			</ion-buttons>

			<ion-title>{ $currentCompany.name }</ion-title>

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
		</ion-toolbar>
	</ion-header>
{/if}

<ion-content fullscreen={ true }>
	{#if $currentCompany }
		<ion-header collapse="condense">
			<ion-toolbar>
				<ion-title size="large">{ $currentCompany.name }</ion-title>

				<ion-buttons
					slot="end"
					collapse={ true }
				>
					<ion-button
						color="dark"
						size="small"
						href="/company/{ $id }"
					>Cancel</ion-button>

					<ion-button
						strong={ true }
						disabled={ saveClicked || !companyInput.name }
						on:click={ save }
						on:keydown={ (e) => HEK(e, save) }
					>Save</ion-button>
				</ion-buttons>
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

			{#if companyInput.otherIndustry || companyInput.industry?.includes('other') }
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

			{#if companyInput.otherBusinessModel || companyInput.businessModel?.includes('other') }
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

			{#each objectEntries(founderQualityOptionsMap) as [ key, tooltip ] }
				{ @const id = parseId(key) }
				{ @const value = companyInput.founderQuality?.[ key ] ?? 0 }

				<ion-item class="range-item">
					<ion-label>
						<div class="range-header">
							<ChunkyLabel>{ key }: { value }</ChunkyLabel>

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
								<div class="ion-padding">{ tooltip }</div>
							</ion-popover>
						</div>

						<ion-range
							name={ key }
							aria-label={ key }
							min={ -2 }
							max={ 2 }
							{ value }
							ticks={ false }
							snaps={ true }
							on:ionInput={ handleRangeInput }
						></ion-range>
					</ion-label>
				</ion-item>
			{/each}
		</ion-item-group>
	{:else}
		<ion-item>
			<h2>Uh oh! Company can't be loaded right now.</h2>
		</ion-item>
	{/if}
</ion-content>
