import { useNavigate } from 'react-router-dom'

import { APP_PAGES } from '../../config/pageConfig'

export const LogoHandler = ({ children }) => {
	const navigate = useNavigate()
	const handleNavigate = () => {
		navigate(APP_PAGES.HOME)
	}
	return (
		<div
			onClick={handleNavigate}
			className='w-fit cursor-pointer'
		>
			{children}
		</div>
	)
}
