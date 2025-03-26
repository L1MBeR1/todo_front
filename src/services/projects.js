import { axiosWithAuth } from '../api/interceptors'

class ProjectService {
	BASE_URL = '/projects'

	async getMyProjects() {
		const response = await axiosWithAuth.get(`${this.BASE_URL}/`)
		return response.data
	}

	async getProjectData(id) {
		const response = await axiosWithAuth.get(`${this.BASE_URL}/${id}`)
		return response.data
	}

	async createProject(data) {
		const response = await axiosWithAuth.post(`${this.BASE_URL}`, data)
		return response.data
	}
	async updateProject(id, data) {
		const response = await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data)
		return response.data
	}

	async deleteProject(id) {
		const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
		return response
	}

	async getProjectGroups(id) {
		const response = await axiosWithAuth.get(`${this.BASE_URL}/${id}/groups`)
		return response.data
	}

	async getProjectDetails(id) {
		const response = await axiosWithAuth.get(`${this.BASE_URL}/${id}`)
		return response.data
	}

	async getProjectTasks(id, completed = false) {
		const response = await axiosWithAuth.get(
			`${this.BASE_URL}/${id}/tasks?completed=${completed}`
		)
		return response.data
	}

	async createGroup(id, data) {
		console.log(id, data)
		const response = await axiosWithAuth.post(
			`${this.BASE_URL}/${id}/groups`,
			data
		)
		return response.data
	}

	async deleteGroup(id, projectId) {
		const response = await axiosWithAuth.delete(
			`${this.BASE_URL}/${projectId}/groups/${id}`
		)
		return response.data
	}

	async deleteTask(id, projectId) {
		const response = await axiosWithAuth.delete(
			`${this.BASE_URL}/${projectId}/tasks/${id}`
		)
		return response
	}

	async updateGroup(id, projectId, data) {
		console.log(id, projectId, data)
		const response = await axiosWithAuth.put(
			`${this.BASE_URL}/${projectId}/groups/${id}`,
			{ ...data }
		)
		return response.data
	}
}

export const projectService = new ProjectService()
