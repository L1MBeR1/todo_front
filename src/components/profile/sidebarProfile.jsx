import { Avatar } from '@heroui/react'

export const SidebarProfile = () => {
	return (
		<div className='flex flex-row'>
			<Avatar />
			<div className='flex flex-col gap-1 '>
				<p>username</p>
				<p>email</p>
			</div>
		</div>
	)
}
