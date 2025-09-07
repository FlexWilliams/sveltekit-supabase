<script lang="ts">
	import type { Chat } from '../chat';

	interface ChatProps {
		chat: Partial<Chat>;
	}

	let { chat }: ChatProps = $props();
</script>

<article class:sender={chat?.sentByUser} class:receiver={!chat?.sentByUser}>
	<p class="message">{chat?.message}</p>
	<footer>
		<p>
			{#if !chat?.sent}
				<span>Sending...</span>
			{/if}
		</p>
		<p>{chat?.dateFormatted || 'Just Now'}</p>
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
			margin-top: 0.5rem;
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

		footer {
			flex-direction: row-reverse;
		}
	}
</style>
