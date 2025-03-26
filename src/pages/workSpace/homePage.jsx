import { useNavigate } from 'react-router-dom'

import { APP_PAGES } from '../../config/pageConfig'
import useMyProjects from '../../hooks/projects/useMyProjects'

export const HomePage = () => {
	const { data, isLoading } = useMyProjects()
	const navigate = useNavigate()
	return (
		<div className='p-8 flex flex-col gap-4 h-screen overflow-hidden w-full'>
			<h2 className='text-4xl font-medium'>Главная</h2>
			<div className='flex flex-col gap-2'>
				<h3 className='text-xl '>Мои проекты</h3>
				<div className='flex flex-col max-w-3xl gap-4'>
					{data?.map((project, index) => (
						<div
							key={project.id}
							className='p-4 border-1 rounded-md cursor-pointer hover:bg-default-200'
							onClick={() => {
								navigate(`${APP_PAGES.WORKSPACE.PROJECT}/${project.id}`)
							}}
						>
							<div className='flex items-center justify-between'>
								<h4 className='text-lg font-medium truncate max-w-[60%]'>
									{project.name}
								</h4>
								<span className='text-sm text-gray-500'>
									Последнее изменение:{' '}
									{new Date(project.updatedAt).toLocaleDateString()}
								</span>
							</div>

							{project.description && (
								<p className='mt-2 text-gray-600'>{project.description}</p>
							)}
						</div>
					))}

					{data?.length === 0 && (
						<div className='py-4 text-gray-500'>Нет доступных проектов</div>
					)}
				</div>
			</div>
		</div>
	)
}
