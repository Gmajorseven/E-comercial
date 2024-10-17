import axios from "axios"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const ecomStore = (set) => ({
    user: null,
    token: null,
    actionLogin: async(form) => {
        const res = await axios.post('http://localhost:5000/api/login', form)
        set({
            user: res.data.payload,
            token: res.data.token
        })
        return res
    }
})

const useEcomStore = create(persist(ecomStore, { 
    name: 'ecom-store',
    storage: createJSONStorage(() => localStorage) 
}))

export default useEcomStore