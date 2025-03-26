import { useEffect, useState } from 'react'

import useProjectTasks from '../../hooks/projects/useProjectTasks'

export const CompleteCounter = ({ projectId }) => {
	const { data } = useProjectTasks(projectId, true)
	const [completedCount, setCompletedCount] = useState()

	useEffect(() => {
		if (data) {
			setCompletedCount(
				Object.values(data).reduce((count, tasks) => {
					return count + tasks.filter(task => task.completed).length
				}, 0)
			)
		}
	}, [data])

	return (
		<div className='flex items-center'>
			<p className='text-sm font-semibold mb-2'>Выполнено: {completedCount}</p>
		</div>
	)
}
