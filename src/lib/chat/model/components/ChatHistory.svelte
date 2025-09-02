<script lang="ts">
	import { userState } from '$lib/state/user-state.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import { interval, Subscription, take, tap, timer } from 'rxjs';
	import { onDestroy, onMount, untrack } from 'svelte';
	import type { Chat } from '../chat';
	import ChatMessage from './ChatMessage.svelte';

	interface ChatHistoryProps {
		stuff: Stuff | null;
		activeConversation: string | null;
	}

	let intialChatFetch = $state(false);

	let { stuff, activeConversation }: ChatHistoryProps = $props();

	let userId: string | null = $derived(userState.id);

	let sendingChat = $state(false);

	let isRenter = $derived(userId === stuff?.userId);

	let message: string | null = $state(null);

	let chats: Partial<Chat>[] = $state([]);

	const subscriptions: Subscription[] = [];

	$effect(() => {
		if (activeConversation) {
			untrack(async () => {
				if (chats.length > 0) {
					chats.length = 0;
				}

				intialChatFetch = false;
				await fetchChats();
				intialChatFetch = true;
			});
		}
	});

	function scrollChat(chatId: string): void {
		timer(250)
			.pipe(
				take(1),
				tap(() => {
					const chatItem = document.getElementById(chatId) as HTMLLIElement;
					if (chatItem) {
						chatItem.scrollIntoView({ behavior: 'smooth' });
					}
				})
			)
			.subscribe();
	}

	async function sendChat(): Promise<void> {
		if (!message) {
			return;
		}

		sendingChat = true;

		let messageCopy = message;
		let tempChat: Partial<Chat> | undefined = {
			id: -9999,
			message: messageCopy,
			senderId: userId || ''
		};
		chats.push(tempChat);

		scrollChat(`${tempChat.id}`);

		message = null;

		const response = await fetch(`/api/stuff/${stuff?.id}/chats`, {
			method: 'POST',
			body: JSON.stringify({ message: messageCopy, activeConversation }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			ToastrService.error(`Unable to send chat message.\nPlease try again.`);
		} else {
			const newChat = (await response.json()) as Chat;
			let tempChatIndex = chats.findIndex((c) => c.id === -9999);
			if (tempChatIndex > -1) {
				chats[tempChatIndex] = newChat;
			}
		}

		sendingChat = false;
	}

	async function fetchChats(): Promise<void> {
		if (!stuff?.id) {
			ToastrService.error(`Unable to load chat messages`);
			return;
		}

		const response = await fetch(
			`/api/stuff/${stuff?.id}/chats?activeConversation=${activeConversation}`
		);

		if (!response.ok) {
			ToastrService.error(`Unable to fetch chat messages.\nPlease try again.`);
		} else {
			const chatHistory = (await response.json()) as Chat[];

			// TODO: rework, this is to handle race condition of swapping chat tabs
			// while previous chat fetching is in flight and comes back overriding data...
			// rxjs should EASILY handle this but i dont remember how! :(
			if (isRenter) {
				let firstMessage = chatHistory[0];
				if (
					firstMessage &&
					firstMessage.senderId !== activeConversation &&
					firstMessage.receiverId !== activeConversation
				) {
					return;
				}
			}

			const chatDiff = chats?.length !== chatHistory?.length && chatHistory?.length > 0;

			if (chatDiff) {
				// TODO: it may be better to never overwrite and just push, overwrite selectively...
				// also won't work once paging impld
				chats = chatHistory;

				if (chats.length > 0) {
					scrollChat(`${chats[chats.length - 1]?.id}`);
				}
			}
		}
	}

	function resetForm(): void {
		const form = document.getElementById('chat-form') as HTMLFormElement;
		if (form) {
			form.reset();
		}
	}

	async function handleSendChat(event: Event): Promise<void> {
		event.preventDefault(); // TODO: remove and use:enhance!

		if (!stuff?.id) {
			return;
		}

		await sendChat();
		resetForm();
	}

	onMount(async () => {
		if (!isRenter) {
			await fetchChats();
			intialChatFetch = true;
		}

		subscriptions.push(
			interval(7000)
				.pipe(
					tap(async () => {
						await fetchChats();
					})
				)
				.subscribe()
		);
	});

	onDestroy(() => {
		subscriptions.forEach((sub) => sub.unsubscribe());
	});
</script>

<section class="chat-history">
	<ol id="chat-log">
		{#each chats as chat (chat.id)}
			<li id={`${chat.id}`}>
				<ChatMessage {chat} />
			</li>
		{:else}
			<li class="no-messages">
				{#if intialChatFetch}
					<p>No messages yet</p>
				{:else}
					<p>Loading chats...</p>
				{/if}
			</li>
		{/each}
	</ol>

	<form name="chat" id="chat-form">
		<label class="form-field">
			Message:
			<textarea bind:value={message}></textarea>
		</label>

		<button type="submit" onclick={handleSendChat} disabled={sendingChat}>Send</button>
	</form>
</section>

<style lang="scss">
	@use '../../../../lib/styles/forms/forms.scss';
	@use '../../../../lib/styles/layout/panel.scss';
	@use '../../../styles/responsive.scss';

	section.chat-history {
		@include panel.panel;
		position: relative;
		height: calc(90% - 5rem);
		max-height: calc(90% - 5rem);
		width: calc(100% - 5rem);
		overflow: hidden;
		overflow-y: auto;
		margin: 0 2rem;
		background-color: rebeccapurple;

		ol {
			margin: 0;
			padding: 0;
			list-style: none;
			height: 70%;
			max-height: 70%;
			overflow-y: auto;

			li {
				display: flex;
				flex-direction: column;
			}

			li.no-messages {
				text-align: center;
			}
		}

		form {
			@include forms.form;
			height: 20%;
			max-height: 20%;
			overflow-y: auto;

			.form-field {
				@include forms.form_field;
				margin: 0;
			}

			label {
				color: white;
			}

			textarea {
				@include forms.form_field_text_area;
			}

			button {
				margin-top: 0.5rem;
				width: 100%;
				min-height: 2rem;
				height: 2rem;
				border: none;
				border-radius: 0.25rem;
				background-color: #cddc39;
			}
		}
	}

	@media screen and (max-width: responsive.$mini-width) {
		section.chat-history {
			height: calc(85% - 5rem);
			max-height: calc(85% - 5rem);
			ol {
				height: 60%;
				max-height: 60%;
			}

			form {
				@include forms.form;
				height: 30%;
				max-height: 30%;
			}
		}
	}
</style>
