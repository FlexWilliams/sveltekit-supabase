<script lang="ts">
	import { goto } from '$app/navigation';
	import { type Chat, type ChatGroup } from '$lib/chat/model/chat';
	import ChatHeader from '$lib/chat/model/components/ChatHeader.svelte';
	import ChatHistory from '$lib/chat/model/components/ChatHistory.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { extractSearchParamValue } from '$lib/web/http/search.js';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	let stuff: Stuff | null = $derived(data.stuff);

	let chats: Chat[] = $derived(data.chats);

	let chatGroups: ChatGroup[] | null = $derived(data.chatGroups);

	let activeConversation: string | null = $state(
		form?.activeConversation
			? form.activeConversation
			: data?.chatGroups && data?.chatGroups.length > 0
				? data?.chatGroups[0].renteeId
				: data?.stuff?.userIsOwner
					? null
					: data?.stuff?.userId || null
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
	<ChatHeader {chatGroups} {activeConversation} {handleConversationChange} />

	<section class="chat-body">
		<ChatHistory {form} {chats} {stuff} {activeConversation} />
	</section>
</section>

<style lang="scss">
	@use '../../../../lib/styles/overlay/overlay.scss';

	section.chat {
		@include overlay.overlay;
		width: calc(100% - 2rem);
		border-radius: 0.5rem;
		margin: 0 1rem;
	}

	section.chat-body {
		height: 80%;
		max-height: 80%;
	}
</style>
