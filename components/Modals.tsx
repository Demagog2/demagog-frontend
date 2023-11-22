"use client"
import { useRef } from 'react';
import DonateModal from './modals/Donate'
import VideoModal from './modals/Video'
import { CSSTransition } from 'react-transition-group';
import {useShareableState} from "@/libs/useShareableState"
import { useBetween } from "use-between";


export default function Modals() {
    const donateRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const { donateModal, videoModal } = useBetween(useShareableState);
    const isDonateOpen = donateModal ? true : false;
    const isVideoOpen = videoModal ? true : false;

    return (
      <div className="modals">
        <CSSTransition
            in={isDonateOpen}
            nodeRef={donateRef}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
            <div className="modal" ref={donateRef}>
                <DonateModal />
            </div>
        </CSSTransition>
        <CSSTransition
            in={isVideoOpen}
            nodeRef={videoRef}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
            <div className="modal" ref={videoRef}>
                <VideoModal />
            </div>
        </CSSTransition>
      </div>
    )
}