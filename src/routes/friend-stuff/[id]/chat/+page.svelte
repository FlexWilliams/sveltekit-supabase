<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { type Chat } from '$lib/chat/model/chat';
	import ChatMessage from '$lib/chat/model/components/ChatMessage.svelte';
	import { userState } from '$lib/state/user-state.svelte';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import { interval, Subscription, tap } from 'rxjs';
	import { onDestroy, onMount } from 'svelte';

	let stuffId: string | null = $state(null);

	let userId: string | null = $derived(userState.id);

	let message: string | null = $state(null);

	let chats: Partial<Chat>[] = $state([]);

	let fetchingChats = $state(false);

	let sendingChat = $state(false);

	const subscriptions: Subscription[] = [];

	async function sendChat(): Promise<void> {
		if (!message) {
			return;
		}

		sendingChat = true;

		let tempChat: Partial<Chat> | undefined = { id: -9999, message, senderId: userId || '' };
		chats.push(tempChat);

		const response = await fetch(`/api/stuff/${stuffId}/chats`, {
			method: 'POST',
			body: JSON.stringify({ message }),
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

		message = null;

		sendingChat = false;
	}

	async function fetchChats(): Promise<void> {
		if (!stuffId) {
			ToastrService.error(`Unable to load chat messages`);
			return;
		}

		fetchingChats = true;

		const response = await fetch(`/api/stuff/${stuffId}/chats`);

		if (!response.ok) {
			ToastrService.error(`Unable to fetch chat messages.\nPlease try again.`);
		} else {
			const chatHistory = (await response.json()) as Chat[];
			chats = chatHistory;
		}

		fetchingChats = false;
	}

	function resetForm(): void {
		const form = document.getElementById('chat-form') as HTMLFormElement;
		if (form) {
			form.reset();
		}
	}

	async function handleSendChat(event: Event): Promise<void> {
		event.preventDefault(); // TODO: remove and use:enhance!

		if (!stuffId) {
			return;
		}

		await sendChat();
		resetForm();
	}

	onMount(() => {
		afterNavigate(async (e) => {
			if (e.to) {
				stuffId = e.to.params?.id || null;

				await fetchChats();

				subscriptions.push(
					interval(5000)
						.pipe(
							tap(async () => {
								await fetchChats();
							})
						)
						.subscribe()
				);

				// TODO: also get via page load data
			}
		});
	});

	onDestroy(() => {
		subscriptions.forEach((sub) => sub.unsubscribe());
	});
</script>

<section class="chat">
	<header>
		<a href="./" class="close" aria-label="Close">X</a>
	</header>

	<section class="chat-history">
		<ol>
			{#each chats as chat (chat.id)}
				<li>
					<ChatMessage {chat} />
				</li>
			{:else}
				<li class="no-messages">
					{#if !fetchingChats}
						<p>No messages yet</p>
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
</section>

<style lang="scss">
	@use '../../../../lib/styles/layout/panel.scss';
	@use '../../../../lib/styles/forms/forms.scss';

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

		header {
			display: flex;
			position: relative;
			width: calc(100% - 4rem);
			height: calc(10% - 1rem);
			max-height: calc(10% - 1rem);
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			padding: 0.5rem 2rem;

			a.close {
				height: 3rem;
				width: 3rem;
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
				height: 80%;
				max-height: 80%;
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
	}
</style>
