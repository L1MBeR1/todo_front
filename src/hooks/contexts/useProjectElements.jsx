import { useContext } from 'react'

import { ProjectContext } from '../../contexts/projectContext'

export const useProjectElements = () => {
	const context = useContext(ProjectContext)
	if (!context) {
		throw new Error('useProjectElements must be used within a ProjectProvider')
	}
	return context
}
