import { DatePicker, addToast } from '@heroui/react'
import { parseDate } from '@internationalized/date'
import { useMutation } from '@tanstack/react-query'
import { CalendarDays, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { groupService } from '../../services/groups'

export const DrawerDatePicker = ({ selectedDate }) => {
	const [date, setDate] = useState(null)
	const [isPastDue, setIsPastDue] = useState(false)
	const { drawerContent, setDrawerContent } = useDrawer()
	const { updateTask } = useProjectElements()
	const [inputTimeout, setInputTimeout] = useState(null)

	const checkIfPastDue = dateObj => {
		if (!dateObj) return false
		const today = new Date()
		const dueDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
		return dueDate < new Date(today.setHours(0, 0, 0, 0))
	}

	useEffect(() => {
		if (selectedDate) {
			try {
				const dateString = selectedDate.split('T')[0]
				const parsedDate = parseDate(dateString)
				setDate(parsedDate)
				setIsPastDue(checkIfPastDue(parsedDate))
			} catch (e) {
				console.error('Invalid date format:', selectedDate)
				setDate(null)
				setIsPastDue(false)
			}
		} else {
			setDate(null)
			setIsPastDue(false)
		}
	}, [selectedDate])

	const updateTaskMutation = useMutation({
		mutationKey: ['update-task-date'],
		mutationFn: newDate => {
			const dueDate = newDate
				? new Date(
						Date.UTC(newDate.year, newDate.month - 1, newDate.day, 0, 0, 0, 0)
					).toISOString()
				: null

			console.log(dueDate)
			return groupService.updateTask(
				drawerContent.id,
				drawerContent.kanbanGroupId,
				{
					title: drawerContent.title,
					dueDate
				}
			)
		},
		onSuccess(data) {
			updateTask(data.kanbanGroupId, data.id, { dueDate: data.dueDate })
			setDrawerContent(prev => ({
				...prev,
				dueDate: data.dueDate
			}))
		},
		onError() {
			addToast({ title: 'Ошибка при обновлении даты задачи', color: 'danger' })
			if (selectedDate) {
				try {
					const dateString = selectedDate.split('T')[0]
					setDate(parseDate(dateString))
				} catch (e) {
					setDate(null)
				}
			} else {
				setDate(null)
			}
		}
	})

	const handleDateChange = newDate => {
		setDate(newDate)

		if (inputTimeout) {
			clearTimeout(inputTimeout)
		}

		const timeout = setTimeout(() => {
			if (newDate && newDate.year && newDate.month && newDate.day) {
				updateTaskMutation.mutate(newDate)
			}
		}, 800)

		setInputTimeout(timeout)
	}
	return (
		<DatePicker
			className='drawerElement'
			selectorButtonPlacement='start'
			showMonthAndYearPickers
			color='default'
			size='sm'
			radius='sm'
			selectorButtonProps={{ radius: 'sm' }}
			selectorIcon={<CalendarDays size={18} />}
			endContent={
				isPastDue && (
					<div className='text-danger'>
						<Flame size={18} />
					</div>
				)
			}
			classNames={{
				selectorIcon: 'text-foreground',
				popoverContent: 'drawerElement'
			}}
			value={date}
			onChange={handleDateChange}
			isDisabled={updateTaskMutation.isPending}
			aria-label='Выберите дату'
		/>
	)
}
