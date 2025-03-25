import { Navigate, Route, Routes } from 'react-router-dom'

import { RegisterForm } from './components/forms/auth/registerForm'
import { APP_PAGES } from './config/pageConfig'
import { AuthLayout } from './layouts/authLayout'
import { MainLayout } from './layouts/mainLayout'
import { WorkSpaceLayout } from './layouts/workSpaceLayout'
import { LoginPage } from './pages/loginPage'
import { MainPage } from './pages/mainPage'
import { NotFoundPage } from './pages/notFoundPage'
import { HomePage } from './pages/workSpace/homePage'
import { ProjectPage } from './pages/workSpace/projectPage'

function App() {
	return (
		<Routes>
			//TODO: Написать пути из config
			<Route
				path='/'
				element={<MainLayout />}
			>
				<Route
					index
					element={<MainPage />}
				/>
			</Route>
			<Route
				path='404'
				element={<NotFoundPage />}
			/>
			<Route
				path='*'
				element={<Navigate to={APP_PAGES.NOT_FOUND} />}
			/>
			<Route
				path='/'
				element={<AuthLayout />}
			>
				<Route
					path='login'
					element={<LoginPage />}
				/>
				<Route
					path='register'
					element={<RegisterForm />}
				/>
			</Route>
			<Route
				path='/'
				element={<WorkSpaceLayout />}
			>
				<Route
					path='home'
					element={<HomePage />}
				/>
				<Route
					path='/project/:id'
					element={<ProjectPage />}
				/>
			</Route>
		</Routes>
	)
}

export default App
