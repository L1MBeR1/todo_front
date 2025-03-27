import { DatePicker, addToast } from '@heroui/react'
import { CalendarDateTime, parseDate } from '@internationalized/date'
import { useMutation } from '@tanstack/react-query'
import { CalendarDays, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { groupService } from '../../services/groups'

export const DrawerDatePicker = ({ selectedDate }) => {
	const [date, setDate] = useState(null)
	const [isPastDue, setIsPastDue] = useState(false)
	const [inputTimeout, setInputTimeout] = useState(null)
	const { drawerContent, setDrawerContent } = useDrawer()
	const { updateTask } = useProjectElements()
	const checkIfPastDue = dateObj => {
		if (!dateObj) return false
		const now = new Date()
		let dueDate

		if ('hour' in dateObj) {
			dueDate = new Date(
				dateObj.year,
				dateObj.month - 1,
				dateObj.day,
				dateObj.hour,
				dateObj.minute
			)
		} else {
			dueDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
		}

		return dueDate < now
	}

	useEffect(() => {
		if (selectedDate) {
			try {
				let parsedDate

				if (selectedDate.includes('T')) {
					const [datePart, timePart] = selectedDate.split('T')
					const [year, month, day] = datePart.split('-').map(Number)
					const [hours = 0, minutes = 0] = timePart.split(':').map(Number)

					parsedDate = new CalendarDateTime(year, month, day, hours, minutes)
				} else {
					parsedDate = parseDate(selectedDate)
				}

				setDate(parsedDate)
				setIsPastDue(checkIfPastDue(parsedDate))
			} catch (e) {
				console.error('Invalid date format:', selectedDate, e)
				setDate(null)
				setIsPastDue(false)
			}
		} else {
			setDate(null)
			setIsPastDue(false)
		}
	}, [selectedDate])

	const updateTaskMutation = useMutation({
		mutationFn: async newDate => {
			if (!drawerContent.id || !drawerContent.kanbanGroupId) {
				throw new Error('Не указаны id или kanbanGroupId')
			}

			const dueDate = newDate
				? `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(
						newDate.day
					).padStart(
						2,
						'0'
					)}T${String(newDate.hour ?? 0).padStart(2, '0')}:${String(
						newDate.minute ?? 0
					).padStart(2, '0')}:00`
				: null

			return groupService.updateTask(
				drawerContent.id,
				drawerContent.kanbanGroupId,
				{
					dueDate
				}
			)
		},
		onSuccess: data => {
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
		onError: error => {
			console.error('Ошибка при обновлении даты:', error)
			addToast({
				title: 'Ошибка при обновлении даты задачи',
				description: error.message,
				color: 'danger'
			})
			if (selectedDate) {
				try {
					if (selectedDate.includes('T')) {
						const [datePart, timePart] = selectedDate.split('T')
						const [year, month, day] = datePart.split('-').map(Number)
						const [hours = 0, minutes = 0] = timePart.split(':').map(Number)
						setDate(new CalendarDateTime(year, month, day, hours, minutes))
					} else {
						setDate(parseDate(selectedDate))
					}
				} catch (e) {
					setDate(null)
				}
			}
		}
	})

	const handleDateChange = newDate => {
		setDate(newDate)
		setIsPastDue(checkIfPastDue(newDate))

		if (inputTimeout) {
			clearTimeout(inputTimeout)
		}

		const timeout = setTimeout(() => {
			if (newDate) {
				updateTaskMutation.mutate(newDate)
			} else {
				updateTaskMutation.mutate(null)
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
			hourCycle={24}
			granularity='minute'
			hideTimeZone
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
			aria-label='Выберите дату и время'
		/>
	)
}
