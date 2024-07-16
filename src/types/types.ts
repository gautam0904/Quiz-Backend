export const Types = {
	// User
	UserService: Symbol.for('UserServices'),
	UserController: Symbol.for('UserController'),

	// QUESTION
	QuestionService: Symbol.for('QuestionService'),
	QuestionController: Symbol.for('QuestionController'),

	// QUIZ
	QuizService : Symbol.for('QuizService'),
	QuizController: Symbol.for('QuizController'),

	// paper
	PaperService : Symbol.for('PaperService'),
	PaperController: Symbol.for('PaperController'),

	// result
	ResultService: Symbol.for('ResultService'),
	ResultController: Symbol.for('ResultController'),

	//middleware
	Auth: Symbol.for('Auth'),
	Role: Symbol.for('Role')
}