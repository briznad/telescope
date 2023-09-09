<script
	lang="ts"
	context="module"
>
	import type { Term } from '$types/report';


	const percentageRegex = /percentage/i;
	const countRegex = /count/i;

	const isPercentage = (title : string) : boolean => percentageRegex.test(title);
	const isCount = (title : string) : boolean => countRegex.test(title);
</script>


<script lang="ts">
	export let title           : string;
	export let value           : number | undefined = undefined;
	export let term            : Term | undefined   = undefined;
	export let annualizedValue : number | undefined = undefined;
</script>


<style lang="scss">
	h2 {
		&:not(.count) {
			&::before {
				content: '$';
				color: rgb(125, 125, 125);
				font-size: 0.95em;
				padding-right: 0.1em;
			}

			&.percentage {
				&::before {
					content: '%';
					font-size: 0.85em;
				}
			}
		}
	}
</style>


{#if value != undefined }
	<ion-item>
		<ion-label>
			<p>{ title }{#if annualizedValue != undefined }&nbsp;(annualized){/if}</p>

			<h2
				class:count={ isCount(title) }
				class:percentage={ isPercentage(title) }
			>{ annualizedValue ?? value }</h2>
		</ion-label>
	</ion-item>
{/if}
