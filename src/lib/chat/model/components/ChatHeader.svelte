<script lang="ts">
	import type { ChatGroup } from '../chat';

	interface ChatHeaderProps {
		chatGroups: ChatGroup[] | null;
		activeConversation: string | null;
		handleConversationChange(event: Event): void;
	}

	let { activeConversation, chatGroups, handleConversationChange }: ChatHeaderProps = $props();
</script>

<header>
	<div>
		<a href="./" class="close" aria-label="Close">X</a>

		{#if chatGroups && chatGroups?.length > 0}
			<form name="chat-conversations" method="POST" action="?/conversation">
				<label>
					Select Conversation
					<select
						name="activeConversation"
						bind:value={activeConversation}
						onchange={handleConversationChange}
					>
						{#each chatGroups as group (group.renteeId)}
							<option value={group.renteeId} selected={activeConversation === group?.renteeId}
								>{group.renteeId}</option
							>
						{/each}
					</select>
					<button type="submit">Refresh Messages</button>
				</label>
			</form>
		{/if}
	</div>
	<h2>
		<span>Chat Messages</span>
		<span>Between you & {activeConversation}</span>
	</h2>
</header>

<style lang="scss">
	@use '../../../../lib/styles/overlay/overlay.scss';
	@use '../../../../lib/styles/responsive.scss';

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

	@media screen and (max-width: responsive.$mini-width) {
		header {
			h2 {
				font-size: 1rem;
				justify-content: center;
			}

			div {
				label {
					display: flex;

					select {
						min-width: 2rem;
					}
				}
			}

			a.close {
				min-height: 2rem;
				height: 2rem;
				width: 2rem;
				min-width: 2rem;
			}
		}
	}
</style>
