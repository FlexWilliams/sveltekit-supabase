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
	<h2>Search</h2>

	<form name="search-friend-stuff-form">
		<label for="search" aria-label="Search"></label>
		<input
			id="search"
			name="search"
			type="text"
			onkeyup={handleSearchTextChange}
			placeholder={`Search if your friends have it for rent`}
		/>
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
			{/if}
		{/each}
	</ul>
	<div class="social">
		<StuffSearchSocialCarousel {socials} />
	</div>
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';
	@use '../../lib/styles/overlay/shadows.scss';
	@use '../../lib/styles/forms/forms.scss';
	@use '../../lib/styles/responsive.scss';

	section {
		@include panel.panel;
		display: flex;
		flex-direction: column;

		h2 {
			@include forms.form_header;
			height: 10%;
		}

		form {
			padding: 0 1rem;
			height: 10%;

			label {
				margin: 0;
				font-size: 1.25rem;
			}

			input {
				width: calc(100% - 0.5rem);
				height: 2rem;
				border-radius: 0.25rem;
				border: 1px solid #f3f3f3;
				box-shadow:
					rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
					rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

				&::placeholder {
					text-align: center;
				}
			}
		}

		ul.search-results {
			height: calc(40% - 2rem);
			width: calc(100% - 2rem);
			list-style: none;
			margin: 0;
			padding: 1rem;
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
			height: calc(40% - 2rem);
			width: calc(100% - 2rem);
			padding: 1rem;
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		section {
			h2 {
				font-size: 2.5rem;
				margin-top: 2rem;
			}

			form {
				input {
					height: 3rem;
					font-size: 1.25rem;
				}
			}
		}
	}
</style>
