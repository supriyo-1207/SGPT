import React from 'react'
import { Link } from 'react-router-dom'
function FormFooter({message, link, url}) {
    return (
        <>
        {/* dont have an account  */}
            <p className="mt-10 text-center text-sm/6 text-gray-500">
                {message}{' '}
                <Link to={url} className="font-semibold text-indigo-600 hover:text-indigo-500">
                    {link}
                </Link>
            </p>
        </>
    )
}

export default FormFooter
