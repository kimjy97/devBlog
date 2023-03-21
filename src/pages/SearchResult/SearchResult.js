import styles from './SearchResult.module.scss';

//import SearchResultList from './SearchResultList/SearchResultList';
import MetaTag from '../../Component/SEOMetaTag';
import TagList from 'pages/Main/TagList/TagList';
import PostList from 'pages/Main/PostList/PostList';
import ChangePostListMode from 'pages/Main/ChangePostListMode/ChangePostListMode';

import { motion, useAnimation } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';


const SearchResult = () => {
    
    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    const location = useLocation();
    const [searchText, setSearchText] = useState();
    const [selectedTag, setSelectedTag] = useState();
    const [viewMode, setViewMode] = useState();

    // 데이터 상태값 //
    const [postList_data, setPostList_data] = useState();
    const [tagList_data, setTagList_data] = useState();
    
    const startAnimation_1 = useAnimation();

    // props 설정 //
    const selectTag = (tagName) => {
        setSelectedTag(tagName);
    }
    const changeViewModeEvent = (mode) => {
        setViewMode(mode);
    }

    useEffect(() => {
        setSelectedTag(localStorage.getItem("selectedTag") ?? 'ALL'); // 태그 설정
        setViewMode(localStorage.getItem("selectedMode") ?? 3); // 뷰모드 설정
    }, []);

    useEffect(() => {
        const search = location.state?.search ?? '';
        startAnimation_1.set({ opacity: 0 });
        const cancelSource = axios.CancelToken.source();
        axios.get(url + '/search/' + search, {
            cancelToken: cancelSource.token
          }).then((Response) => {
            setSearchText(search);
            setPostList_data(Response.data.reverse());
            startAnimation_1.start({ opacity: 1 });
        });

        return () => cancelSource.cancel();
    },[location]);

    return (
        
        <div className={styles.SearchResult}>
            <MetaTag title={"검색결과 - JongYeon's 개발 블로그"} description={`'${searchText}' 에 대한 ${postList_data && postList_data.length}개의 검색결과가 있습니다.`} url={"https://blog.poot97.woobi.co.kr/SearchResult"} imgsrc={"/img/logo.png"} />
            <div className={styles.SearchResult_container}>
                <motion.div className={styles.title}
                    initial={{ opacity: 0, transform: 'scale(3)' }}
                    animate={{ opacity: 1, transform: 'scale(1)' }}
                    transition={{ delay: 0, duration: 0.4, ease: "easeOut" }}>
                    {`'${location.state.search}' 에 대한 검색결과`}
                </motion.div>
                <motion.p className={styles.subtitle}
                initial={{ opacity: 0, y: '20px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}>
                {`총 ${postList_data && postList_data.length}개의 검색결과가 있습니다.`}
                </motion.p>
                <motion.div className={styles.controller_container}
                    animate={ startAnimation_1 }
                    transition={{ duration: 0.3, ease: "easeOut" }}>
                    <TagList data={tagList_data} selectTagEvent={selectTag} initTag={selectedTag}></TagList>
                    <ChangePostListMode changeViewMode={changeViewModeEvent} initMode={viewMode}></ChangePostListMode>
                </motion.div>
                <PostList data={postList_data} mode={viewMode} selectedTag={selectedTag} noData={'검색결과가 없습니다.'}></PostList>
            </div>
        </div>
    )
}

export default SearchResult;