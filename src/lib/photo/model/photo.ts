export interface Photo {
	name: string;
	data: ArrayBuffer;
}

export const PHOTO_SIZES = ['preview', 'medium', 'raw'];

export const previewDimensions = {
	width: 250,
	height: 250
};

export const mediumDimensions = {
	width: 500,
	height: 500
};

export function getPhotoSizeDimensions(
	photoSize: string
): { width: number; height: number } | null {
	switch (photoSize) {
		case 'preview':
			return previewDimensions;
		case 'medium':
			return mediumDimensions;
		default:
			return null;
	}
}
