<script
	lang="ts"
	context="module"
>
	import { company } from '$stores/company';

	import NewOrEditCompany from '$components/NewOrEditCompany.svelte';
</script>


<script lang="ts">
	const {
		current,
	} = company;
</script>


<style lang="scss"></style>


<NewOrEditCompany
	company={ $current }
/>
