import { Alert } from '@heroui/react'

export function ErrorAlert({ title, description }) {
	return (
		<Alert
			title={title}
			description={description}
			color='danger'
			variant='faded'
			isClosable={true}
			classNames={{
				base: 'grow-0'
			}}
		/>
	)
}
