import { quizzes } from '../data/quizzes'

function Dashboard({
	student,
	onSignOut,
	onSelectQuiz,
	onOpenPlayground,
}) {
	return (
		<div className="min-h-screen bg-white">
			<header className="border-b border-gray-200">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
					<p className="font-medium">
						{student}
					</p>

					<button
						onClick={onSignOut}
						className="cursor-pointer text-sm text-gray-500 hover:text-black"
					>
						Sign Out
					</button>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-6 py-10">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-2xl font-semibold">
						Dashboard
					</h1>

					<button
						onClick={onOpenPlayground}
						className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
					>
						Go to Python Playground
					</button>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					<section>
						<h2 className="mb-4 text-lg font-medium">
							Quizzes
						</h2>

						<div className="space-y-3">
							{quizzes.map((quiz) => (
								<button
									key={quiz.id}
									onClick={() => onSelectQuiz(quiz)}
									className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-200 p-4 text-left hover:bg-gray-50"
								>
									<span className="font-medium">
										{quiz.title}
									</span>

									<span className="text-sm text-gray-400">
										{quiz.questions.length} questions
									</span>
								</button>
							))}
						</div>
					</section>

					<section>
						<h2 className="mb-4 text-lg font-medium">
							Practice
						</h2>

						<div className="rounded-md border border-gray-200 p-5">
							<p className="text-sm text-gray-500">
								Practice questions will appear here.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	)
}

export default Dashboard