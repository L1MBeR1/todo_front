import {
	differenceInDays,
	format,
	isToday,
	isTomorrow,
	isYesterday,
	startOfDay
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { Flame } from 'lucide-react'
import React from 'react'

export const TaskDate = ({ date }) => {
	const now = startOfDay(new Date())
	const targetDate = startOfDay(new Date(date))
	const formatDate = () => {
		if (isToday(targetDate)) return 'Сегодня'
		if (isTomorrow(targetDate)) return 'Завтра'
		if (isYesterday(targetDate)) return 'Вчера'
		if (differenceInDays(targetDate, now) === 2) return 'Послезавтра'
		if (differenceInDays(targetDate, now) === -2) return 'Позавчера'

		const diff = differenceInDays(targetDate, now)

		if (diff > 2 && diff < 5) return `Через ${diff} дня`
		if (diff < -2 && diff > -5) return `${Math.abs(diff)} дня назад`

		return format(targetDate, 'd MMM', { locale: ru })
	}

	const isPast = targetDate < now

	return (
		<div className={`${isPast ? 'text-red-500' : ''} flex flex-row gap-1`}>
			<p className='text-[13px]'>{formatDate()}</p>
			{isPast && <Flame size={18} />}
		</div>
	)
}
