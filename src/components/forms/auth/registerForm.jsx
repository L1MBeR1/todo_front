import { Button, Divider, Input, Link } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import validator from 'validator'

import { APP_PAGES } from '../../../config/pageConfig'
import { authService } from '../../../services/auth'
import { PasswordInput } from '../../inputs/passwordInput'

export const RegisterForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		setError: setFormError,
		watch,
		formState: { errors }
	} = useForm()

	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()
	const email = watch('email')

	const handleEmailBlur = () => {
		console.log(email)
		if (!email) return
		const result = validator.isEmail(email)
		if (!result) {
			setFormError('email', {
				type: 'manual',
				message: 'Неправильный формат почты'
			})
		}
	}

	const { mutate } = useMutation({
		mutationKey: ['login'],
		mutationFn: data => authService.register(data),
		onMutate() {
			setLoading(true)
			// setError({ title: null, description: null })
		},
		onSuccess() {
			navigate(APP_PAGES.WORKSPACE.HOME)
			reset()
		},
		onError(error) {
			// console.log(error)
			// if (error?.response?.status === 422) {
			// 	setError({
			// 		title: 'Необходим другой способ входа',
			// 		description:
			// 			'Аккаунт создан через сервис. Восстановите пароль или войдите через сервис.'
			// 	})
			// 	return
			// }
			// if (error?.response?.status === 429) {
			// 	setError({
			// 		title: 'Слишком много запросов',
			// 		description: 'Вы превысили лимит запросов. Попробуйте снова позже.'
			// 	})
			// 	return
			// }
			// setError({
			// 	title: 'Ошибка авторизации',
			// 	description: 'Проверьте введенные данные и попробуйте снова.'
			// })
		},
		onSettled() {
			setLoading(false)
		}
	})

	const onSubmit = data => {
		mutate(data)
	}
	return (
		<div className='flex flex-col gap-4 max-w-xs w-full'>
			<h2>Создать аккаунт</h2>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Input
					label='Почта'
					size={'lg'}
					// placeholder='Введите почту'
					type='email'
					variant={'bordered'}
					isInvalid={!!errors.email}
					isDisabled={loading}
					onBlur={console.log('gfdfg')}
					errorMessage={errors.email?.message}
					// isInvalid={!!errors.email}
					{...register('email', { required: 'Почта обязательна' })}
				/>
				<PasswordInput
					label='Пароль'
					register={register}
					registerName='password'
					size={'lg'}
					variant={'bordered'}
					isInvalid={!!errors.password}
					disabled={loading}
					rules={{
						required: 'Пароль обязателен',
						minLength: {
							value: 6,
							message: 'Пароль должен содержать минимум 6 символов'
						}
					}}
				/>
				<Button
					type='submit'
					isLoading={loading}
				>
					Создать аккаунт
				</Button>
			</form>
			<Divider />
			<div className='flex flex-col'>
				<p>Уже есть аккаунт?</p>
				<Link
					href={APP_PAGES.LOGIN}
					isDisabled={loading}
				>
					Войти
				</Link>
			</div>
		</div>
	)
}
