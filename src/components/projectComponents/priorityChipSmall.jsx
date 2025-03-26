import { Chip } from '@heroui/react'
import { Flag } from 'lucide-react'

export const PriorityChipSmall = ({ priority }) => {
	const getPriorityConfig = () => {
		switch (priority) {
			case 0:
				return {
					label: 'Низкий',
					color: 'secondary',
					show: true
				}
			case 2:
				return {
					label: 'Высокий',
					color: 'danger',
					show: true
				}
			default:
				return {
					show: false
				}
		}
	}

	const config = getPriorityConfig()

	if (!config.show) return null

	return (
		<Chip
			color={config.color}
			radius='full'
			variant='flat'
			className={`bg-${config.color}-100 border-1 border-${config.color}-200 aspect-square flex items-center justify-center`}
		>
			<Flag size={15} />
		</Chip>
	)
}
