import React from 'react'
import Title from '../components/CommonComponents/Title'
import Input from '../components/FormComponents/Input'
import Button from '../components/FormComponents/Button'
import Google from '../components/FormComponents/GoogleButton'
import FormFooter from '../components/FormComponents/FormFooter'


function Login() {
  return (
    <>
      <Title titleName="Login" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md border border-gray-300 bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-6">
            <form action="#" method="POST" className="space-y-4">
              <div>
                <Input label="Email address" type="email" name="email" id="email" autoComplete="email" required={true} />
              </div>

              <div>
                <Input label="Password" type="password" name="password" id="password" autoComplete="current-password" required={true} />
              </div>

              <div>
                <Button label="Sign in" type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" />
              </div>
            </form>

            <Google />

            <FormFooter message="Don't have an account?" link="Sign up" url="/Register" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
