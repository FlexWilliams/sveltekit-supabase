<script lang="ts">
	import { goto } from '$app/navigation';
	import { type ChatGroup } from '$lib/chat/model/chat';
	import ChatHeader from '$lib/chat/model/components/ChatHeader.svelte';
	import ChatHistory from '$lib/chat/model/components/ChatHistory.svelte';
	import ChatTabs from '$lib/chat/model/components/ChatTabs.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { extractSearchParamValue } from '$lib/web/http/search.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let stuff: Stuff | null = $derived(data.stuff);

	let chatGroups: ChatGroup[] | null = $derived(data.chatGroups);

	let activeConversation: string | null = $state(
		data?.chatGroups && data?.chatGroups.length > 0 ? data?.chatGroups[0].renteeId : null
	);

	function handleChatGroupTabClick(group: ChatGroup): void {
		activeConversation = group?.renteeId;

		goto(`./chat?activeConversation=${group?.renteeId}`);
	}

	onMount(() => {
		const activeConvoParam = extractSearchParamValue('activeConversation');
		if (activeConvoParam && data?.chatGroups?.some((f) => f.renteeId === activeConvoParam)) {
			activeConversation = activeConvoParam;
		}
	});
</script>

<section class="chat">
	<ChatHeader />

	<ChatTabs {activeConversation} chatGroups={chatGroups || []} {handleChatGroupTabClick} />

	<ChatHistory {stuff} {activeConversation} />
</section>

<style lang="scss">
	section {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		background-color: #ffffffa3;
		display: flex;
		flex-direction: column;
	}
</style>
