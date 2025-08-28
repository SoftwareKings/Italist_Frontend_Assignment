"use client"

import { useState } from "react"
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"

export default function HeartButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button
        onClick={() => setLiked(!liked)}
        className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#DEEEDF] transition"
    >
        {liked ? (
            <HeartSolid className="w-5 h-5 text-red-500 stroke-red [stroke-width:1.5]" /> 
        ) : (
            <HeartOutline className="w-5 h-5 text-gray-700 stroke-[#111111] [stroke-width:1.5]" />
        )}
    </button>
   )

}
