import { useState } from 'react'

function Quiz({ quiz, onExit }) {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState({})
	const [submitted, setSubmitted] = useState(false)

	const question = quiz.questions[currentQuestion]

	function selectAnswer(answer) {
		setAnswers({
			...answers,
			[question.id]: answer,
		})
	}

	function handleNext() {
		if (currentQuestion < quiz.questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1)
		}
	}

	function handleBack() {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1)
		}
	}

	function handleSubmit() {
		setSubmitted(true)
	}

	function getScore() {
		let score = 0

		quiz.questions.forEach((question) => {
			if (answers[question.id] === question.correctAnswer) {
				score++
			}
		})

		return score
	}

	if (submitted) {
		return (
			<div className="min-h-screen bg-white">
				<div className="mx-auto max-w-2xl px-6 py-12">
					<div className="mb-10">
						<h1 className="mb-2 text-2xl font-semibold">
							Quiz Complete
						</h1>

						<p className="text-gray-500">
							Score: {getScore()} / {quiz.questions.length}
						</p>
					</div>

					<div className="space-y-6">
						{quiz.questions.map((question, index) => {
							const studentAnswer = answers[question.id]
							const isCorrect = studentAnswer === question.correctAnswer

							return (
								<div
									key={question.id}
									className="rounded-md border border-gray-200 p-5"
								>
									<p className="mb-2 text-sm text-gray-500">
										Question {index + 1}
									</p>

									<h2 className="mb-4 font-medium">
										{question.question}
									</h2>

									<p className="mb-2 text-sm">
										Your answer:
									</p>

									<p className="mb-4">
										{studentAnswer !== undefined
											? String(studentAnswer)
											: 'No answer'}
									</p>

									<p
										className={`font-medium ${
											isCorrect
												? 'text-green-600'
												: 'text-red-600'
										}`}
									>
										{isCorrect ? 'Correct' : 'Incorrect'}
									</p>
								</div>
							)
						})}
					</div>

					<button
						onClick={onExit}
						className="mt-10 cursor-pointer rounded-md bg-black px-6 py-2 text-white"
					>
						Back to Dashboard
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="mx-auto max-w-2xl px-6 py-12">
				<div className="mb-10 flex items-center justify-between">
					<h1 className="text-xl font-semibold">
						{quiz.title}
					</h1>

					<p className="text-sm text-gray-500">
						Question {currentQuestion + 1} of {quiz.questions.length}
					</p>
				</div>

				<h2 className="mb-6 text-xl">
					{question.question}
				</h2>

				<div className="space-y-3">
					{question.options.map((option) => (
						<button
							key={String(option)}
							onClick={() => selectAnswer(option)}
							className={`w-full cursor-pointer rounded-md border p-4 text-left ${
								answers[question.id] === option
									? 'border-black bg-gray-100'
									: 'border-gray-200 hover:bg-gray-50'
							}`}
						>
							{String(option)}
						</button>
					))}
				</div>

				<div className="mt-10 flex justify-between">
					<button
						onClick={handleBack}
						disabled={currentQuestion === 0}
						className="cursor-pointer rounded-md border border-gray-300 px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Back
					</button>

					{currentQuestion === quiz.questions.length - 1 ? (
						<button
							onClick={handleSubmit}
							className="cursor-pointer rounded-md bg-black px-5 py-2 text-white"
						>
							Submit Quiz
						</button>
					) : (
						<button
							onClick={handleNext}
							className="cursor-pointer rounded-md bg-black px-5 py-2 text-white"
						>
							Next
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default Quiz