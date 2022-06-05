import React,{useState,useEffect} from "react";

import {useNavigate} from "react-router-dom";

import SwiperCore, {
    Keyboard,
    EffectCoverflow,
    Navigation,
    Pagination,
    HashNavigation

} from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';


import StudentCard from './StudentCard';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import PresenceCheck from './PresenceCheck.module.css';
import './swiperStudentStyle.css'
import axios from "axios";


const StudentsSwiper =({socket,students,setStudents,navigateRef,peers,setPeers,...props}) => {
    SwiperCore.use([Keyboard,Navigation,Pagination,HashNavigation,EffectCoverflow])
    const navigate = useNavigate();
    const etudiantSwiperRef = React.useRef(null)
    const [swiperRef,setSwiperRef] = useState(null)

    useEffect(()=>{
        // if(swiperRef)
        //     swiperRef.update()
        console.log(students);
    },[students])

    const updateState = (student,state) => {

        document.querySelector('.item_bg.active')?.classList.remove('active');
        document.querySelector('.student__item.active')?.classList.remove('active');
        document.querySelector('.student_slider .swiper-slide-active .student__item')?.classList.add('active');
        document.querySelector('.swiper-slide-active.student-slider__item .item_bg')?.classList.add('active');


        setStudents( prevStudents => {
            let newList = []
            prevStudents.forEach(child  => {
                if(child.etudiant.userId === student.userId){
                    child.state = state
                }
                newList.push(child);
            })
            return newList
        })



    }

    useEffect(()=>{
        if(swiperRef)
            swiperRef.update()
    },[students])


    const startSession = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/advance-state`;
        axios.put(url, {}, { withCredentials: true });
    };
    const endSession = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/advance-state`;
        axios.put(url, {}, { withCredentials: true })
            .then(response => {
                if (response.status !== 200) {
                    throw (response.data);
                }
                socket.close();
                navigate("/enseignant");
            });
    };

    return(

        <div className={PresenceCheck.wrapper}>
            <div className={PresenceCheck.buttonsGroup}>

                <button onClick={()=> {
                    navigateRef.current.swiper.enable()
                    navigateRef.current.swiper.attachEvents()
                    navigateRef.current.swiper.slidePrev()
                    navigateRef.current.swiper.detachEvents()
                    navigateRef.current.swiper.disable()
                    console.log(navigateRef.current.swiper)
                }}
                        className={PresenceCheck.button_6} role="button">View Accepted Students
                </button>
                <button  onClick={()=> {
                    navigateRef.current.swiper.enable()
                    navigateRef.current.swiper.attachEvents()
                    navigateRef.current.swiper.slideNext()
                    navigateRef.current.swiper.detachEvents()
                    navigateRef.current.swiper.disable()
                    setTimeout(()=>{
                        navigateRef.current.swiper.destroy(false,true);
                    },1000);
                    startSession()
                }}
                         className={PresenceCheck.button_6} role="button">Start Session</button>
            </div>
            <Swiper
                enabled={true}
                ref={etudiantSwiperRef}
                onSwiper={setSwiperRef}
                className={PresenceCheck.student_slider}
                modules={[ Keyboard,Navigation,Pagination ]}
                loop={true}
                centeredSlides={true}
                slideToClickedSlide={true}
                keyboard={{
                    enabled: true,
                }}
                slidesPerView={4}
                spaceBetween={10}
                breakpoints= {{
                    480: {
                        spaceBetween: 0,
                        centeredSlides: true
                    }
                }}

                onUpdate={() => {
                    document.querySelector('.swiper-slide-active.student_slider__item  .student__item')?.classList.add('active');
                    document.querySelector('.swiper-slide-active.student_slider__item .item_bg')?.classList.add('active');
                }
                }
                onInit={ (swiper) => {
                    document.querySelector('.swiper-slide-active.student_slider__item  .student__item')?.classList.add('active');
                    document.querySelector('.swiper-slide-active.student_slider__item  .item_bg')?.classList.add('active');
                }
                }
                onTouchEnd={ ()=> {
                    console.log("touching...")
                    document.querySelector('.item_bg.active')?.classList.remove('active');
                    document.querySelector('.student__item.active')?.classList.remove('active');
                    document.querySelector('.student_slider .swiper-slide-active .student__item')?.classList.add('active');
                    document.querySelector('.swiper-slide-active.student_slider__item .item_bg')?.classList.add('active');
                }
                }
                onSlideChange={ ()=> {
                    document.querySelector('.student__item')?.classList.remove('active');
                }
                }
                onSlideChangeTransitionEnd={() => {

                    console.log('changing active class: ',document.querySelector('.swiper-slide-active').ariaLabel )
                    document.querySelector('.item_bg.active')?.classList.remove('active');
                    document.querySelector('.student__item')?.classList.remove('active');
                    document.querySelector('.swiper-slide-active.student_slider__item .student__item')?.classList.add('active');
                    document.querySelector('.swiper-slide-active.student_slider__item  .item_bg')?.classList.add('active');
                }
                }
            >

                <div className={PresenceCheck.student_slider__wrp + " swiper-wrapper"}>
                    {
                        students.filter(student => student.state === "ABSENT")
                            .map( (student,index) =>

                                <StudentCard
                                    key={student.etudiant.userId}
                                    presence={student}
                                    code={props.code}
                                    socket={socket}
                                    session={props.session}
                                    updateState={updateState}
                                    etudiantSwiperRef={etudiantSwiperRef}
                                    index={index}
                                    peers={peers}
                                    setPeers={setPeers}
                                />

                            )
                    }
                </div>

                {
                    students.filter(student => student.state === "ABSENT").length !==0 ?
                    <div className={PresenceCheck.student_slider__ctr}>
                        <div className={PresenceCheck.student_slider__arrows}>
                            <button
                                onClick={()=> {
                                    etudiantSwiperRef.current.swiper.slidePrev()

                                }}

                                className={PresenceCheck.student_slider__arrow +" "+ PresenceCheck.student_slider_prev}>
                                <span className={PresenceCheck.icon_font}>
                                    <svg className={PresenceCheck.icon +" icon-arrow-left"}>
                                    <use xlinkHref="#icon-arrow-left"></use>
                                    </svg>
                                </span>
                            </button>
                            <button
                                onClick={()=> {
                                    etudiantSwiperRef.current.swiper.slideNext()

                                }}

                                className={PresenceCheck.student_slider__arrow  +" "+ PresenceCheck.student_slider_next}>
                                <span className={PresenceCheck.icon_font}>
                                    <svg className={PresenceCheck.icon +" icon-arrow-right"}>
                                    <use xlinkHref="#icon-arrow-right"></use>
                                    </svg>
                                </span>
                            </button>
                        </div>

                        {/*<div ref={paginationRef} className={PresenceCheck.student-slider__pagination"></div>*/}
                    </div>
                    : ""
                }

            </Swiper>

        </div>

    )
}
export default StudentsSwiper

