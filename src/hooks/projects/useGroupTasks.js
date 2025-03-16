import { useQuery } from '@tanstack/react-query'

import { groupService } from '../../services/groups'

const useGroupTasks = id => {
	return useQuery({
		queryKey: [`group/${id}/tasks`],
		queryFn: () => groupService.getGroupTasks(id),
		staleTime: 600000,
		retry: 0
	})
}

export default useGroupTasks
