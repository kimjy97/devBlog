import styles from './Contents.module.scss';

import DarkmodeToggle from './DarkmodeToggle/DarkmodeToggle';
import Sidebar from '../Sidebar/Sidebar';
import Main from 'pages/Main/Main';
import Post from 'pages/Post/Post';
import Guestbook from 'pages/Guestbook/Guestbook';
import SearchResult from 'pages/SearchResult/SearchResult';

import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

const Contents = () => {

    const [darkmode, setDarkmode] = useState();

    const ChangedMode = (mode) => {
        setDarkmode(mode);
    }

    return (
        <div className={styles.Contents}>
            <Sidebar darkmode={darkmode}></Sidebar>
            <Routes>
                <Route path="/" element={<Main />}></Route>
                <Route path="/search" element={<SearchResult />}></Route>
                <Route path="/post/:no" element={<Post />}></Route>
                <Route path="/Guestbook" element={<Guestbook />}></Route>
                <Route path="*" element={<Main />}></Route>
            </Routes>
            <DarkmodeToggle op1='DARK MODE' op2='LIGHT MODE' width="115px" func={ChangedMode}></DarkmodeToggle>
        </div>
    )
}

export default Contents;