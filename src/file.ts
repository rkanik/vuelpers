export const isFile = (input: any) => {
	return Object.prototype.toString.call(input) === "[object File]";
};

export const toBase64 = (file: File) => {
	return new Promise((resolve) => {
		const fileReader = new FileReader();
		fileReader.addEventListener("load", (ev: ProgressEvent<FileReader>) => {
			resolve(ev?.target?.result);
		});
		fileReader.readAsDataURL(file);
	});
};

// export interface
export const createElement = (tag: string, attrs = {}) => {
	const el = document.createElement(tag);
	Object.entries(attrs).forEach(([attr, value]: [string, any]) => {
		el.setAttribute(attr, value);
		if (attr.startsWith("on")) {
			el.addEventListener(attr.substring(2), value);
		}
	});
	return el;
};

export const onFilePicked = async (e: any, config: any, callback: any) => {
	const images = await Promise.all(
		[...e.target.files].map(async (file) => ({
			file,
			src: config.base64 ? await toBase64(file) : URL.createObjectURL(file),
		}))
	);
	callback(config.multiple ? images : images[0]);
};

export const openFilePicker = (config: any = {}, callback: any) => {
	const {
		type = "file",
		multiple = false,
		accept = "image/x-png,image/gif,image/jpeg",
	} = config;
	createElement("input", {
		type,
		accept,
		multiple,
		onchange: (e: any) => {
			onFilePicked(e, config, callback);
		},
	}).click();
};
