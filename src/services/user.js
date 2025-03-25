import { axiosWithAuth } from '../api/interceptors'

class UserService {
	BASE_URL = '/users'

	async getMyProfile() {
		const response = await axiosWithAuth.get(`${this.BASE_URL}/me`)
		return response.data
	}
}

export const userService = new UserService()
