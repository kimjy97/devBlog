import styles from './Sidebar.module.scss';

import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';


let arr_dark = [];
let arr_light = [];

for (let i = 0; i < 16; i++) {
    arr_dark.push({
        backgroundColor: 'rgb(' + ((Math.random() * 95) + 45) + ', ' + ((Math.random() * 95) + 45) + ', ' + ((Math.random() * 117) + 55) + ')'
    });
    arr_light.push({
        backgroundColor: 'rgb(' + ((Math.random() * 135) + 110) + ', ' + ((Math.random() * 135) + 110) + ', ' + ((Math.random() * 135) + 110) + ')'
    });
}

const Sidebar = (props) => {

    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const mainTarget = useRef();
    const refreshTarget = useRef();
    const burgerTarget = useRef();
    const searchInputTarget = useRef();
    const searchEffectTarget = useRef();
    const effectTarget = useRef([]);
    const menuTarget = useRef([]);
    const [boardList_data_all, setBoardList_data_all] = useState();
    const [boardList_data_date, setBoardList_data_date] = useState();
    const [boardList_data, setBoardList_data] = useState();
    const [allListNum, setAllListNum] = useState();
    const [activeBoard, setActiveBoard] = useState();
    const [menuToggle, setMenuToggle] = useState();
    const [isOpen, setIsOpen] = useState();
    const [searchText, setSearchText] = useState();
    const [visitors, setVisitors] = useState([]);
    const location = useLocation();

    const refreshEvent = () => {
        refreshTarget.current.style.transform = 'rotate(360deg)';
        setTimeout(() => window.location.reload(), 200);
    }

    const boardListLoader = (init = true) => {
        if (init) {
            axios.get(url + '/boardList').then(async (Response) => {
                const _data = Response.data;
                const sum = Object.values(Response.data).reduce((stack, el) => {
                    return stack + el;
                }, 0);
                setAllListNum(sum);
                axios.get(url + '/boardDateList').then((Response_date) => {
                    const _date_data = Response_date.data;
                    const merge = Object.entries(_data)
                    setBoardList_data_all(merge);
                    setBoardList_data_date(_date_data);
                    setBoardList_data(merge.map((e, index) =>
                        <li className={location.state?.currentBoard === e[0] ? styles.active : ''} key={index}>
                            <div className={`${styles.active_effect} ${location.state?.currentBoard === e[0] ? styles.start : ''}`} ref={(el) => effectTarget.current[index] = el} onAnimationEnd={() => { effectTarget.current[index].style.animation = "none"; }}></div>
                            <Link to={'/'} state={{ currentBoard: e[0] }} onClick={() => boardClickEvent(e[0], index)}>
                                <div className={styles.bar} style={localStorage.getItem('theme') === 'dark' ? arr_dark[index] : arr_light[index]}></div>{e[0]} ({e[1]})<span>{_date_data[index] ?? ''}</span>
                            </Link>
                        </li>
                    ));
                });
            });
        } else {
            if (boardList_data_all) {
                setBoardList_data(boardList_data_all.map((e, index) =>
                    <li className={location.state?.currentBoard === e[0] ? styles.active : ''} key={index}>
                        <div className={`${styles.active_effect} ${location.state?.currentBoard === e[0] ? styles.start : ''}`} ref={(el) => effectTarget.current[index] = el} onAnimationEnd={() => { effectTarget.current[index].style.animation = "none"; }}></div>
                        <Link to={'/'} state={{ currentBoard: e[0] }} onClick={() => boardClickEvent(e[0], index)}>
                            <div className={styles.bar} style={localStorage.getItem('theme') === 'dark' ? arr_dark[index] : arr_light[index]}></div>{e[0]} ({e[1]})<span>{boardList_data_date[index] ?? ''}</span>
                        </Link>
                    </li>
                ));
            }
        }
    }

    const boardClickEvent = (name, index) => {
        setActiveBoard(name);
        setIsOpen(false);
        effectTarget.current[index].style.animation = `750ms ${styles.activeEffect}`;
        localStorage.setItem("selectedTag", 'ALL');
    }

    const getVisitors = () => {
        axios.get(url + '/getVisitors')
            .then((res) => {
                setVisitors([res.data.today, res.data.yesterday, res.data.total]);
            }
            );
    }

    const onSearchHandler = () => {
        setSearchText(searchInputTarget.current?.value);
    }


    useLayoutEffect(() => {
        setIsOpen(false);
        setMenuToggle(0);
        getVisitors();
    }, []);

    useEffect(() => {
        const handleClickOutside = ({ target }) => {
            if (!burgerTarget.current.contains(target) && isOpen && !mainTarget.current.contains(target)) {

                setIsOpen(false);
            }
        };

        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {

    }, [menuToggle]);

    useEffect(() => {
        boardListLoader();
    }, [props.darkmode]);

    useEffect(() => {
        setActiveBoard(location.state?.currentBoard ?? 'ALL');
        boardListLoader(false);
        if (location.state?.currentBoard === 'noBoard') {
            mainTarget.current.style.width = '300px';
        } else {
            mainTarget.current.style.width = '350px';
        }
    }, [location.state?.currentBoard]);

    return (
        <div className={styles.wrap}>
            <div className={isOpen ? `${styles.hamburger} ${styles.active}` : styles.hamburger} ref={burgerTarget} onClick={() => {
                setIsOpen(!isOpen);
            }}></div>
            <div className={isOpen ? `${styles.background} ${styles.active}` : styles.background}></div>
            <div className={isOpen ? `${styles.Sidebar} ${styles.active}` : styles.Sidebar} ref={mainTarget}>
                <div className={styles.Sidebar_container}>
                    <motion.div className={styles.profileBackground_light}
                        initial={{ backgroundPositionY: '-70px' }}
                        animate={{ backgroundPositionY: '0px' }}
                        transition={{ duration: 0.8, ease: "easeOut" }}>
                    </motion.div>
                    <motion.div className={styles.profileBackground_dark}
                        initial={{ backgroundPositionY: '-70px' }}
                        animate={{ backgroundPositionY: '0px' }}
                        transition={{ duration: 0.8, ease: "easeOut" }}>
                    </motion.div>
                    <div className={styles.profileImg}></div>
                    <div className={styles.profileInfo_wrap}>
                        <p className={styles.name}>JongYeon</p>
                        <p className={styles.job}>Front-end dev.</p>
                        <p className={styles.abstract}>저의 블로그를 방문해주셔서 감사합니다!!</p>
                    </div>
                    <div className={styles.stickyMenu_container}>
                        <hr></hr>
                        <ul className={styles.optionList_container}>
                            <li className={menuToggle === 1 ? styles.active : ''} onClick={() => setMenuToggle(menuToggle === 1 ? 0 : 1)} ref={(el) => menuTarget.current[1] = el}><div className={styles.search}></div></li>
                            <li className={menuToggle === 2 ? styles.active : ''} onClick={() => setMenuToggle(menuToggle === 2 ? 0 : 2)} ref={(el) => menuTarget.current[2] = el}><div className={styles.memo}></div></li>
                            <li className={menuToggle === 3 ? styles.active : ''} onClick={() => setMenuToggle(menuToggle === 3 ? 0 : 3)} ref={(el) => menuTarget.current[3] = el}><div className={styles.share}></div></li>
                            <li onClick={() => refreshEvent()}><div className={styles.refresh} ref={refreshTarget}></div></li>
                        </ul>
                        <div className={menuToggle === 0 ? styles.optionMenu_container : `${styles.optionMenu_container} ${styles.visible}`}>
                            <div className={menuToggle === 1 ? `${styles.menu1} ${styles.visible}` : styles.menu1}>
                                <div>
                                    <input placeholder='Search' ref={ searchInputTarget } onChange={onSearchHandler}></input>
                                    <Link to={'/search'} state={{ search: searchText, currentBoard: 'noBoard&search' }} onClick={(e)=> { if(searchInputTarget.current?.value === "") {e.preventDefault();}else{ searchEffectTarget.current.style = "width: 100%; opacity: 0" }  } }><div className={styles.search_icon}></div></Link>
                                    <div className={styles.searchEffect} ref={searchEffectTarget}></div>
                                </div>
                            </div>
                            <div className={menuToggle === 2 ? `${styles.menu2} ${styles.visible}` : styles.menu2}>
                                <div>
                                    <textarea placeholder='Memo' disabled={menuToggle === 2 ? false : true}></textarea>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <ul className={styles.menuList_container}>
                            <li className={activeBoard === 'ALL' ? styles.active : ''}>
                                <div className={`${styles.active_effect} ${activeBoard === 'ALL' ? styles.start : ''}`} ref={(el) => effectTarget.current[15] = el} onAnimationEnd={() => { effectTarget.current[15].style.animation = "none"; }}></div>
                                <Link to={'/'} state={{ currentBoard: 'ALL' }} onClick={() => boardClickEvent('ALL', 15)}>
                                    <div className={styles.bar} style={localStorage.getItem('theme') === 'dark' ? arr_dark[15] : arr_light[15]}></div>전체글보기 ({allListNum})<span></span>
                                </Link>
                            </li>
                            {boardList_data}
                        </ul>
                    </div>
                    <div className={styles.visitors}>
                        <p>오늘 : {visitors[0]?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        <p>어제 : {visitors[1]?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        <p>전체 방문자 : {visitors[2]?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        <br></br>
                        <p>Copyright ⓒ 2023. JongYeon All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;