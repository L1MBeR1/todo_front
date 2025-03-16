import { useQuery } from '@tanstack/react-query'

import { projectService } from '../../services/projects'

const useProject = id => {
	return useQuery({
		queryKey: [`project/${id}`],
		queryFn: () => projectService.getProjectData(id),
		staleTime: 600000,
		retry: 0
	})
}

export default useProject
