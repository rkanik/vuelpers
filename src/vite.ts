import { ViteGlob } from './types'

type Import = {
	path: string
	name: string
	module: {
		default?: unknown
		[key: string]: unknown
	}
}
/**
 * @example
 * await importGlob(
 *    import.meta.glob('./components/base/*.vue'),
 *    import.meta.glob('./components/custom/*.vue')
 * )
 *
 * @param globs - import.meta.glob
 */
export const importGlob = (...globs: ViteGlob[]): Promise<Import[]> => {
	return new Promise((resolve) => {
		const loop = async () => {
			let i = 0
			const imports: Import[] = []
			for (const modules of globs) {
				for (const pathName in modules) {
					const module = await modules[pathName]()
					const fileName =
						pathName
							.replace(/^\.\/(.*)\.\w+$/, '$1')
							.split('/')
							.pop()
							?.split('.')
							.shift() || `name${i}`
					imports.push({
						path: pathName,
						name: fileName,
						module: module,
					})
					i += 1
				}
			}
			resolve(imports)
		}
		loop()
	})
}
