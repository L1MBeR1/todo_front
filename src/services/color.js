import { axiosWithAuth } from '../api/interceptors'

class ColorService {
	BASE_URL = '/colors'

	async getColors() {
		const response = await axiosWithAuth.get(`${this.BASE_URL}/`)
		return response.data
	}
}

export const colorService = new ColorService()
