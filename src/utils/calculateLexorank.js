export const lexorank = (prevPos, nextPos) => {
	const X = 1000000

	if (prevPos === null) {
		// Если предыдущей позиции нет (задача в начале), ставим минимальную позицию или немного меньше следующей
		const nextNum = parseInt(nextPos, 36)
		const newPos = Math.max(0, nextNum - X)
		return newPos.toString(36).padStart(8, '0')
	}

	if (nextPos === null) {
		// Если следующей позиции нет (задача в конце), увеличиваем предыдущую позицию на шаг X
		const prevNum = parseInt(prevPos, 36)
		const newPos = prevNum + X
		return newPos.toString(36).padStart(8, '0')
	}

	// Если обе позиции есть, рассчитываем позицию между ними
	const prevNum = parseInt(prevPos, 36)
	const nextNum = parseInt(nextPos, 36)
	const newPos = Math.floor((prevNum + nextNum) / 2) // Среднее значение между соседями

	return newPos.toString(36).padStart(8, '0')
}
