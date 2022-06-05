import React from "react";
import LocalVideo from "./LocalVideo";
import "./LocalVideo.css"

const LocalVideoContainer = ({ etudiant, width, height,stream,setStream}) => {
    return(
        <div className={'video-grid__item'}>
            <div className="usernameTitle">
                <h1>{etudiant.lastName +" "+etudiant.name}</h1>
            </div>
            <LocalVideo stream={stream} setStream={setStream} width={width} height={height} willCollapse={false} />
        </div>
    )
}
export default LocalVideoContainer