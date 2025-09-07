<script lang="ts">
	import { Logger } from '$lib/logging/logger.js';
	import StuffCard from '$lib/stuff/components/StuffCard.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff.js';
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
	{#each stuff as s (s?.id)}
		<li>
			<StuffCard stuff={s} handleClick={handleStuffCardClick} />
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
	@use '../../lib/styles/responsive.scss';

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
			border: 1px solid #f3f3f3;
			box-shadow:
				rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
				rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
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

	@media screen and (min-width: responsive.$tablet-width) {
		h2 {
			font-size: 2.5rem;
			margin-top: 2rem;
		}

		.form-field {
			label {
				font-size: 2rem;
			}

			input {
				height: 3rem;
				font-size: 1.25rem;
			}
		}
	}
</style>
