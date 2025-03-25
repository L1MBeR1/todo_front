import { ProjectContext } from '../contexts/projectContext'

export const ProjectProvider = ({ children }) => {
	return (
		<ProjectContext.Provider value={{}}>{children}</ProjectContext.Provider>
	)
}
