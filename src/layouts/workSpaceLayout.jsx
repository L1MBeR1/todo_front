import { Outlet } from 'react-router-dom'

import { WorkSpaceSidebar } from '../components/sidebars/workspaceSidebar'

export const WorkSpaceLayout = () => {
	return (
		<main className='flex flex-row w-full h-screen'>
			<WorkSpaceSidebar />
			<Outlet />
		</main>
	)
}
