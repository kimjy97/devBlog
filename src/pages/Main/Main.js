import styles from './Main.module.scss';

import ChangePostListMode from './ChangePostListMode/ChangePostListMode';
import PostList from './PostList/PostList';
import TagList from './TagList/TagList';
import MetaTag from '../../Component/SEOMetaTag';

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';

const Main = () => {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const [currentBoard, setCurrentBoard] = useState();
    const [selectedTag, setSelectedTag] = useState();
    const [viewMode, setViewMode] = useState();

    // 데이터 상태값 //
    const [postList_data, setPostList_data] = useState();
    const [tagList_data, setTagList_data] = useState();

    const boardNameTarget = useRef();
    const tagNameTarget = useRef();
    const location = useLocation();
    const startAnimation_1 = useAnimation();
    const startAnimation_2 = useAnimation();

    // props 설정 //
    const selectTag = (tagName) => {
        setSelectedTag(tagName);
        tagNameTarget.current.style.animation = `300ms ease ${styles.tagAni}`;
    }

    const tagListLoader = () => {
        axios.get(url + '/tagList').then((Response) => {
            setTagList_data(Response.data);
            startAnimation_2.start({ opacity: 1 });
            startAnimation_1.start({ opacity: 1 });
        });
    }
    const postListLoader = () => {
        axios.get(url + '/postList').then((Response) => {
            setPostList_data(Response.data.reverse());
        });
    }

    const changeViewModeEvent = (mode) => {
        setViewMode(mode);
    }

    useEffect(() => {
        setSelectedTag(localStorage.getItem("selectedTag") ?? 'ALL'); // 태그 설정
        setViewMode(localStorage.getItem("selectedMode") ?? 3); // 뷰모드 설정
        startAnimation_2.set({ opacity: 0 });
    }, []);

    useEffect(() => {
        const cancelSource = axios.CancelToken.source();
        const cb = location.state?.currentBoard ?? 'ALL';
        setCurrentBoard(cb ?? 'ALL');
        setSelectedTag(localStorage.getItem("selectedTag") ?? 'ALL');
        startAnimation_1.set({ opacity: 0 });
        startAnimation_2.set({ opacity: 0 });
        
        if (cb === 'ALL') {
            tagListLoader();
            postListLoader();
        } else {
            
            axios.get(url + '/tagList/' + cb, {
                cancelToken: cancelSource.token
              }).then((Response) => {
                setTagList_data(Response.data);
                startAnimation_2.start({ opacity: 1 });
                startAnimation_1.start({ opacity: 1 });
            });
            
            axios.get(url + '/postList/' + cb, {
                cancelToken: cancelSource.token
              }).then((Response) => {
                setPostList_data(Response.data.reverse());
            }); 

        }
        return () => cancelSource.cancel();
    }, [location]);

    useEffect(() => {
        boardNameTarget.current.style.animation = `300ms ease ${styles.boardAni}`;
    }, [tagList_data]);
;    
    return (
        <div className={styles.Main}>
            <MetaTag title={"JongYeon's 개발 블로그"} description={'JongYeon의 개발 블로그에 오신것을 환영합니다. 안녕하세요 프론트엔드 개발자 김종연입니다. 개발경험에 있어 여러사람들이 알았으면 하는 정보들을 메모해두고 싶어 직접 풀스택으로 만든 블로그입니다.'} url={"https://blog.poot97.woobi.co.kr"} imgsrc={"/img/logo.png"}/>
            <motion.div className={styles.Main_container}
                animate={ startAnimation_1 }
                transition={{ duration: 0.65, ease: "easeOut" }}>
                <motion.div className={styles.title}
                    initial={{ opacity: 0, y: '20px' }}
                    animate={{ opacity: 1, y: '0px' }}
                    transition={{ delay: 0, duration: 0.65, ease: "easeOut" }}>
                    &lt; Main Page /&gt;
                </motion.div>
                <div className={styles.boardName} ref={boardNameTarget} onAnimationEnd={() => {boardNameTarget.current.style.animation="none";}}>
                    <div className={styles.pinIcon}></div>{currentBoard === 'ALL' ? '전체글보기': currentBoard} <div className={styles.arrow} ref={tagNameTarget} onAnimationEnd={() => {tagNameTarget.current.style.animation="none";}}><span className={styles.arrowIcon}>{selectedTag ? selectedTag === 'ALL' ? '' : '>' : ''}</span> { selectedTag ? selectedTag === 'ALL' ? '' : selectedTag : '' }</div>
                </div>
                <motion.div className={styles.controller_container}
                    animate={ startAnimation_2 }
                    transition={{ duration: 0.3, ease: "easeOut" }}>
                    <TagList data={tagList_data} selectTagEvent={selectTag} initTag={selectedTag}></TagList>
                    <ChangePostListMode changeViewMode={changeViewModeEvent} initMode={viewMode}></ChangePostListMode>
                </motion.div>
                <PostList data={postList_data} mode={viewMode} selectedTag={selectedTag}></PostList>
            </motion.div>
        </div>
    )
}

export default Main;