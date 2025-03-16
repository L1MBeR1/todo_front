import { useState } from 'react'

export const useDraggableScroll = () => {
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)

	const handleMouseDown = (e, containerRef) => {
		const container = containerRef.current
		if (!container) return

		setIsDragging(true)
		setStartX(e.pageX - container.offsetLeft)
		setScrollLeft(container.scrollLeft)
	}

	const handleMouseMove = (e, containerRef) => {
		if (!isDragging) return

		if (e.target.closest('.group')) {
			return
		}

		e.preventDefault()

		const container = containerRef.current
		if (!container) return

		const x = e.pageX - container.offsetLeft
		const walk = (x - startX) * 1.5
		container.scrollLeft = scrollLeft - walk
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleMouseLeave = () => {
		setIsDragging(false)
	}

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleMouseLeave,
		isDragging
	}
}
