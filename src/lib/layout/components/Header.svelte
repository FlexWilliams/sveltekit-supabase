<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	interface HeaderProps {
		user: User | null;
	}
	let { user }: HeaderProps = $props();

	let onLoginPage = $state(true);

	onMount(() => {
		afterNavigate((e) => {
			const route = e.to?.route?.id;
			onLoginPage = route === '/auth';
		});
	});
</script>

<header>
	<a href="/" class="banner">
		<h1>Vouch for Me</h1>
	</a>
	<nav>
		<ul>
			{#if !user || !user.id}
				{#if !onLoginPage}
					<li>
						<a href="/auth">Login</a>
					</li>
				{/if}
			{:else}
				<li class="avatar">
					<a href="/profile" aria-labelledby="avatar">
						<button id="avatar" aria-label="Go to User profile page"></button>
					</a>
				</li>
				<li><a href="/search">Search</a></li>
				<li><a href="/my-stuff">My Stuff</a></li>
				<li>
					<a href="/auth/logout">Logout</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<style lang="scss">
	@use '../../styles/fonts/fonts.scss';
	@use '../../styles/responsive.scss';

	header {
		width: 100%;
		height: 20%;
		max-height: 20%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		a.banner {
			color: initial;
			text-decoration: initial;
		}
	}

	h1 {
		text-align: center;
		margin-bottom: 0;
		@include fonts.chango;
	}

	nav {
		display: flex;
		justify-content: flex-start;
		padding: 0 2rem;

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			gap: 1rem;
			justify-content: flex-end;
			align-items: center;
			width: 100%;

			li {
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				height: 5rem;

				a {
					display: block;
					color: white;
					font-size: 1rem;
				}

				button {
					border: none;
					background-color: transparent;
					font-size: 1rem;
				}
			}
			li.avatar {
				flex: 1;

				a {
					button {
						width: 5rem;
						height: 5rem;
						border-radius: 10rem;
						background-color: white;
						background-image: url('$lib/assets/images/avatars/avatar.png');
						background-position: center; /* Center the image */
						background-repeat: no-repeat; /* Do not repeat the image */
						background-size: cover;
					}
				}
			}
		}
	}

	@media screen and (max-width: responsive.$mini-width) {
		nav {
			ul {
				li {
					height: 3rem;
				}

				li.avatar {
					a {
						button {
							width: 3rem;
							height: 3rem;
						}
					}
				}
			}
		}
	}
</style>
