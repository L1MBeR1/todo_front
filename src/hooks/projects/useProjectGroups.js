import { useQuery } from '@tanstack/react-query'

import { projectService } from '../../services/projects'

const useProjectGroups = id => {
	return useQuery({
		queryKey: [`project/${id}/groups`],
		queryFn: () => projectService.getProjectGroups(id),
		staleTime: 600000,
		retry: 0
	})
}

export default useProjectGroups
