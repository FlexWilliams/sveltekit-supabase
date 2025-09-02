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
	@use '../../../../lib/styles/overlay/overlay.scss';

	header {
		@include overlay.overlay_header;

		div {
			@include overlay.overlay_flex_container;

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
			@include overlay.overlay_close_button;
		}
	}
</style>
