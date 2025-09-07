export const useEnhanceFormSubmission = ({ formElement, formData, action, cancel, submitter }) => {
	// `formElement` is this `<form>` element
	// `formData` is its `FormData` object that's about to be submitted
	// `action` is the URL to which the form is posted
	// calling `cancel()` will prevent the submission
	// `submitter` is the `HTMLElement` that caused the form to be submitted
	const formLoader = document.getElementById('form-loader') as HTMLDialogElement;
	if (formLoader) {
		formLoader.showModal();
	}

	return async ({ result, update }) => {
		// `result` is an `ActionResult` object
		// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set

		update();

		if (formLoader) {
			formLoader.close();
		}
	};
};
