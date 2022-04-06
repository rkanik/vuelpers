// Function to convert form data to object
export const formDataToObject = (formData: FormData): any => {
	const entries = formData.entries()
	const object: any = {}
	for (const [key, value] of entries) {
		object[key] = value
	}
	return object
}
