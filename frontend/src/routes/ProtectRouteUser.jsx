import { useState, useEffect } from "react"
import useEcomStore from "../store/ecom-store"
import { currentUser } from "../api/auth"
import LoadingtoRedirect from './LoadingtoRedirect'

const ProtectRouteUser = ({ element }) => {
    const [okay, setOkay] = useState(false)
    const user = useEcomStore((c) => c.user)
    const token = useEcomStore((c) => c.token)
      
    useEffect(() => {
      if(user && token) {
          currentUser(token)
          .then((res) => setOkay(true))
          .catch((error) => setOkay(false))
      }
    },[])
  
    return okay ? element : <LoadingtoRedirect />
}

export default ProtectRouteUser