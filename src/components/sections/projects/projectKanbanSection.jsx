import { useRef } from 'react'

import { useDraggableScroll } from '../../../utils/useDraggableScroll '
import { CreateGroup } from '../../projectComponents/createGroup'
import { Group } from '../../projectComponents/group'

export const ProjectKanbanSection = ({ tasks, groups, projectId }) => {
	const scrollContainerRef = useRef(null)
	const {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleMouseLeave,
		isDragging
	} = useDraggableScroll()

	return (
		<section
			className={`flex flex-col w-full select-none grow px-8 pb-8 overflow-y-hidden overflow-x-auto z-0`}
			ref={scrollContainerRef}
			// onMouseDown={e => {
			// 	handleMouseDown(e, scrollContainerRef)
			// }}
			// onMouseMove={e => handleMouseMove(e, scrollContainerRef)}
			// onMouseUp={handleMouseUp}
			// onMouseLeave={handleMouseLeave}
		>
			<div className='flex flex-row w-full h-full space-x-8'>
				{groups &&
					groups
						.slice()
						.sort((a, b) => a.orderPosition.localeCompare(b.orderPosition))
						.map(group => (
							<Group
								key={group.id}
								data={group}
								projectId={projectId}
							/>
						))}
				<CreateGroup projectId={projectId} />
			</div>
		</section>
	)
}
