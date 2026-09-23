import { useState } from 'react'
import { students } from './data/students'
import Dashboard from './pages/Dashboard'
import QuizUnlock from './pages/QuizUnlock'
import Quiz from './pages/Quiz'
import PythonPlayground from './pages/PythonPlayground'

function App() {
	const [code, setCode] = useState('')
	const [student, setStudent] = useState(null)
	const [error, setError] = useState('')
	const [selectedQuiz, setSelectedQuiz] = useState(null)
	const [quizStarted, setQuizStarted] = useState(false)
	const [showPlayground, setShowPlayground] = useState(false)

	function handleLogin(event) {
		event.preventDefault()

		const name = students[code]

		if (!name) {
			setError('Invalid student code.')
			return
		}

		setStudent(name)
		setError('')
	}

	function handleSignOut() {
		setStudent(null)
		setCode('')
		setError('')
		setSelectedQuiz(null)
		setQuizStarted(false)
		setShowPlayground(false)
	}

	if (student && showPlayground) {
		return (
			<PythonPlayground
				onBack={() => setShowPlayground(false)}
			/>
		)
	}

	if (student && selectedQuiz && quizStarted) {
		return (
			<Quiz
				quiz={selectedQuiz}
				onExit={() => {
					setQuizStarted(false)
					setSelectedQuiz(null)
				}}
			/>
		)
	}

	if (student && selectedQuiz) {
		return (
			<QuizUnlock
				quiz={selectedQuiz}
				onBack={() => setSelectedQuiz(null)}
				onUnlock={() => {
					setQuizStarted(true)
				}}
			/>
		)
	}

	if (student) {
		return (
			<Dashboard
				student={student}
				onSignOut={handleSignOut}
				onSelectQuiz={setSelectedQuiz}
				onOpenPlayground={() => setShowPlayground(true)}
			/>
		)
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-white">
			<form
				onSubmit={handleLogin}
				className="w-full max-w-sm px-6"
			>
				<h1 className="mb-2 text-2xl font-semibold">
					Student Login
				</h1>

				<p className="mb-6 text-sm text-gray-500">
					Enter your student code to continue.
				</p>

				<input
					type="password"
					placeholder="Student code"
					value={code}
					onChange={(event) => setCode(event.target.value)}
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
					Enter
				</button>
			</form>
		</div>
	)
}

export default App