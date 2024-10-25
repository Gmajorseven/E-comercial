import { useState } from "react"
import React from 'react'
import { toast } from "react-toastify"
import Resize from 'react-image-file-resizer'
import { removeFiles, uploadFiles } from "../../api/Product"
import useEcomStore from "../../store/ecom-store"
import { Loader } from 'lucide-react'

const Uploadfile = ({ state, setState }) => {
    const [isLoading, setIsLoading] = useState(false)
    const token = useEcomStore((c) => c.token)

    const handleOnchange = (e) => {
        setIsLoading(true)


        const files = e.target.files
        if (files) {
            setIsLoading(true)
            let allFiles = state.images
            for (let i = 0; i < files.length; i++) {
                if (!files[i].type.startsWith('image/')) {
                    return toast.error(`File ${files[i].name} is not image`)
                    continue
                }
                Resize.imageFileResizer(
                    files[i],
                    720,
                    720,
                    'JPEG',
                    100,
                    0,
                    (images) => {
                        //backend endpoint ...
                        uploadFiles(token, images)
                            .then((res) => {
                                allFiles.push(res.data)
                                setState({
                                    ...state,
                                    images: allFiles
                                })
                                setIsLoading(false)
                                toast.success('Upload image success!')
                            })
                            .catch((error) => {
                                console.log(error)
                                setIsLoading(false)
                            })
                    },
                    'base64'
                )

            }
        }


    }

    const handleDelete = (public_id) => {
        const images = state.images
        removeFiles(token, public_id)
            .then((res) => {
                toast.success(res.data.msg)
                const filterImages = images.filter((item) => {
                    return item.public_id !== public_id
                })
                setState({
                    ...state,
                    images: filterImages
                })
            })
            .catch((error) => console.log(error))
    }

    return (
        <div className="my-4">

            <div className="flex mx-4 gap-10 my-4">
                {
                    isLoading && <Loader className="animate-spin w-16 h-16" /> 
                }
                
                {/* Image*/}
                {
                    state.images.map((item, index) =>
                        <div className="relative" key={index}>
                            <img
                                className="w-24 h-24 hover:scale-125 rounded-md"
                                src={item.url} />
                            <span className="absolute top-0 right-0 bg-red-500 p-1 rounded-md"
                                onClick={() => handleDelete(item.public_id)}
                            >X</span>
                        </div>
                    )
                }
            </div>
            <div>
                <input
                    onChange={handleOnchange}
                    type="file"
                    name='images'
                    multiple
                />
            </div>
        </div>
    )
}

export default Uploadfile