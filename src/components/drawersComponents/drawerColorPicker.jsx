import {
	Button,
	Divider,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
	addToast
} from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { Palette, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import useColors from '../../hooks/colors/useColors'
import { useDrawer } from '../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { groupService } from '../../services/groups'

export const DrawerColorPicker = ({ selectedColor }) => {
	const { drawerContent, setDrawerContent, isDrawerOpen } = useDrawer()
	const { updateTask } = useProjectElements()
	const { data: colors, isLoading } = useColors()
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const [currentColor, setCurrentColor] = useState(selectedColor)

	useEffect(() => {
		setCurrentColor(selectedColor)
	}, [selectedColor])

	useEffect(() => {
		if (!isDrawerOpen) {
			setIsPopoverOpen(false)
		}
	}, [isDrawerOpen])

	const updateColorMutation = useMutation({
		mutationKey: ['update-task-color'],
		mutationFn: colorId =>
			groupService.updateTask(drawerContent.id, drawerContent.kanbanGroupId, {
				title: drawerContent.title,
				colorId: colorId || null
			}),
		onSuccess(data) {
			updateTask(data.kanbanGroupId, data.id, {
				colorId: data.colorId,
				colorHashCode: data.colorHashCode
			})
			setDrawerContent(prev => ({
				...prev,
				colorId: data.colorId,
				colorHashCode: data.colorHashCode
			}))
		},
		onError() {
			addToast({ title: 'Ошибка при обновлении цвета', color: 'danger' })
			setCurrentColor(selectedColor)
		}
	})

	const handleColorSelect = colorId => {
		setCurrentColor(colorId)
		setIsPopoverOpen(false)
		updateColorMutation.mutate(colorId)
	}

	const handleRemoveColor = () => {
		setCurrentColor(null)
		updateColorMutation.mutate(null)
	}

	const selectedColorData = colors?.find(c => c.id === currentColor)

	return (
		<Popover
			placement='bottom'
			radius='sm'
			isOpen={isPopoverOpen}
			onOpenChange={setIsPopoverOpen}
			aria-label='Выберите цвет'
		>
			<PopoverTrigger>
				<div className='hover:bg-default-200 px-2 py-1.5 rounded-lg text-sm flex flex-row gap-1.5 cursor-pointer items-center'>
					{selectedColorData ? (
						<div
							className='w-4 h-4 rounded-md mr-1.5'
							style={{ backgroundColor: `#${selectedColorData.hashCode}` }}
						/>
					) : (
						<Palette size={16} />
					)}
					{selectedColorData?.name || 'Цвет'}
				</div>
			</PopoverTrigger>
			<PopoverContent className='p-2 drawerElement'>
				<div className='flex flex-col h-fit w-36 gap-2'>
					{isLoading ? (
						<div className='text-center py-4'>Загрузка цветов...</div>
					) : (
						<>
							<div className='grid grid-cols-4 gap-1.5'>
								{colors.map(color => (
									<Tooltip
										key={color.id}
										content={color.name}
										placement='bottom'
										radius='sm'
										color='foreground'
										closeDelay={300}
										showArrow
									>
										<div
											style={{ backgroundColor: `#${color.hashCode}` }}
											className={`aspect-square rounded-md cursor-pointer ${
												currentColor === color.id
													? 'ring-2 ring-offset-2 ring-primary'
													: ''
											}`}
											onClick={() => handleColorSelect(color.id)}
										/>
									</Tooltip>
								))}
							</div>

							{currentColor && (
								<>
									<Divider />
									<Button
										className='justify-start'
										variant='light'
										startContent={<X size={18} />}
										radius='sm'
										onPress={handleRemoveColor}
										isLoading={updateColorMutation.isPending}
									>
										Убрать цвет
									</Button>
								</>
							)}
						</>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
