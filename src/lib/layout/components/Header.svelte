<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import avatar from '$lib/assets//images/avatars/avatar.png';
	import { Logger } from '$lib/logging/logger';
	import type { User } from '@supabase/supabase-js';
	import { onMount, untrack } from 'svelte';

	interface HeaderProps {
		user: User | null;
		profilePic: Blob | null;
	}

	let { user, profilePic }: HeaderProps = $props();

	let profilePicUrl: string | null = $derived.by(() =>
		user?.id && profilePic ? URL.createObjectURL(new Blob([profilePic])) : null
	);

	let onLoginPage = $state(true);

	let route: string | null = $state(null);

	function setAvatarBackgroundImage(profilePicUrl: string | null): void {
		const avatarButton = document.getElementById('avatar');
		if (avatarButton) {
			avatarButton.style.backgroundImage = profilePicUrl
				? `url(${profilePicUrl})`
				: `url(${avatar})`;
		}
	}

	$effect(() => {
		if (profilePicUrl) {
			Logger.debug(profilePicUrl);
			untrack(() => {
				setAvatarBackgroundImage(profilePicUrl);
			});
		} else {
			untrack(() => {
				setAvatarBackgroundImage(null);
			});
		}
	});

	onMount(() => {
		afterNavigate((e) => {
			const routeId = e.to?.route?.id;
			onLoginPage = routeId === '/auth';

			if (routeId) {
				route = routeId;
			}
		});
	});
</script>

<header>
	<div>
		<a href="/" class="banner">
			<h1>Vouch for Me</h1>
		</a>

		<a href="/profile" aria-labelledby="avatar" class="avatar">
			<button id="avatar" aria-label="Go to User profile page"></button>
		</a>
	</div>
	<nav>
		<ul>
			{#if !user || !user.id}
				{#if !onLoginPage}
					<li style="flex: 1"></li>
					<li>
						<a href="/auth">Login</a>
					</li>
				{/if}
			{:else}
				<li><a href="/search" class:active={route === '/search'}>Search</a></li>
				<li><a href="/my-rentals" class:active={route === '/my-rentals'}>Rentals</a></li>
				<li><a href="/my-stuff" class:active={route === '/my-stuff'}>My Stuff</a></li>
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
		height: calc(20% - 1rem);
		max-height: calc(20% - 1rem);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 0.5rem 0;

		div {
			display: flex;
			flex-flow: row-reverse;
			align-items: center;
			justify-content: flex-end;
			padding: 0 2rem;
			gap: 1rem;

			a.banner {
				color: initial;
				text-decoration: initial;

				h1 {
					text-align: center;
					margin-bottom: 0;
					font-size: 1.5rem;
					@include fonts.chango;
					color: #cddc39;
					margin: 0;
				}
			}

			a.avatar {
				button {
					border: none;
					background-color: transparent;
					width: 3rem;
					height: 3rem;
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

	nav {
		display: flex;
		justify-content: flex-start;
		padding: 0 2rem;
		min-height: 3rem;

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			gap: 1rem;
			justify-content: space-evenly;
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

				a.active {
					color: #cddc39;
					font-weight: bold;
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
			}
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		header {
			div {
				a {
					min-width: 5rem;

					&:first-of-type {
						flex: 1;
						margin-right: 5rem;
					}
				}

				a.banner {
					h1 {
						font-size: 3rem;
					}
				}

				a.avatar {
					button {
						width: 5rem;
						height: 5rem;
					}
				}
			}
		}

		nav {
			ul {
				li {
					a {
						font-size: 1.5rem;
					}
				}
			}
		}
	}
</style>
