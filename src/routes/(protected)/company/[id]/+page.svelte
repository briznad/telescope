<script
	lang="ts"
	context="module"
>
	import { objectEntries, parseDate } from 'briznads-helpers';

	import { company } from '$stores/company';
	import { report } from '$stores/report';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';
	import CreatedOrUpdated from '$components/CreatedOrUpdated.svelte';
	import DollarDisplayItem from '$components/DollarDisplayItem.svelte';


	const reportFieldMap : { [ key : string ] : string } = {
		revenue                 : 'Revenue',
		cashBurn                : 'Cash Burn',
		grossProfit             : 'Gross Profit',
		grossProfitPercentage   : 'Gross Profit Percentage',
		EBIDTA                  : 'EBIDTA',
		cashOnHand              : 'Cash On Hand',
		customerAcquisitionCost : 'Customer Acquisition Cost',
		lifetimeValue           : 'Lifetime Value',
		averageRevenuePerUser   : 'Average Revenue Per User',
		customerCount           : 'Customer Count',
		nextFundraise					  : 'Next Fundraise',
	};
</script>


<script lang="ts">
	const {
		id,
		current,
	} = company;

	const {
		companyLatest,
	} = report;

	function stringifyList(list? : string[], additonalItem? : string) : string {
		const parsedList = list ?? [];

		if (additonalItem) {
			parsedList.push(additonalItem);
		}

		return parsedList.join(', ');
	}
</script>


<style lang="scss">
	ion-content {
		--padding-bottom: 60px;
	}

	.id-container {
		--min-height: auto;
		--padding-bottom: 10px;
	}

	h2 {
		text-wrap: wrap;
		line-height: 1.333;
	}
</style>


{#if $current }
	<ion-header
		class="fixed-header"
		translucent={ true }
	>
		<ion-toolbar>
			<ion-buttons
				slot="start"
				collapse={ true }
			>
				<ion-button
					color="dark"
					href="{ window.location.pathname }/edit"
				>
					Edit
				</ion-button>
			</ion-buttons>

			<ion-title>{ $current.name }</ion-title>

			<ion-buttons
				slot="end"
				collapse={ true }
			>
				<ion-button
					fill="solid"
					href="/report/new?cid={ $id }"
				>
					Add Report
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
{/if}

<ion-content fullscreen={ true }>
	{#if $current }
		<ion-header collapse="condense">
			<ion-toolbar>
				<ion-title size="large">{ $current.name }</ion-title>

				<ion-buttons
					slot="end"
					collapse={ true }
				>
					<ion-button
						size="small"
						color="dark"
						href="{ window.location.pathname }/edit"
					>
						Edit
					</ion-button>

					<ion-button
						fill="solid"
						href="/report/new?cid={ $id }"
					>
						Add Report
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>

		<ion-item
			class="id-container"
			lines="full"
		>
			<ChunkyLabel>{ $id }</ChunkyLabel>
		</ion-item>

		<ion-progress-bar value={ $current.optionalCompletenessScore ?? 0 }></ion-progress-bar>

		<ion-list>
			<ion-item>
				<ion-label>
					<p><CreatedOrUpdated createdAt={ $current.createdAt } updatedAt={ $current.updatedAt } /></p>
				</ion-label>
			</ion-item>

			{#if 'hqLocation' in $current }
				<ion-item>
					<ion-label>
						<p>Location</p>

						<h2>{ $current.hqLocation }</h2>
					</ion-label>
				</ion-item>
			{/if}

			{#if ($current.industry ?? []).length > 0 }
				<ion-item>
					<ion-label>
						<p>Industry</p>

						<h2>{ stringifyList($current.industry, $current.otherIndustry) }</h2>
					</ion-label>
				</ion-item>
			{/if}

			{#if ($current.businessModel ?? []).length > 0 }
				<ion-item>
					<ion-label>
						<p>Business Model</p>

						<h2>{ stringifyList($current.businessModel, $current.otherBusinessModel) }</h2>
					</ion-label>
				</ion-item>
			{/if}

			{#if ($current.featureSet ?? []).length > 0 }
				<ion-item>
					<ion-label>
						<p>Feature Set</p>

						{#each $current.featureSet ?? [] as feature }
							<h2>{ feature }</h2>
						{/each}
					</ion-label>
				</ion-item>
			{/if}

			{#if 'founderQuality' in $current }
				<ion-item>
					<ion-label>
						<p>Founder Quality</p>

						<h2>aggregate score: { $current.founderQuality?.aggregateScore ?? 0 }</h2>

						<h2>completeness: { ($current.founderQuality?.optionalCompletenessScore ?? 0) * 100 }%</h2>

						{#each Object.entries($current.founderQuality ?? {}) as [ key, value ] }
							{#if !['aggregateScore', 'optionalCompletenessScore'].includes(key) }
								<h3>{ key }: { value }</h3>
							{/if}
						{/each}
					</ion-label>
				</ion-item>
			{/if}
		</ion-list>
	{:else}
		<ion-item>
			<h2>Uh oh! Company can't be loaded right now.</h2>
		</ion-item>
	{/if}

	{#if $companyLatest }
		<ion-list>
			<ion-list-header>
				<ion-label>Latest Report</ion-label>
			</ion-list-header>

			<ion-item>
				<ion-label>
					<p><CreatedOrUpdated createdAt={ $companyLatest.createdAt } updatedAt={ $companyLatest.updatedAt } /></p>
				</ion-label>
			</ion-item>

			{#each objectEntries(reportFieldMap) as [ key, title ] }
				{ @const value = $companyLatest[ key ] }

				{#if value != undefined }
					{#if key === 'nextFundraise' }
						<ion-item>
							<ion-label>
								<p>{ title }</p>

								<h2>{ parseDate(value).toLocaleString(undefined, { month : 'short', year : '2-digit' }) }</h2>
							</ion-label>
						</ion-item>
					{:else if typeof value === 'object' }
						<DollarDisplayItem
							{ title }
							{ ...value }
						/>
					{:else}
						<DollarDisplayItem
							{ title }
							{ value}
						/>
					{/if}
				{/if}
			{/each}
		</ion-list>
	{/if}
</ion-content>
