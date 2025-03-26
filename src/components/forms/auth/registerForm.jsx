import { Button, Input, Link } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import validator from 'validator'

import { APP_PAGES } from '../../../config/pageConfig'
import { authService } from '../../../services/auth'
import { ErrorAlert } from '../../alerts/alert'
import { PasswordInput } from '../../inputs/passwordInput'

export const RegisterForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		trigger,
		formState: { errors }
	} = useForm({ mode: 'onBlur' })

	const [loading, setLoading] = useState(false)
	const [authError, setAuthError] = useState(null)
	const navigate = useNavigate()

	const handleEmailBlur = async () => {
		await trigger('email')
	}

	const handlePasswordBlur = async () => {
		await trigger('password')
	}

	const { mutate } = useMutation({
		mutationKey: ['register'],
		mutationFn: data => authService.register(data),
		onMutate() {
			setLoading(true)
			setAuthError(null)
		},
		onSuccess() {
			navigate(APP_PAGES.WORKSPACE.HOME)
			reset()
		},
		onError(error) {
			const errorMessage = error.response?.data?.message || null
			setAuthError({
				title: 'Ошибка регистрации',
				description: errorMessage
			})
		},
		onSettled() {
			setLoading(false)
		}
	})

	const onSubmit = data => {
		mutate(data)
	}

	return (
		<div className='flex flex-col gap-5 max-w-xs w-full items-center'>
			<h2 className='text-2xl font-semibold'>Создать аккаунт</h2>

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
					size='md'
					type='email'
					radius='sm'
					variant='bordered'
					isInvalid={!!errors.email}
					errorMessage={errors.email?.message}
					isDisabled={loading}
					onBlur={handleEmailBlur}
					{...register('email', {
						required: 'Почта обязательна',
						validate: {
							isEmail: v => validator.isEmail(v) || 'Некорректный формат email'
						}
					})}
				/>

				<PasswordInput
					label='Пароль'
					register={register}
					registerName='password'
					size='md'
					radius='sm'
					variant='bordered'
					isInvalid={!!errors.password}
					errorMessage={errors.password?.message}
					disabled={loading}
					onBlur={handlePasswordBlur}
					rules={{
						required: 'Пароль обязателен',
						minLength: {
							value: 6,
							message: 'Минимум 6 символов'
						}
					}}
				/>

				<Button
					type='submit'
					radius='sm'
					color='primary'
					isLoading={loading}
					fullWidth
				>
					Создать аккаунт
				</Button>
			</form>

			<div className='flex flex-col items-center gap-0.5'>
				<p>Уже есть аккаунт?</p>
				<Link
					href={APP_PAGES.LOGIN}
					isDisabled={loading}
					color='default'
					underline='always'
					showAnchorIcon
				>
					Войти
				</Link>
			</div>
		</div>
	)
}
