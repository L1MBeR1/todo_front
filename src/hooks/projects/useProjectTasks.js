import { useQuery } from '@tanstack/react-query'

import { projectService } from '../../services/projects'

const useProjectTasks = (id, completed = false) => {
	return useQuery({
		queryKey: [`project/${id}/tasks/${completed}`],
		queryFn: () => projectService.getProjectTasks(id, completed),
		staleTime: 600000,
		retry: 0
	})
}

export default useProjectTasks
