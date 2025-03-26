import { useQuery } from '@tanstack/react-query'

import { colorService } from '../../services/color'

const useColors = () => {
	return useQuery({
		queryKey: [`colors`],
		queryFn: () => colorService.getColors(),
		staleTime: 600000,
		retry: 0
	})
}

export default useColors
