import { axiosWithAuth } from '../api/interceptors'

class GroupService {
	BASE_URL = '/groups'

	async getGroupTasks(id) {
		const response = await axiosWithAuth.get(`${this.BASE_URL}/${id}/tasks`)
		return response.data
	}

	async createGroupTasks(id, data) {
		const response = await axiosWithAuth.post(
			`${this.BASE_URL}/${id}/tasks`,
			data
		)
		return response.data
	}
}

export const groupService = new GroupService()
