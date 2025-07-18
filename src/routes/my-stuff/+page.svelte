<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger.js';
	import type { Stuff } from '$lib/stuff/components/model/stuff.ts';
	import StuffCard from '$lib/stuff/components/StuffCard.svelte';
	import { debounceTime, Subject, tap, type Subscription } from 'rxjs';
	import { onDestroy, onMount } from 'svelte';

	let { data } = $props();

	let searchText = $state('');

	let stuff = $derived.by(() => filterBySearchText(data.stuff));

	const subscriptions: Subscription[] = [];
	const searchText$$ = new Subject<string>();
	const searchText$ = searchText$$.asObservable();

	function filterBySearchText(stuff: Stuff[]): Stuff[] {
		return searchText
			? stuff.filter(
					(s) =>
						s.name.toLocaleLowerCase().indexOf(searchText?.toLowerCase()) > -1 ||
						(s.description
							? s.description.toLocaleLowerCase().indexOf(searchText?.toLowerCase()) > -1
							: false)
				)
			: stuff;
	}

	function handleStuffCardClick(evt: Event): void {
		const target = evt.target as HTMLElement;
		target?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
	}

	function listenForSearchTextChanges(): Subscription {
		return searchText$
			.pipe(
				debounceTime(500),
				tap((text) => {
					Logger.debug(`User searching for ${text}`);
					searchText = text;
				})
			)
			.subscribe();
	}

	function handleSearchTextChange(evt: Event): void {
		const input = evt?.target as HTMLInputElement;

		if (!input) {
			Logger.error(`Unable to filter items, input element not found!`);
			return;
		}

		searchText$$.next(input.value);
	}

	function handleEdit(itemId: string): void {
		goto(`/my-stuff/${itemId}`);
	}

	async function filterItems(evt: Event) {
		evt.preventDefault();
	}

	onMount(() => {
		subscriptions.push(listenForSearchTextChanges());
	});

	onDestroy(() => {
		subscriptions.forEach((sub) => sub.unsubscribe());
	});
</script>

<h2>My Stuff</h2>
<form name="filter-items" onsubmit={filterItems}>
	<div class="form-field">
		<label>
			<span>Search</span>
			<input type="text" name="search-text" onkeyup={handleSearchTextChange} />
		</label>
	</div>
</form>

<ul>
	{#each stuff as s}
		<li>
			<StuffCard stuff={s} handleClick={handleStuffCardClick} {handleEdit} />
		</li>
	{:else}
		<li class="no-items">
			{#if searchText}
				<p>No items match your search criteria</p>
			{:else}
				<p>You don't have any stuff!</p>
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	@use '../../lib/styles/forms/forms.scss';

	h2 {
		@include forms.form_header;
	}

	form {
		@include forms.form;
		height: initial;
	}

	.form-field {
		@include forms.form_field;
		margin: 0;

		label {
			@include forms.form_field_label;
		}

		input {
			@include forms.form_field_text_input;
		}
	}

	ul {
		list-style: none;
		display: flex;
		margin: 0;
		padding: 0 1rem;
		overflow-x: auto;
		height: 100%;

		li {
			position: relative;
			margin: 0;
			margin-right: 1rem;
			padding: 0;
			min-width: calc(100% - 2rem);
			min-height: calc(100% - 1rem);
			height: calc(100% - 1rem);

			&:last-of-type {
				margin-right: 0;
				min-width: 100%;
			}
		}

		li.no-items {
			p {
				text-align: center;
			}
		}
	}
</style>
