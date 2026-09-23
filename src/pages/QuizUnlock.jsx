import { useState } from 'react'

function QuizUnlock({ quiz, onBack, onUnlock }) {
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	function handleSubmit(event) {
		event.preventDefault()

		if (password !== quiz.password) {
			setError('Incorrect password.')
			return
		}

		setError('')
		onUnlock()
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="mx-auto max-w-md px-6 py-12">
				<button
					onClick={onBack}
					className="mb-8 cursor-pointer text-sm text-gray-500 hover:text-black"
				>
					← Back
				</button>

				<h1 className="mb-2 text-2xl font-semibold">
					{quiz.title}
				</h1>

				<p className="mb-6 text-sm text-gray-500">
					Enter the quiz password to continue.
				</p>

				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder="Quiz password"
						className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
					/>

					{error && (
						<p className="mt-2 text-sm text-red-600">
							{error}
						</p>
					)}

					<button
						type="submit"
						className="mt-4 w-full cursor-pointer rounded-md bg-black px-4 py-2 text-white"
					>
						Unlock Quiz
					</button>
				</form>
			</div>
		</div>
	)
}

export default QuizUnlock