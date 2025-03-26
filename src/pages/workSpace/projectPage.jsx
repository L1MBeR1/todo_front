import { useNavigate, useParams } from 'react-router-dom'

import { ProjectMainSection } from '../../components/sections/projects/projectMainSection'
import { APP_PAGES } from '../../config/pageConfig'
import useProject from '../../hooks/projects/useProject'
import { DrawerProvider } from '../../providers/drawerProvider'

export const ProjectPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	// console.log(id)
	const { data, isError } = useProject(id)

	if (isError) {
		navigate(APP_PAGES.NOT_FOUND)
	}
	return (
		<DrawerProvider>
			<ProjectMainSection
				projectId={id}
				projectData={data}
			/>
		</DrawerProvider>
	)
}
