import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const LoadingtoRedirect = () => {
    const [count, setCount] = useState(3)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((c) => {
                if(c === 1) {
                    clearInterval(interval)
                    setRedirect(true)
                }
                return c - 1
            })
        }, 1000)
        
        return () => clearInterval(interval)
    }, [])

    if(redirect) {
        return <Navigate to={'/'} />
    }

    return (
    <div>No permistion, Redirect in {count}</div>
  )
}

export default LoadingtoRedirect