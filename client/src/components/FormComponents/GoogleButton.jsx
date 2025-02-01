import React from 'react'
import GoogleIcon from '@mui/icons-material/Google';
function GoogleButton() {
  return (
    <>
    {/* or continue with */}
      <div className="mt-6">
      <div className="relative flex items-center justify-center">
        <span className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-px bg-gray-300"></span>
        <span className="bg-white px-3 text-sm font-medium text-gray-500">or</span>
      </div>
      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
      >
        <GoogleIcon /> Continue with Google
      </button>
    </div>
    </>
  )
}

export default GoogleButton