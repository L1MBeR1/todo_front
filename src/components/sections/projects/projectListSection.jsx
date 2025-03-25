import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'

import { useDragAndDrop } from '../../../hooks/useDragAndDrop'
import { KanbanTaskCard } from '../../projectComponents/KanbanTaskCard'
import { CreateGroup } from '../../projectComponents/createGroup'
import { ListGroup } from '../../projectComponents/listGroup'

export const ProjectListSection = ({ groups, projectId, tasks }) => {
	// const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
	// 	useDraggableScroll()
	const { setNodeRef } = useDroppable({
		id: 'kanban'
	})

	const {
		sensors,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		activeId,
		activeData,
		initialGroups,
		initialTasks
	} = useDragAndDrop({ groups, tasks })

	console.log(initialGroups)
	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			// collisionDetection={closestCorners}
		>
			<section
				className='flex flex-col w-full select-none grow overflow-y-auto pt-4'
				ref={setNodeRef}
			>
				<div className='flex flex-col w-full h-full space-y-8 max-h-full'>
					<SortableContext
						items={initialGroups?.map(group => `group-${group.id}`)}
						strategy={verticalListSortingStrategy}
						// disabled={activeId?.startsWith('task-')}
					>
						{initialGroups &&
							initialGroups.map(group => (
								<ListGroup
									key={group.id}
									data={group}
									projectId={projectId}
									activeId={activeId}
									tasks={initialTasks[group.id] || []}
								/>
							))}
					</SortableContext>
					{createPortal(
						<DragOverlay className='opacity-85'>
							{!activeId ? null : activeId.startsWith('group-') ? (
								<ListGroup
									data={activeData}
									tasks={initialTasks[activeData.id] || []}
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
