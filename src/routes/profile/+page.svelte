<h2>My Profile</h2>

<menu>
	<ul>
		<li>
			<a href="/profile/update">Update Profile</a>
		</li>
		<li>
			<a href="/auth/reset-password">Reset Password</a>
		</li>
		<li>
			<a href="/profile/invite">Invite a Friend</a>
		</li>
	</ul>
</menu>

<style lang="scss">
	@use '../../lib/styles/responsive.scss';
	@use '../../lib/styles/button/button.scss';

	h2 {
		text-align: center;
	}

	menu {
		margin: 0;
		padding: 2rem 0;

		ul {
			list-style: none;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			margin: 0;
			padding: 0;

			li {
				width: 90%;
				display: flex;
				justify-content: center;
				align-items: center;

				a {
					@include button.button_link;
					width: 100%;
					&:hover {
						text-decoration: underline;
					}
				}
			}
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		menu {
			ul {
				li {
					a {
						font-size: 1.5rem;
					}
				}
			}
		}
	}
</style>
