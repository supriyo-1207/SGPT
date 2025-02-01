import React from 'react'
import { Helmet } from 'react-helmet'
function Title({ titleName }) {
  return (
    <>
       <Helmet>
        <title>{titleName} | SGPT</title>
      </Helmet>
    </>
  )
}

export default Title
