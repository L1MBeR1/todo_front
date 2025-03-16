'use client'

import {
	Listbox,
	ListboxItem,
	Popover,
	PopoverContent,
	PopoverTrigger,
	useDisclosure
} from '@heroui/react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import DeleteGroupModal from '../modals/projects/deleteGroupModal'

export const GroupPopover = ({ children, id, projectId, name }) => {
	const [openAccountPopover, setOpenAccountPopover] = useState(false)

	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<>
			<DeleteGroupModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				id={id}
				projectId={projectId}
				name={name}
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
							className='text-danger'
							key='settings'
							color='danger'
							variant='flat'
							startContent={<Trash2 size={18} />}
							onPress={() => {
								onOpen()
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
