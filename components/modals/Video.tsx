import {useShareableState} from "@/libs/useShareableState"
import { useBetween } from "use-between";
import CloseIcon from '@/assets/icons/close.svg'
import YouTube from 'react-youtube';

export default function VideoModal() {
    const { setVideoModal } = useBetween(useShareableState);

    const opts = {
        playerVars: {
          autoplay: 1,
        },
    };

    return (
      <div className="modal">
        <div className="modal-overlay"></div>
        <div className="modal-container px-5">
            <div className="container">
                <div className="youtube-player-wrapper">
                    <YouTube className="position-absolute w-100 h-100" videoId="GvOT6RNDVg8" opts={opts} />
                </div>
            </div>
        </div>
        <div
            className="close-button rounded-circle bg-white"
            onClick={() => setVideoModal(false)}
        >
            <span className="symbol symbol-50px d-flex align-items-center justify-content-center">
                <CloseIcon className="h-40px w-40px" />
            </span>
        </div>
      </div>

    )
}
