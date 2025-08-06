<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import StuffSearchCard from '$lib/stuff/components/StuffSearchCard.svelte';
	import StuffSearchSocialCarousel from '$lib/stuff/components/StuffSearchSocialCarousel.svelte';
	import { mockSocials, type Stuff, type StuffSocial } from '$lib/stuff/model/stuff';
	import { debounceTime, Subject, tap, type Subscription } from 'rxjs';
	import { onDestroy, onMount } from 'svelte';

	const subscriptions: Subscription[] = [];
	const searchText$$ = new Subject<string>();
	const searchText$ = searchText$$.asObservable();

	let searchText = $state('');

	let loading = $state(false);

	let stuff: Stuff[] = $state([]);

	let socials: StuffSocial[] = $state(mockSocials);

	function handleSearchTextChange(evt: Event): void {
		const input = evt?.target as HTMLInputElement;

		if (!input) {
			Logger.error(`Unable to search items, input element not found!`);
			return;
		}

		searchText$$.next(input.value);
	}

	function listenForSearchTextChanges(): Subscription {
		return searchText$
			.pipe(
				debounceTime(500),
				tap(async (text) => {
					Logger.debug(`User searching for ${text}`);
					searchText = text;

					loading = true;
					stuff = await search();
					loading = false;
				})
			)
			.subscribe();
	}

	async function search(): Promise<Stuff[]> {
		const stuff = (await (
			await fetch(`/api/friend-stuff?q=${encodeURI(searchText)}`)
		).json()) as Stuff[];

		return stuff;
	}

	onMount(() => {
		subscriptions.push(listenForSearchTextChanges());
	});

	onDestroy(() => {
		subscriptions.forEach((sub) => sub.unsubscribe());
	});
</script>

<section>
	<form name="search-friend-stuff-form">
		<h2>Search</h2>
		<label for="search"></label>
		<input id="search" name="search" type="text" onkeyup={handleSearchTextChange} />
	</form>

	<ul class="search-results">
		{#each stuff as s}
			<li class="search-results-card">
				<StuffSearchCard stuff={s} />
			</li>
		{:else}
			{#if loading}
				<li>
					<p class="loading">Loading...</p>
				</li>
			{:else if searchText}
				<li>
					<p class="no-matching-criteria">No items match your criteria</p>
				</li>
			{:else}
				<li>
					<p class="search-help">Search for anything!</p>
					<p class="search-help">Maybe your friends have it for rent</p>
				</li>
			{/if}
		{/each}
	</ul>
	<div class="social">
		<StuffSearchSocialCarousel {socials} />
	</div>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		height: 100%;

		form {
			height: 20%;

			h2 {
				margin: 0;
				font-size: 1.25rem;
			}

			input {
				width: 100%;
				height: 2rem;
				border-radius: 0.25rem;
				border: none;
			}
		}

		ul.search-results {
			height: 40%;
			list-style: none;
			margin: 1rem 0;
			padding: 1rem 0;
			height: calc(100% - 4rem);
			display: flex;
			overflow-x: auto;
			overflow-y: hidden;

			li {
				width: 100%;
			}

			li:first-child:nth-last-child(1) {
				width: 100%;
			}

			li.search-results-card {
				margin: 0;
				margin-right: 1rem;
				padding: 0;
				height: calc(100%);
				width: 80%;
				min-width: 80%;
				background-color: white;
				border-radius: 0.25rem;

				&:last-of-type {
					margin-right: 0;
				}
			}

			p {
				text-align: center;
			}
		}

		div.social {
			height: 40%;
		}
	}
</style>
