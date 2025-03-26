import { Button, Input, Link } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { APP_PAGES } from '../../../config/pageConfig'
import { authService } from '../../../services/auth'
import { ErrorAlert } from '../../alerts/alert'
import { PasswordInput } from '../../inputs/passwordInput'

export const LoginForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm()

	const [loading, setLoading] = useState(false)
	const [authError, setAuthError] = useState(null)
	const navigate = useNavigate()

	const { mutate } = useMutation({
		mutationKey: ['login'],
		mutationFn: data => authService.login(data),
		onMutate() {
			setLoading(true)
			setAuthError(null)
		},
		onSuccess() {
			navigate(APP_PAGES.WORKSPACE.HOME)
			reset()
		},
		onError(error) {
			setAuthError({
				title: 'Ошибка авторизации',
				description:
					error.response?.data?.message || 'Неверный email или пароль'
			})
		},
		onSettled() {
			setLoading(false)
		}
	})

	const onSubmit = data => {
		if (data.password.length < 6) {
			setAuthError({
				title: 'Ошибка валидации',
				description: 'Пароль должен содержать минимум 6 символов'
			})
			return
		}
		mutate(data)
	}

	return (
		<div className='flex flex-col gap-5 max-w-xs w-full items-center'>
			<h2 className='text-2xl font-semibold'>Войти в аккаунт</h2>

			{authError && (
				<ErrorAlert
					title={authError.title}
					description={authError.description}
				/>
			)}

			<form
				className='flex flex-col gap-4 w-full'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Input
					label='Почта'
					size={'md'}
					type='email'
					variant={'bordered'}
					isInvalid={!!errors.email}
					errorMessage={errors.email?.message}
					isDisabled={loading}
					radius={'sm'}
					{...register('email', {
						required: 'Почта обязательна',
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: 'Некорректный email'
						}
					})}
				/>

				<PasswordInput
					label='Пароль'
					register={register}
					registerName='password'
					size={'md'}
					radius={'sm'}
					variant={'bordered'}
					isInvalid={!!errors.password}
					errorMessage={errors.password?.message}
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
					isLoading={loading}
					fullWidth
				>
					Войти
				</Button>
			</form>

			<div className='flex flex-col items-center gap-0.5'>
				<p>Ещё нет аккаунта?</p>
				<Link
					href={APP_PAGES.REGISTER}
					isDisabled={loading}
					color='default'
					underline='always'
					showAnchorIcon
				>
					Создать
				</Link>
			</div>
		</div>
	)
}
