<dialog id="form-loader">Loading...</dialog>

<style lang="scss">
	dialog {
		border-radius: 0.5rem;
		border: none;
		cursor: progress;
		z-index: 2;
		background-color: rgba(240, 248, 255, 0.75);
		display: none;
	}

	dialog[open] {
		display: flex;
	}
</style>
