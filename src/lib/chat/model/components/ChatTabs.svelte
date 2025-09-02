<script lang="ts">
	import type { ChatGroup } from '../chat';

	interface ChatTabsProps {
		activeConversation: string | null;
		chatGroups: ChatGroup[];
		handleChatGroupTabClick(chatgroup: ChatGroup): void;
	}

	let { activeConversation, chatGroups, handleChatGroupTabClick }: ChatTabsProps = $props();
</script>

<ul>
	{#each chatGroups as group (`${group.stuffId}${group.renteeId}`)}
		<li>
			<button
				type="button"
				class:active={group.renteeId === activeConversation}
				onclick={() => handleChatGroupTabClick(group)}>Conversation with {group?.renteeId}</button
			>
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		margin: 0;
		margin-bottom: 1rem;
		padding: 0 2rem;
		list-style: none;
		display: flex;
		width: calc(100% - 4rem);
		max-width: calc(100% - 4rem);
		overflow-x: auto;
		gap: 1rem;

		li {
			button {
				min-height: 2rem;
				max-height: 3rem;
				border-radius: 0.25rem;
				border: 1px solid gray;
                overflow: hidden;
			}

			button.active {
				background-color: rebeccapurple;
				color: white;
			}
		}
	}
</style>
