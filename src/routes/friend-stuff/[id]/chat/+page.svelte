<script lang="ts">
	import { goto } from '$app/navigation';
	import { type ChatGroup } from '$lib/chat/model/chat';
	import ChatHeader from '$lib/chat/model/components/ChatHeader.svelte';
	import ChatHistory from '$lib/chat/model/components/ChatHistory.svelte';
	import { userState } from '$lib/state/user-state.svelte.js';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { extractSearchParamValue } from '$lib/web/http/search.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let stuff: Stuff | null = $derived(data.stuff);

	let chatGroups: ChatGroup[] | null = $derived(data.chatGroups);

	let userId: string | null = $derived(userState.id);

	let isRenter = $derived(userId === stuff?.userId);

	let activeConversation: string | null = $state(
		data?.chatGroups && data?.chatGroups.length > 0 ? data?.chatGroups[0].renteeId : null
	);

	function handleConversationChange(event: Event): void {
		const value = (event.target as HTMLInputElement)?.value;

		if (value) {
			activeConversation = value;
			goto(`./chat?activeConversation=${value}`);
		}
	}

	onMount(() => {
		const activeConvoParam = extractSearchParamValue('activeConversation');
		if (activeConvoParam && data?.chatGroups?.some((f) => f.renteeId === activeConvoParam)) {
			activeConversation = activeConvoParam;
		}
	});
</script>

<section class="chat">
	<ChatHeader
		{chatGroups}
		currentChatFriend={isRenter ? activeConversation : stuff?.userId || null}
		{handleConversationChange}
	/>

	<section class="chat-body">
		<ChatHistory {stuff} {activeConversation} />
	</section>
</section>

<style lang="scss">
	section.chat {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		background-color: rgba(227, 227, 227, 0.95);
		display: flex;
		flex-direction: column;
	}

	section.chat-body {
		height: 80%;
		max-height: 80%;
	}
</style>
