'use client'

import {
	Listbox,
	ListboxItem,
	Popover,
	PopoverContent,
	PopoverTrigger,
	useDisclosure
} from '@heroui/react'
import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { DeleteProjectModal } from '../modals/projects/deleteProjectModal'
import { UpdateProjectModal } from '../modals/projects/updateProjectModal'

export const ProjectPopover = ({ children, data }) => {
	const [openAccountPopover, setOpenAccountPopover] = useState(false)
	console.log(data)
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onOpenChange: onOpenDeleteChange
	} = useDisclosure()
	const {
		isOpen: isUpdateOpen,
		onOpen: onUpdateOpen,
		onOpenChange: onOpenUpdateChange
	} = useDisclosure()
	return (
		<>
			<UpdateProjectModal
				isOpen={isUpdateOpen}
				onOpenChange={onOpenUpdateChange}
				id={data?.id}
				name={data?.name}
				description={data?.description}
			/>
			<DeleteProjectModal
				isOpen={isDeleteOpen}
				onOpenChange={onOpenDeleteChange}
				id={data?.id}
			/>
			<Popover
				shadow='md'
				radius='sm'
				placement='bottom-end'
				offset={12}
				showArrow={true}
				isOpen={openAccountPopover}
				onOpenChange={setOpenAccountPopover}
			>
				<PopoverTrigger>{children}</PopoverTrigger>
				<PopoverContent className='p-0.5'>
					<Listbox
						aria-label='Actions'
						onAction={() => {
							setOpenAccountPopover(false)
						}}
					>
						<ListboxItem
							key='settings'
							variant='flat'
							startContent={<Edit size={18} />}
							onPress={() => {
								onUpdateOpen()
							}}
						>
							Изменить
						</ListboxItem>

						<ListboxItem
							className='text-danger'
							key='delete'
							color='danger'
							variant='flat'
							startContent={<Trash2 size={18} />}
							onPress={() => {
								onDeleteOpen()
							}}
						>
							Удалить
						</ListboxItem>
					</Listbox>
				</PopoverContent>
			</Popover>
		</>
	)
}
