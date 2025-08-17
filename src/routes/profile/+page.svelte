<script lang="ts"></script>

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
				width: 60%;
				min-height: 3rem;
				background-color: #cddc39;
				border-radius: 0.5rem;
				padding: 1rem 3rem;
				display: flex;
				justify-content: center;
				align-items: center;

				a {
					height: 100%;
					width: 100%;
					text-decoration: none;
					text-align: center;
					color: black;
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
