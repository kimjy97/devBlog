import styles from './Post.module.scss';
import makrdown from './Markdown.module.scss';

import SubMenu from './Component/SubMenu/SubMenu';
import Comment from './Component/Comment/Comment';
import MetaTag from '../../Component/SEOMetaTag';

import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";


const Post = (props) => {

    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const [_postData, _setPostData] = useState();
    const [_postListData, _setPostListData] = useState();
    const [tagList, setTagList] = useState();
    const [likeActive, setLikeActive] = useState();
    const location = useLocation();
    const mainTarget = useRef();
    const commentTarget = useRef();
    const likeTarget = useRef();
    const startAnimation_1 = useAnimation();
    const startAnimation_2 = useAnimation();

    const _post_id = location?.pathname.split('/')[1] === 'post' ? location?.pathname.split('/')[2]*1 : 0;
    
    const ipLoader = () => {
        axios.get('https://api.ip.pe.kr/json/')
        .then((res) => {
            axios.post(url + '/viewer', {
                ip: res.data.ip,
                post_id: _post_id
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        })
    }

     const postDataLoader = async (id) => {
        try {
            await axios.get(url + '/post/' + id).then((Response) => {
                _setPostData(Response.data[0]);
            });
        } catch (error) {

        }
        try {
            await axios.get(url + '/postList').then((Response) => {
                _setPostListData(Response.data);
            });
        } catch (error) {
            
        }
    }
    
    const gotoCommentEvent = () => {
        commentTarget.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const likeEvent = async (bool) => {
        await axios.get('https://api.ip.pe.kr/json/')
        .then((res) => {
            axios.post(url + '/like', {
                ip: res.data.ip,
                post_id: _post_id
            }).then(()=>{
                setTimeout(()=>{
                    changeInfo()
                }, 200);
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        })
        setLikeActive(bool);
    }
    
    const changeInfo = () => {
        postDataLoader(_post_id);
    }
    
    // 이전, 다음 게시물 버튼 //
    const preButton = (data, index) => {
        if (data) {
            if (data[index + 1]) {
                const preData = data[index + 1];
                
                return (
                    <Link to={'/post/' + preData.post_id} state={{ postId: preData.post_id, boardName: 'noBoard', listData: data, listIndex: index + 1 }}>
                        <div className={`${styles.navButton} ${styles.pre}`}><p className={styles.Text}>&lt; 이전 글</p><p className={styles.Title}>{preData?.title}<span>[{preData?.cmtnum}]</span></p><div className={styles.navDate}>{preData?.date}</div></div>
                    </Link>
                )
            } else {
                return <div className={styles.noNav}><p>이전 게시물이 없습니다.</p></div>
            }
        }
    }
    

    const nextButton = (data = _postListData, index = _post_id) => {
        if (data) {
            if (data[index - 1]) {
                const nextData = data[index - 1];
                
                return (
                    <Link to={'/post/' + nextData.post_id} state={{ postId: nextData.post_id, boardName: 'noBoard', listData: data, listIndex: index - 1 }}>
                        <div className={`${styles.navButton} ${styles.next}`}><p className={styles.Text}>다음 글 &gt;</p><p className={styles.Title}>{nextData?.title}<span>[{nextData?.cmtnum}]</span></p><div className={styles.navDate}>{nextData?.date}</div></div>
                    </Link>
                )
            } else {
                return <div className={styles.noNav}><p>다음 게시물이 없습니다.</p></div>
            }
        }
    }
    
    const nonepreButton = (data = _postListData, index = _post_id - 1) => {
        if (data) {
            if (data[index - 1]) {
                const preData = data[index - 1];
                
                return (
                    <Link to={'/post/' + preData.post_id} state={{ postId: preData.post_id, boardName: 'noBoard'}}>
                        <div className={`${styles.navButton} ${styles.pre}`}><p className={styles.Text}>&lt; 이전 글</p><p className={styles.Title}>{preData?.title}<span>[{preData?.cmtnum}]</span></p><div className={styles.navDate}>{preData?.date}</div></div>
                    </Link>
                )
            } else {
                return <div className={styles.noNav}><p>이전 게시물이 없습니다.</p></div>
            }
        }
    }
    const nonenextButton = (data = _postListData, index = _post_id - 1) => {
        if (data) {
            if (data[index + 1]) {
                const nextData = data[index + 1];
                
                return (
                    <Link to={'/post/' + nextData.post_id} state={{ postId: nextData.post_id, boardName: 'noBoard'}}>
                        <div className={`${styles.navButton} ${styles.next}`}><p className={styles.Text}>다음 글 &gt;</p><p className={styles.Title}>{nextData?.title}<span>[{nextData?.cmtnum}]</span></p><div className={styles.navDate}>{nextData?.date}</div></div>
                    </Link>
                )
            } else {
                return <div className={styles.noNav}><p>다음 게시물이 없습니다.</p></div>
            }
        }
    }
    
    useEffect(() => {
        postDataLoader(_post_id);
        axios.get('https://api.ip.pe.kr/json/')
        .then((res) => {
            axios.post(url + '/islike', {
                ip: res.data.ip,
                post_id: _post_id
            }).then((res) => {
                setLikeActive(res.data);
            }).catch(function (error) {
                console.log(error);
                setLikeActive(false);
            });
        }).catch(function (error) {
            console.log(error);
        })
    }, []);

    useEffect(()=>{
        likeTarget.current.style.animation = `300ms ${styles.like_Fadein} ease`;
    },[likeActive]);

    useEffect(() => {
        if (likeTarget.current) {
            const observer = new IntersectionObserver(() => {
                if(!likeActive) {
                    if (likeTarget.current) {
                    likeTarget.current.style.animation = `700ms ${styles.like_Fadein}`;
                    }
                }
            });
            observer.observe(likeTarget.current);
        }
    },[likeTarget])


    useEffect(() => {
        postDataLoader(_post_id);
        ipLoader();
        startAnimation_1.set({ opacity: 0, y: '-15px' });
        startAnimation_2.set({ opacity: 0 });
    }, [location]);

    useEffect(() => {
        if (_postData) {
            setTagList(_postData.tags.map((tagname, index) =>
                <Link to={'/'} state={{ currentBoard: 'ALL' }} key={index} onClick={() => localStorage.setItem("selectedTag", tagname)}><li key={index}><p>{tagname}</p></li></Link>))
            startAnimation_1.start({ opacity: 1, y: 0 });
            startAnimation_2.start({ opacity: 1 });
        }
    }, [_postData]);

    return (
        <motion.div className={styles.Post}
        animate={startAnimation_1}
            transition={{ delay: 0.1, duration: 0.25, ease: "easeOut" }}>
            <MetaTag title={'[' + (_postData?.tags[0] ?? 'WEB') + '] ' + (_postData?.title ?? 'post') + " - JongYeon's 개발 블로그"} description={_postData?.description.substring(0,130)} cmtnum={_postData?.cmtnum} date={_postData?.date} url={"https://blog.poot97.woobi.co.kr/post/" + _post_id} />
            <div className={styles.Post_container} ref={mainTarget}>

                <SubMenu gotoComment={gotoCommentEvent} likeEvent={likeEvent} cmtnum={_postData?.cmtnum} like={_postData?.like} likeActive={likeActive}></SubMenu>

                <div className={styles.postInfo}>
                    <p className={styles.postTitle}><span>[{_postData?.tags[0]}] </span>{_postData?.title}</p>
                    <div className={styles.postDateAndName}>
                        <span>{_postData?.name}</span> · <span data-tip data-for='date_tooltip'>{_postData?.date}</span>
                        <ReactTooltip id='date_tooltip' className={styles.tooltip} place='bottom' type='light' effect='solid' backgroundColor='rgb(50, 50, 60)' textColor='white'>{_postData?.time}</ReactTooltip>
                    </div>
                    <div className={styles.tags}>
                        <ul>
                            {tagList}
                        </ul>
                    </div>
                </div>

                <motion.div className={styles.postContents}
                animate={startAnimation_2}
                transition={{ delay: 0.25, duration: 0.35, ease: "easeOut" }}>
                <ReactMarkdown className={makrdown.markdown_body} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={localStorage.getItem('theme') === 'dark' ? dracula : oneLight }
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}>{_postData?.content}</ReactMarkdown>
                </motion.div>

                <div className={`${ styles.like_container } ${ likeActive ? styles.active : '' }`}>
                    <div className={`${ styles.like_wrap } ${ likeActive ? styles.active : '' }`} onClick={() => likeEvent(!likeActive)}>
                        <div className={styles.like_icon}></div>
                        <div className={styles.like_icon_active}></div>
                        <p>{_postData?.like}</p>
                    </div>
                    <div className={styles.like_text}>
                        <p ref={likeTarget} onAnimationEnd={() => {likeTarget.current.style.animation="none";}}>{likeActive ? '감사합니다!' : '글이 도움이 되셨다면 눌러주세요!'}</p>
                    </div>
                </div>

                <div className={styles.postControl_container}>
                    { location.state?.listData ?
                        preButton(location.state?.listData, location.state?.listIndex)
                    : nonepreButton()
                    }
                    { location.state?.listData ?
                        nextButton(location.state?.listData, location.state?.listIndex)
                    : nonenextButton()
                    }
                </div>

                <div className={styles.commentScroll} ref={commentTarget}></div>
                <Comment changeInfo={changeInfo} cmtnum={_postData?.cmtnum} post_id={_post_id}></Comment>

            </div>
        </motion.div>
    );
}

export default Post;