import { Button, Divider, Input, Link } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { APP_PAGES } from '../../../config/pageConfig'
import { authService } from '../../../services/auth'
import { PasswordInput } from '../../inputs/passwordInput'

export const LoginForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm()

	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const queryClient = useQueryClient()

	const validatePassword = () => {
		if (password.length < 6) {
			return 'Пароль должен быть'
		}
		return null
	}

	const handlePasswordChange = newPassword => {
		setPassword(newPassword)
	}

	const { mutate } = useMutation({
		mutationKey: ['login'],
		mutationFn: data => authService.login(data),
		onMutate() {
			setLoading(true)
			// setError({ title: null, description: null })
		},
		onSuccess(response) {
			// if (!response.data.emailVerified) push(APP_PAGES.VERIFY_EMAIL)
			// else {
			// 	queryClient.refetchQueries({ queryKey: ['profile'], type: 'active' })
			// 	push(APP_PAGES.DASHBOARD.HOME)
			// 	addToast({
			// 		title: 'Успешный вход в аккаунт!',
			// 		color: 'success'
			// 	})
			// }
			// reset()
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
			<h2>Войти в аккаунт</h2>
			<form
				className='flex flex-col gap-3 w-full'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Input
					label='Почта'
					size={'md'}
					// placeholder='Введите почту'
					type='email'
					variant={'bordered'}
					isInvalid={!!errors.email}
					isDisabled={loading}
					radius={'sm'}
					{...register('email', { required: 'Почта обязательна' })}
				/>
				<PasswordInput
					label='Пароль'
					register={register}
					registerName='password'
					size={'md'}
					radius={'sm'}
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
					color='primary'
					radius='sm'
				>
					Войти
				</Button>
			</form>
			<Divider />
			<div className='flex flex-col'>
				<p>Ещё нет аккаунта?</p>
				<Link href={APP_PAGES.REGISTER}>Создать</Link>
			</div>
		</div>
	)
}
