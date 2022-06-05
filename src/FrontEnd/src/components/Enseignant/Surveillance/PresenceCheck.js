import React from "react";
import StudentsList from "./StudentsList";
import StudentsSwiper from "./StudentsSwiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    EffectCube, 
    HashNavigation, 
    Keyboard,
    Navigation,
    Pagination
} from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import presenceCheck from "./PresenceCheck.module.css"



const PresenceCheck = ({socket, code, session, ListEtudiant, setListEtudiant,peers,setPeers} ) => {

    SwiperCore.use([Keyboard,Navigation,Pagination,HashNavigation,EffectCube])

    const navigateRef = React.useRef(null);

    
    

    return (
        <div className={presenceCheck.container}>

          

            <div className={presenceCheck.main}>
                
                

                <Swiper
                    key={1}
                    ref={navigateRef}
                    effect={"cube"}
                    initialSlide={1}
                    cubeEffect={{
                        shadow: false,
                        slideShadows: false,
                        shadowOffset: 5,
                        shadowScale: 0.94,
                    }}
                    modules={[EffectCube]}
                    className="mySwiper"
                    allowTouchMove={false}
                    preventClicksPropagation={false}
                    preventClicks={false}
                    enabled={false}


                >
                    <SwiperSlide>
                        <div>
                                <StudentsList
                                    students={ListEtudiant}
                                    setStudents={setListEtudiant}
                                    navigateRef={navigateRef}
                                    socket={socket}
                                    code={code}
                                    session={session}
                                    peers={peers}
                                    setPeers={setPeers}
                                />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <StudentsSwiper
                            students={ListEtudiant}
                            setStudents={setListEtudiant}
                            navigateRef={navigateRef}
                            socket={socket}
                            code={code}
                            session={session}
                            peers={peers}
                            setPeers={setPeers}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                                <StudentsList
                                    students={ListEtudiant}
                                    setStudents={setListEtudiant}
                                    navigateRef={navigateRef}
                                    socket={socket}
                                    code={code}
                                    session={session}
                                    peers={peers}
                                    setPeers={setPeers}
                                />
                        </div>
                    </SwiperSlide>
                    
                </Swiper>
                <svg style={{display: "none"}}  >
                    <defs>
                        <symbol id="icon-arrow-left" viewBox="0 0 32 32">
                            <title>arrow-left</title>
                            <path
                                d="M0.704 17.696l9.856 9.856c0.896 0.896 2.432 0.896 3.328 0s0.896-2.432 0-3.328l-5.792-5.856h21.568c1.312 0 2.368-1.056 2.368-2.368s-1.056-2.368-2.368-2.368h-21.568l5.824-5.824c0.896-0.896 0.896-2.432 0-3.328-0.48-0.48-1.088-0.704-1.696-0.704s-1.216 0.224-1.696 0.704l-9.824 9.824c-0.448 0.448-0.704 1.056-0.704 1.696s0.224 1.248 0.704 1.696z"
                            ></path>
                        </symbol>
                        <symbol id="icon-arrow-right" viewBox="0 0 32 32">
                            <title>arrow-right</title>
                            <path
                                d="M31.296 14.336l-9.888-9.888c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.824 5.856h-21.536c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.856 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.664z"
                            ></path>
                        </symbol>
                    </defs>
                </svg>


            </div>

        </div>
      );
}

export default PresenceCheck;