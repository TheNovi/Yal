<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';
	import Goals from './Goals.svelte';
	import { calcTotal } from '$lib/yal/fe';
	import { onCtrlEnterKey } from '$lib/events';

	export let data: PageData;

	let parseInputValue = '';

	$: goals = data.goals.reduce((p, c) => (p += c.value), 0);
	$: total = calcTotal([data.month]);

	async function parse() {
		const trans = parseInputValue.split('\n').reduce(
			(trans, t) => {
				t = t.trim();
				const exec = /^#?[ ]*(-?\d+)[ ]+(.+)$/.exec(t);
				if (exec) {
					trans.push({
						value: +exec[1],
						name: exec[2],
						ignore: t.startsWith('#'),
					});
				}
				return trans;
			},
			[] as PartialBy<PageData['month']['Trans'][0], 'id'>[]
		);
		//TODO Check parseInputValue.split('\n').length == trans.length
		await fetch(`/trans/${data.month.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(trans),
		}).then(async (r) => {
			let j = await r.json();
			if (!r.ok) {
				console.log('Trans Error: ', j);
				return;
			}
			data.month.Trans = [...data.month.Trans, ...j];
		});
		parseInputValue = '';
	}
</script>

<div class="border flex flex-col h-full max-h-full overflow-auto">
	<Header name="Yaldabaoth" title={`Yaldabaoth ${data.month.month}.${data.month.year}`} />
	<div class="border grow flex">
		<div class="border grow">
			{#each data.month.Trans as t}
				<div>{t.ignore ? '# ' : ''}{t.value} {t.name}</div>
			{/each}
		</div>
		<div class="flex flex-col">
			<form class="border text-center" method="post">
				<!-- action="?/changeMonth" -->
				<button disabled={!data.prev} class="px-2" name="b" value={data.prev}> &lt; </button>
				<span class="mx-4">{data.month.month}.{data.month.year}</span>
				<button disabled={!data.next} class="px-2" name="b" value={data.next}> &gt; </button>
			</form>
			<div class="border">
				<div>
					{data.month.init} - {data.month.Block.value} =
					{data.month.init - data.month.Block.value}
				</div>
				<div>After Trans: {total}</div>
			</div>
			<div class="border grow flex flex-col">
				<textarea
					on:keyup={(e) => onCtrlEnterKey(e, parse)}
					bind:value={parseInputValue}
					placeholder="Parse Trans"
					class="grow resize-none"
				/>
				<button disabled={!parseInputValue} class="select-none w-full" on:click={parse}>
					Parse
				</button>
			</div>
			{#if !data.next}
				<form class="border" method="post">
					<input type="hidden" name="month" value={data.month.month} />
					<input type="hidden" name="year" value={data.month.year} />
					<input type="hidden" name="blockId" value={data.month.Block.id} />
					<input class="w-24" type="number" name="init" placeholder="Init" />
					<button name="b" value="0">New month</button>
				</form>
			{/if}
		</div>
	</div>
	<div class="border shrink-0 flex">
		<div class="border grow">
			<Goals bind:goals={data.goals} />
		</div>
		<div class="border">
			<div>Total: {data.total + total}</div>
			<div>Offset: {data.offset}</div>
			<div>Goals: {goals}</div>
			<div class="text-center font-bold">{data.total + total - data.offset - goals}</div>
		</div>
	</div>
	<!-- <div class="text-xs text-gray-600 select-text">{JSON.stringify(data)}</div> -->
</div>

<style lang="postcss">
	.border {
		@apply border-2 overflow-auto border-gray-600 rounded-md p-1 m-1;
	}
</style>
