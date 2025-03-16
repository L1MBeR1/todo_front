import { Button, Input } from '@heroui/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function PasswordInput({
	label,
	placeholder,
	size,
	variant,
	register,
	registerName,
	rules,
	isInvalid,
	errorMessage,
	disabled
}) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible)
	}

	return (
		<Input
			label={label}
			placeholder={placeholder}
			type={isPasswordVisible ? 'text' : 'password'}
			variant={variant}
			size={size}
			isDisabled={disabled}
			endContent={
				<div className='flex h-full justify-center items-center'>
					<Button
						isIconOnly
						size={'sm'}
						variant='light'
						onPress={togglePasswordVisibility}
						aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
					>
						{isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
					</Button>
				</div>
			}
			isInvalid={isInvalid}
			errorMessage={errorMessage}
			{...register(registerName, rules)}
		/>
	)
}
