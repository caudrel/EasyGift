import {
    useGetUserByTokenQuery,
    useRegisterWithTokenMutation,
} from '@/graphql/generated/schema'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getConstraints } from '@/lib/utils'
import Head from 'next/head'

export default function ConfirmParticipationPage() {
    const [errorMatchPassword, setErrorMatchPassword] = useState(false)
    const router = useRouter()

    const token = router.query.token as string

    const { data, loading, error } = useGetUserByTokenQuery({
        variables: {
            token,
        },
    })

    const [registerWithToken, { error: registerError }] =
        useRegisterWithTokenMutation({
            onCompleted: () => {
                router.push('/auth/login')
            },
        })

    if (!data || error) return <div>error</div>

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const data = Object.fromEntries(formData)

        const { password, confirmPassword } = data

        if (password !== confirmPassword) {
            setErrorMatchPassword(true)
            return
        }

        setErrorMatchPassword(false)

        registerWithToken({
            variables: {
                data: {
                    pseudo: data.pseudo as string,
                    password: data.password as string,
                    token,
                },
            },
        }).catch(console.error)
    }

    const errorMessages = getConstraints(
        registerError?.graphQLErrors[0]?.extensions?.validationErrors
    )

    return (
        <>
            <Head>
                <title>
                    Création de mon compte pour rejoindre un groupe - Easy Gift
                </title>
            </Head>
            <div className='min-h-screen flex flex-col mt-20 items-center'>
                <h1 className='text-xl lg:text-2xl 2xl:text-3xl font-bold text-primaryBlue mb-10'>
                    Créer un compte pour rejoindre un groupe
                </h1>
                <form
                    className='w-full max-w-lg bg-white p-8 rounded shadow-md mb-5'
                    onSubmit={handleSubmit}
                >
                    <div className='mb-4'>
                        <label
                            htmlFor='pseudo'
                            className='block mb-2 font-medium text-muted-foreground'
                        >
                            Pseudo
                        </label>
                        <Input
                            id='pseudo'
                            type='text'
                            name='pseudo'
                            className='w-full p-2 border rounded'
                            defaultValue={data.getUserByToken.pseudo}
                        />
                    </div>

                    <div className='mb-4'>
                        <label
                            htmlFor='password'
                            className='block mb-2 font-medium text-muted-foreground'
                        >
                            Mot de passe
                        </label>
                        <Input
                            id='password'
                            type='password'
                            name='password'
                            className='w-full p-2 border rounded'
                            placeholder='Indiquez votre mot de passe'
                            required
                        />
                    </div>

                    <div className='mb-4'>
                        <label
                            className='block mb-2 font-medium text-muted-foreground'
                            htmlFor='confirmPassword'
                        >
                            Confirmez votre mot de passe
                        </label>
                        <Input
                            id='confirmPassword'
                            type='password'
                            name='confirmPassword'
                            className='w-full p-2 border rounded'
                            placeholder='Confirmez votre mot de passe'
                            required
                        />
                    </div>

                    {errorMatchPassword && (
                        <p className='text-red-600'>
                            Les mots de passe ne correspondent pas
                        </p>
                    )}
                    <div className='mb-4'>
                        {errorMessages &&
                            errorMessages.map((item, index) =>
                                Object.values(item).map(
                                    (value: any, valueIndex) => (
                                        <p
                                            key={`${index}-${valueIndex}`}
                                            className='text-red-600 mt-2'
                                        >
                                            {value}
                                        </p>
                                    )
                                )
                            )}
                    </div>
                    <Button type='submit'>{"S'enregistrer"}</Button>
                </form>
            </div>
        </>
    )
}
