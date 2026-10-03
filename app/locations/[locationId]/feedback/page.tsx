'use client'
// // Власник: Христина

import { useEffect } from "react";
import {useParams, useRouter } from "next/navigation"

export default function FeedbackPage() {
    const router = useRouter();
    const { locationId } = useParams<{ locationId: string }>()
    
    useEffect(() => {
        router.replace(`/locations/${locationId}`)
    }, [locationId, router])


    return null
}