import React, {useEffect, useState} from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CameraCard from './CameraCard'
import SideBarCard from './SideBarCard'
import PresenceCheck from './PresenceCheck.module.css';
import studentList from './studentList.module.css'


const StudentsList =({socket,students,setStudents,navigateRef,peers,setPeers,...props}) => {

    const [searchValue,setSearchValue] = useState("")
    const [acceptedStudents,setAcceptedStudents] = useState([])
    const [opnedSideBar,setOpnedSideBar] = useState("");
    const [newGridParam,setNewGridParam] = useState(
        {
            gridColSize : 1,
            gridRowSize:1,
            lastRowCol: 1,
            specialSpan: 1,
            startLastRowIndex: null,
            specialClassName: ""
        })


    let startLastRowIndex = null;
    let lastRowCol = 1;
    let specialSpan = 1

    useEffect(()=>{
        setAcceptedStudents(students.filter(student=>student.state === "PRESENT"))
    },[students])

    useEffect(() =>{
        if (acceptedStudents.length !== 0) {

            let cp = 1;
            let gridColSize = 1;
            let gridRowSize = 1;



            while (cp < acceptedStudents.length) {
                gridColSize <= gridRowSize ? gridColSize++ : gridRowSize++;
                cp = gridColSize * gridRowSize;
            }

            if (cp > acceptedStudents.length) {
                lastRowCol = (gridColSize - (cp % acceptedStudents.length))
                specialSpan = (gridColSize);
                startLastRowIndex = ((gridColSize * (gridRowSize - 1)) + 1)
            }

            gridColSize =(gridColSize * lastRowCol)

            setNewGridParam({
                gridColSize : gridColSize,
                gridRowSize: gridRowSize,
                lastRowCol: lastRowCol,
                specialSpan: specialSpan,
                startLastRowIndex: startLastRowIndex,
                specialClassName: "special_li"
            })
        }
    },[acceptedStudents])






    return(
        <>
            <div className={PresenceCheck.buttonsGroup}>
                <button className={studentList.menu__btn}
                        onClick={()=> setOpnedSideBar(p =>{return p === studentList.opend ? "" : studentList.opend})}
                >
                        <span className={studentList.icon}>
                            <svg viewBox="0 0 175 80" width="40" height="40">
                                <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                                <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                                <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                            </svg>
                        </span>
                    <span className={studentList.text}>Students</span>
                </button>

                <button onClick={()=> {
                    navigateRef.current.swiper.enable()
                    navigateRef.current.swiper.attachEvents()
                    navigateRef.current.swiper.slideNext()
                    navigateRef.current.swiper.detachEvents()
                    navigateRef.current.swiper.disable()
                    console.log(navigateRef.current.swiper)
                }}
                        className={PresenceCheck.goBackButton} role="button">
                    <span className={PresenceCheck.label}>Go Back</span>
                    <span className={PresenceCheck.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                        </span>
                </button>
            </div>
            <div className={studentList.main_container}>
                <ul style={{
                    "--grid-col-size": newGridParam.gridColSize,
                    "--grid-row-size": newGridParam.gridRowSize,
                    "--normal-span": newGridParam.lastRowCol,
                    "--special-span": newGridParam.specialSpan
                }}
                    className={studentList.grid_wrapper}>
                    {
                        acceptedStudents
                            .map((student,index)=>{

                                if (!newGridParam.startLastRowIndex || (index + 1) < newGridParam.startLastRowIndex){

                                    return (
                                        <li key={index}>
                                            <div className={studentList.child}>
                                                <CameraCard
                                                    student={student}
                                                    socket={socket}
                                                    code={props.code}
                                                    session={props.session}
                                                    peers={peers}
                                                    setPeers={setPeers}
                                                />
                                            </div>
                                        </li>
                                    )
                                }else {
                                    return (
                                        <li className={studentList.specialClassName} key={index}>
                                            <div className={studentList.child}>
                                                <CameraCard
                                                    student={student}
                                                    socket={socket}
                                                    code={props.code}
                                                    session={props.session}
                                                    peers={peers}
                                                    setPeers={setPeers}
                                                />
                                            </div>
                                        </li>
                                    )
                                }

                            })}

                </ul>
                <div className={studentList.side_bar +" " + opnedSideBar}>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>

                        <div className={studentList.search_form}>
                            <input placeholder="Search student" required type="text" className={studentList.search_input}
                                   value={searchValue}
                                   onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <div className={studentList.fancy_bg}></div>
                            <div className={studentList.search}>
                                <svg className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr" aria-hidden="true" viewBox="0 0 24 24">
                                    <g>
                                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                                        </path>
                                    </g>
                                </svg>
                            </div>
                            <div className={studentList.close_btn}
                                 role="button"
                                 onClick={() => setSearchValue("")}
                            >
                                <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fillRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>

                        <IconButton sx={{position:"absolute", top:"0", right:"0", color:"white" }}
                                    onClick={()=>setOpnedSideBar(p =>{return p === "opend" ? "" : "opend"})}
                        >
                            <CloseIcon sx={{fontSize:"45px"}}/>
                        </IconButton>

                    </div>
                    {
                        acceptedStudents
                            .map((student,index)=>{

                                return(<SideBarCard key={index} student={student}/>)

                            })
                    }

                </div>
            </div>
        </>



    )
}
export default StudentsList