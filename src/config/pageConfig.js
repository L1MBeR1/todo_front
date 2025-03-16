class PAGES {
	// Гостевые страницы
	HOME = '/'
	NOT_FOUND = '/404'

	// Страницы авторизации
	LOGIN = '/login'
	REGISTER = '/register'

	// Страницы рабочего пространства
	WORKSPACE = {
		HOME: '/home',
		PROJECT: '/project'
	}
}

export const APP_PAGES = new PAGES()
