<script lang="ts">
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import '../app.pcss';

	export let data: PageData;
	let overflow = true;
</script>

<div class="flex flex-col h-screen max-h-screen">
	<!-- <div class="bg-gray-900 flex items-center gap-2 py-1 px-2">
		<a class="text-lg" href="/">Yal</a>
	</div> -->
	<div class="flex-grow flex-shrink p-2" class:overflow-hidden={overflow}>
		<slot />
	</div>
	<div class="bg-gray-900 flex py-1 px-2 justify-between text-xs">
		<span>
			{data.version}
			{#if dev}
				- development
			{/if}
		</span>
		<span>TheNovi</span>
	</div>
</div>
