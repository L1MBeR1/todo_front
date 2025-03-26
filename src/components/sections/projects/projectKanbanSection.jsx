import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core'
import {
	SortableContext,
	horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'

import { useProjectElements } from '../../../hooks/contexts/useProjectElements'
import { useDragAndDrop } from '../../../hooks/useDragAndDrop'
import { KanbanTaskCard } from '../../projectComponents/KanbanTaskCard'
import { CreateGroup } from '../../projectComponents/createGroup'
import { Group } from '../../projectComponents/group'

export const ProjectKanbanSection = ({ projectId }) => {
	const { setNodeRef } = useDroppable({
		id: 'kanban'
	})

	const {
		sensors,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		activeId,
		activeData
	} = useDragAndDrop()

	const { groups, tasks } = useProjectElements()

	console.log(groups)
	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			// collisionDetection={closestCorners}
		>
			<section
				className='flex flex-col w-full select-none grow p-8 overflow-x-auto pt-4'
				ref={setNodeRef}
			>
				<div className='flex flex-row w-full h-full space-x-8 max-h-full'>
					<SortableContext
						items={groups?.map(group => `group-${group.id}`)}
						strategy={horizontalListSortingStrategy}
						// disabled={activeId?.startsWith('task-')}
					>
						{groups &&
							groups.map(group => {
								if (group.isDelete) return null

								return (
									<Group
										key={group.id}
										data={group}
										projectId={projectId}
										activeId={activeId}
										tasks={tasks[group.id] || []}
									/>
								)
							})}
					</SortableContext>
					{createPortal(
						<DragOverlay className='opacity-85'>
							{!activeId ? null : activeId.startsWith('group-') ? (
								<Group
									data={activeData}
									tasks={tasks[activeData.id] || []}
								/>
							) : (
								<KanbanTaskCard data={activeData} />
							)}
						</DragOverlay>,
						document.body
					)}
					<CreateGroup projectId={projectId} />
				</div>
			</section>
		</DndContext>
	)
}
