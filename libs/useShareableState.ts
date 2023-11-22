"use client"
import { useState} from 'react';
export const useShareableState = () => {
    const [
        donateModal,
        setDonateModal,
    ] = useState<Boolean | false>(false);

    const [
        videoModal,
        setVideoModal,
    ] = useState<Boolean | false>(false);

    return {
        donateModal,
        setDonateModal,
        videoModal,
        setVideoModal
    };
};