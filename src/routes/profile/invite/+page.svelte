<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	function clearForm(): void {
		const form = document.getElementById('invite-friend') as HTMLFormElement;
		form?.reset();
	}

	async function sendInvite(event: Event): Promise<void> {
		event.preventDefault(); // TODO: use as enhancemment with form use:enhance!
		const email = (document.getElementById('email') as HTMLInputElement)?.value;

		if (!email) {
			return;
		}

		const response = await fetch(`/api/invite`, {
			method: 'POST',
			body: JSON.stringify({
				email
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			Logger.error(`Error sending invite!`);
			ToastrService.error(`There was an error sending the invite.`);
		} else {
			ToastrService.alert(`Invite sent!\nAwaiting confirmation.`);
			clearForm();
		}
	}
</script>

<form id="invite-friend" name="invite-friend">
	<label for="email">Email:</label>
	<input id="email" type="email" autocomplete="email" />

	<button type="submit" onclick={sendInvite}>Send Invite</button>
</form>
