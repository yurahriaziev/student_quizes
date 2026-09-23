import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const pyodideDir = dirname(fileURLToPath(import.meta.resolve('pyodide')))

export default defineConfig({
	base: '/student_quizes/',

	optimizeDeps: {
		exclude: ['pyodide'],
	},

	plugins: [
		react(),
		tailwindcss(),

		viteStaticCopy({
			targets: [
				{
					src: [
						join(pyodideDir, '*'),
						'!**/*.{md,html}',
						'!**/*.d.ts',
						'!**/*.whl',
						'!**/node_modules',
					],
					dest: 'assets',
				},
			],
		}),
	],
})