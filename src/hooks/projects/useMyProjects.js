import { useQuery } from '@tanstack/react-query'

import { projectService } from '../../services/projects'

const useMyProjects = () => {
	return useQuery({
		queryKey: ['my-projects'],
		queryFn: () => projectService.getMyProjects(),
		staleTime: 600000,
		retry: 0
	})
}

export default useMyProjects
