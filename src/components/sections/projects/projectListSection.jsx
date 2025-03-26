import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'

import { useProjectElements } from '../../../hooks/contexts/useProjectElements'
import { useDragAndDrop } from '../../../hooks/useDragAndDrop'
import { CreateGroup } from '../../projectComponents/createGroup'
import { ListGroup } from '../../projectComponents/listGroup'
import { ListTaskCard } from '../../projectComponents/listTaskCard'

export const ProjectListSection = ({ projectId }) => {
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

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			// collisionDetection={closestCorners}
		>
			<section
				className='flex flex-col w-full select-none grow p-8 overflow-y-auto pt-4'
				ref={setNodeRef}
			>
				<div className='flex flex-col max-w-4xl h-full space-y-4 max-h-full'>
					<SortableContext
						items={groups?.map(group => `group-${group.id}`)}
						strategy={verticalListSortingStrategy}
						// disabled={activeId?.startsWith('task-')}
					>
						{groups &&
							groups.map(group => (
								<ListGroup
									key={group.id}
									data={group}
									projectId={projectId}
									activeId={activeId}
									tasks={tasks[group.id] || []}
								/>
							))}
					</SortableContext>
					{createPortal(
						<DragOverlay className='opacity-85'>
							{!activeId ? null : activeId.startsWith('group-') ? (
								<ListGroup
									data={activeData}
									tasks={tasks[activeData.id] || []}
								/>
							) : (
								<ListTaskCard data={activeData} />
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
