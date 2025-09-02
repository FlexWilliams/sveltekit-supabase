<script lang="ts">
	import type { ChatGroup } from '../chat';

	interface ChatHeaderProps {
		currentChatFriend: string | null;
		chatGroups: ChatGroup[] | null;
		handleConversationChange(event: Event): void;
	}

	let { currentChatFriend, chatGroups, handleConversationChange }: ChatHeaderProps = $props();
</script>

<header>
	<div>
		<a href="./" class="close" aria-label="Close">X</a>

		{#if chatGroups && chatGroups?.length > 0}
			<label>
				Select Conversation
				<select bind:value={currentChatFriend} onchange={handleConversationChange}>
					{#each chatGroups as group (group.renteeId)}
						<option>{group.renteeId}</option>
					{/each}
				</select>
			</label>
		{/if}
	</div>
	<h2>
		<span>Chat Messages</span>
		<span>Between you & {currentChatFriend}</span>
	</h2>
</header>

<style lang="scss">
	header {
		display: flex;
		position: relative;
		width: calc(100% - 4rem);
		height: calc(20% - 1rem);
		max-height: calc(20% - 1rem);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 0.5rem 2rem;

		div {
			flex: 1;
			display: flex;
			align-items: center;
			gap: 1rem;
			width: 100%;
			overflow: hidden;

			a {
				width: 20%;
				max-width: 20%;
			}

			label {
				width: 80%;
				max-width: 80%;

				select {
					width: 100%;
					max-width: 100%;
				}
			}
		}

		h2 {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin: 0;
			text-align: center;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 100%;

			span {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				width: 100%;

				&:last-child {
					font-size: 1rem;
				}
			}
		}

		a.close {
			min-height: 3rem;
			height: 3rem;
			width: 3rem;
			min-width: 3rem;
			border-radius: 3rem;
			border: none;
			font-size: 0.85rem;
			background-color: rebeccapurple;
			color: white;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			text-decoration: none;
		}
	}
</style>
