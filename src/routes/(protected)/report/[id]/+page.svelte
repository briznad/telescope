<script
	lang="ts"
	context="module"
>
	import { company } from '$stores/company';
</script>


<script lang="ts">
	const {
		id,
		currentCompany,
	} = company;

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

	h2 {
		text-wrap: wrap;
		line-height: 1.333;
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
					href="{ window.location.pathname }/edit"
				>
					Edit
				</ion-button>
			</ion-buttons>

			<ion-title>{ $currentCompany.name }</ion-title>

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
	{#if $currentCompany }
		<ion-header collapse="condense">
			<ion-toolbar>
				<ion-title size="large">{ $currentCompany.name }</ion-title>

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

		<ion-list>
			{#if 'hqLocation' in $currentCompany }
				<ion-item>
					<ion-label>
						<p>Location</p>

						<h2>{ $currentCompany.hqLocation }</h2>
					</ion-label>
				</ion-item>
			{/if}

			{#if ($currentCompany.industry ?? []).length > 0 }
				<ion-item>
					<ion-label>
						<p>Industry</p>

						<h2>{ stringifyList($currentCompany.industry, $currentCompany.otherIndustry) }</h2>
					</ion-label>
				</ion-item>
			{/if}

			{#if ($currentCompany.businessModel ?? []).length > 0 }
				<ion-item>
					<ion-label>
						<p>Business Model</p>

						<h2>{ stringifyList($currentCompany.businessModel, $currentCompany.otherBusinessModel) }</h2>
					</ion-label>
				</ion-item>
			{/if}

			{#if ($currentCompany.featureSet ?? []).length > 0 }
				<ion-item>
					<ion-label>
						<p>Feature Set</p>

						{#each $currentCompany.featureSet ?? [] as feature }
							<h2>{ feature }</h2>
						{/each}
					</ion-label>
				</ion-item>
			{/if}

			{#if 'founderQuality' in $currentCompany }
				<ion-item>
					<ion-label>
						<p>Founder Quality</p>

						<h2 class="aggregate-score">aggregate score: { $currentCompany.founderQuality?.aggregateScore ?? 0 }</h2>

						{#each Object.entries($currentCompany.founderQuality ?? {}) as [ key, value ] }
							{#if key !== 'aggregateScore' }
								<h3>{ key }: { value }</h3>
							{/if}
						{/each}
					</ion-label>
				</ion-item>
			{/if}
		</ion-list>
	{:else}
		<ion-item>
			<h2>Uh oh! Report can't be loaded right now.</h2>
		</ion-item>
	{/if}
</ion-content>
