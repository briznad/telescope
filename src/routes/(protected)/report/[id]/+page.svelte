<script
	lang="ts"
	context="module"
>
	import type { Report } from '$types/report';

	import { objectEntries, parseDate } from 'briznads-helpers';

	import { report } from '$stores/report';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';
	import CreatedOrUpdated from '$components/CreatedOrUpdated.svelte';
	import DollarDisplayItem from '$components/DollarDisplayItem.svelte';


	const fieldMap : { [ key : string ] : string } = {
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
	} = report;
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
	<ion-header translucent={ true }>
		<ion-toolbar>
			<ion-title>{ $current.companyName }</ion-title>

			<ion-buttons
				slot="end"
				collapse={ true }
			>
				<ion-button
					fill="solid"
					href="/report/new?cid={ $current.companyId }"
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
				<ion-title size="large">{ $current.companyName }</ion-title>

				<ion-buttons
					slot="end"
					collapse={ true }
				>
					<ion-button
						fill="solid"
						href="/report/new?cid={ $current.companyId }"
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
			<ChunkyLabel>{ $current.companyId }</ChunkyLabel>
		</ion-item>

		<ion-list>
			<ion-item>
				<ion-label>
					<p><CreatedOrUpdated createdAt={ $current.createdAt } updatedAt={ $current.updatedAt } /></p>
				</ion-label>
			</ion-item>

			{#each objectEntries(fieldMap) as [ key, title ] }
				{ @const value = $current[ key ] }

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
	{:else}
		<ion-item>
			<h2>Uh oh! Report can't be loaded right now.</h2>
		</ion-item>
	{/if}
</ion-content>
