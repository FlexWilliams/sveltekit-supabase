<script lang="ts">
	import { userState } from '$lib/state/user-state.svelte';
	import type { Chat } from '../chat';

	interface ChatProps {
		chat: Partial<Chat>;
	}

	let { chat }: ChatProps = $props();

	let date = $derived.by(() => {
		return chat?.createdOn
			? `${new Date(chat?.createdOn).toLocaleDateString()} @ ${new Date(chat?.createdOn).toLocaleTimeString()}`
			: 'Just Now';
	});

	let userId = $derived(userState.id);
</script>

<article class:sender={chat?.senderId === userId} class:receiver={chat?.senderId !== userId}>
	<p class="message">{chat?.message}</p>
	<footer>
		<p>
			{#if !chat?.sent}
				<span>Sending...</span>
			{/if}
		</p>
		<p>{date}</p>
	</footer>
</article>

<style lang="scss">
	article {
		background-color: white;
		margin-bottom: 1rem;
		border: 1px solid black;
		border-radius: 0.25rem;
		padding: 0.5rem;
		width: calc(80% - 1rem - 2px);
		max-width: calc(80% - 1rem - 2px);

		p {
			margin: 0;
		}

		footer {
			display: flex;
			justify-content: space-between;

			p {
				font-size: 0.75rem;
			}
		}
	}

	article.sender {
		align-self: flex-end;
		text-align: end;
		background-color: #cddc39;
	}

	article.receiver {
		align-self: flex-start;
		text-align: left;
	}
</style>
