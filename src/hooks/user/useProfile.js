import { useQuery } from '@tanstack/react-query'

import { userService } from '../../services/user'

const useProfile = () => {
	return useQuery({
		queryKey: [`profile`],
		queryFn: () => userService.getMyProfile(),
		staleTime: 600000,
		retry: 0
	})
}

export default useProfile
