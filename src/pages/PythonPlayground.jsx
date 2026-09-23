import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { loadPyodide } from 'pyodide'

function PythonPlayground({ onBack }) {
	const pyodideRef = useRef(null)
	const loadingRef = useRef(false)

	const [code, setCode] = useState('print("Hello Leo!")')
	const [output, setOutput] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isRunning, setIsRunning] = useState(false)

	useEffect(() => {
		async function startPyodide() {
			if (pyodideRef.current || loadingRef.current) {
				return
			}

			loadingRef.current = true

			try {
				const pyodide = await loadPyodide({
					indexURL: `${import.meta.env.BASE_URL}assets/`,
				})

				pyodideRef.current = pyodide
				setIsLoading(false)
			} catch (error) {
				console.error(error)
				setOutput('Failed to load Python.')
				setIsLoading(false)
			}
		}

		startPyodide()
	}, [])

	function handleEditorBeforeMount(monaco) {
		monaco.languages.registerCompletionItemProvider('python', {
			triggerCharacters: ['.', '('],

			provideCompletionItems(model, position) {
				const word = model.getWordUntilPosition(position)

				const range = {
					startLineNumber: position.lineNumber,
					endLineNumber: position.lineNumber,
					startColumn: word.startColumn,
					endColumn: word.endColumn,
				}

				const suggestions = [
					{
						label: 'print',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'print(${1:"Hello"})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Display something on the screen.',
						range,
					},
					{
						label: 'input',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'input(${1:"Enter something: "})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Ask the user to enter something.',
						range,
					},
					{
						label: 'len',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'len(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Get the length of a string or list.',
						range,
					},
					{
						label: 'range',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'range(${1:10})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Create a range of numbers.',
						range,
					},
					{
						label: 'int',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'int(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Convert a value into an integer.',
						range,
					},
					{
						label: 'str',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'str(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Convert a value into a string.',
						range,
					},
					{
						label: 'list',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'list(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Create a list.',
						range,
					},
					{
						label: 'for loop',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: 'for ${1:item} in ${2:items}:\n\t${3:print(item)}',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Loop through items.',
						range,
					},
					{
						label: 'while loop',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: 'while ${1:condition}:\n\t${2:pass}',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Repeat code while a condition is true.',
						range,
					},
					{
						label: 'if statement',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: 'if ${1:condition}:\n\t${2:print("True")}',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Run code when a condition is true.',
						range,
					},
					{
						label: 'if else',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText:
							'if ${1:condition}:\n\t${2:print("True")}\nelse:\n\t${3:print("False")}',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Run different code depending on a condition.',
						range,
					},
					{
						label: 'def',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText:
							'def ${1:function_name}(${2}):\n\t${3:pass}',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Create a function.',
						range,
					},
					{
						label: 'True',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: 'True',
						range,
					},
					{
						label: 'False',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: 'False',
						range,
					},
					{
						label: 'None',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: 'None',
						range,
					},
				]

				return {
					suggestions,
				}
			},
		})
	}

	async function runCode() {
		if (!pyodideRef.current || isRunning) {
			return
		}

		setOutput('')
		setIsRunning(true)

		let consoleOutput = ''

		pyodideRef.current.setStdout({
			batched: (text) => {
				consoleOutput += text + '\n'
				setOutput(consoleOutput)
			},
		})

		pyodideRef.current.setStderr({
			batched: (text) => {
				consoleOutput += text + '\n'
				setOutput(consoleOutput)
			},
		})

		try {
			const result = await pyodideRef.current.runPythonAsync(code)

			if (result !== undefined && result !== null) {
				consoleOutput += String(result)
				setOutput(consoleOutput)
			}
		} catch (error) {
			consoleOutput += error.message
			setOutput(consoleOutput)
		} finally {
			setIsRunning(false)
		}
	}

	function clearCode() {
		setCode('')
		setOutput('')
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="mx-auto max-w-5xl px-6 py-12">
				<button
					onClick={onBack}
					className="mb-8 cursor-pointer text-sm text-gray-500 hover:text-black"
				>
					← Back to Dashboard
				</button>

				<h1 className="text-2xl font-semibold">
					Python Playground
				</h1>

				<p className="mt-2 text-sm text-gray-500">
					Write and run Python code directly in your browser.
				</p>

				<div className="mt-8 overflow-hidden rounded-md border border-gray-300">
					<Editor
						height="400px"
						language="python"
						theme="vs-light"
						value={code}
						beforeMount={handleEditorBeforeMount}
						onChange={(value) => setCode(value || '')}
						options={{
							fontSize: 14,
							tabSize: 4,
							insertSpaces: false,
							minimap: {
								enabled: false,
							},
							scrollBeyondLastLine: false,
							automaticLayout: true,
							quickSuggestions: {
								other: true,
								comments: false,
								strings: false,
							},
							suggestOnTriggerCharacters: true,
							wordBasedSuggestions: 'currentDocument',
							lineNumbers: 'on',
							folding: false,
							padding: {
								top: 16,
								bottom: 16,
							},
						}}
					/>
				</div>

				<div className="mt-4 flex gap-3">
					<button
						onClick={runCode}
						disabled={isLoading || isRunning}
						className="cursor-pointer rounded-md bg-black px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
					>
						{isLoading
							? 'Loading Python...'
							: isRunning
								? 'Running...'
								: 'Run Code'}
					</button>

					<button
						onClick={clearCode}
						className="cursor-pointer rounded-md border border-gray-300 px-5 py-2 text-sm"
					>
						Clear
					</button>
				</div>

				<div className="mt-8">
					<p className="mb-2 text-sm font-medium">
						Output
					</p>

					<pre className="min-h-32 whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm">
						{output || 'Your output will appear here.'}
					</pre>
				</div>
			</div>
		</div>
	)
}

export default PythonPlayground