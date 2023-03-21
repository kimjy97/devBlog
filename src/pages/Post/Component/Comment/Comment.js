import styles from './Comment.module.scss';

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';

const Comment = (props) => {

    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const [Name, setName] = useState();
    const [Password, setPassword] = useState();
    const [Content, setContent] = useState('');
    const [Comments, setComments] = useState();
    const [activeReply, setActiveReply] = useState();
    const [isRequesting, setIsRequesting] = useState(false);
    const [cursor, setCursor] = useState(0);
    const nameTarget = useRef();
    const passwordTarget = useRef();
    const contentTarget = useRef();
    const replyContentTarget = useRef();
    const replyContentTarget_none = useRef();
    const deletepwTarget = useRef([]);


    // FORM 이벤트 핸들러 //
    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    }
    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    }
    const onContentHandler = (e) => {
        setContent(e.currentTarget.value);
    }
    const onContentTabHandler = (e) => {
        if (e.key === 'Tab') {
            let textarea = e.target;
            let value = textarea.value;
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;

            e.preventDefault();
            setContent(value.substring(0, start) + "\t" + value.substring(end));
            setCursor(start + 1);
        }
    }
    const onCommitHandler = async () => {
        if (!isRequesting) {
            const ntg = nameTarget.current.value;
            const ctg = contentTarget.current.value;
            if (ctg) {
                if (Password) {
                    if (ntg !== "JongYeon" && ntg !== "jongyeon" && ntg !== "종연" && ntg !== "김종연" && ntg !== "poot97" && ntg !== "poot972") {
                        if (Name?.length > 10) {
                            toast.error('이름이 너무 깁니다. ( 최대 10글자 )',
                                {
                                    position: "bottom-center",
                                    style: {
                                        borderRadius: '10px',
                                        background: 'var(--bg-toast-error)',
                                        color: 'var(--text-normal)',
                                    },
                                }); return;
                        }
                        if (Password?.length > 12) {
                            toast.error('비밀번호가 너무 깁니다. ( 최대 12글자 )',
                                {
                                    position: "bottom-center",
                                    style: {
                                        borderRadius: '10px',
                                        background: 'var(--bg-toast-error)',
                                        color: 'var(--text-normal)',
                                    },
                                }); return;
                        }
                        setIsRequesting(true);
                        await axios.post(url + '/comment', {
                            post_id: props.post_id,
                            user_id: '',
                            name: Name ?? '익명',
                            password: Password ?? '0000',
                            content: Content,
                            ip: localStorage.getItem('myIP'),
                            parent: 0
                        }).then(function (response) {
                            commentListLoader();
                            props.changeInfo();
                            setIsRequesting(false);
                            toast.success('댓글이 등록되었습니다.',
                                {
                                    position: "bottom-center",
                                    style: {
                                        borderRadius: '10px',
                                        background: 'var(--bg-toast-success)',
                                        color: 'var(--text-normal)',
                                    },
                                });
                        }).catch(function (error) {
                            console.error(error);
                            setIsRequesting(false);
                        });
                        passwordTarget.current.value = '';
                        contentTarget.current.value = '';
                        setPassword('');
                        setContent('');
                    } else {
                        toast.error('사용할 수 없는 이름입니다.',
                            {
                                position: "bottom-center",
                                style: {
                                    borderRadius: '10px',
                                    background: 'var(--bg-toast-error)',
                                    color: 'var(--text-normal)',
                                },
                            });
                    }
                } else {
                    toast.error('비밀번호를 입력해주세요.',
                        {
                            position: "bottom-center",
                            style: {
                                borderRadius: '10px',
                                background: 'var(--bg-toast-error)',
                                color: 'var(--text-normal)',
                            },
                        });
                }
            } else {
                toast.error('내용을 입력해주세요.',
                    {
                        position: "bottom-center",
                        style: {
                            borderRadius: '10px',
                            background: 'var(--bg-toast-error)',
                            color: 'var(--text-normal)',
                        },
                    });
            }
        }
    }
    const onReplyCommitHandler = async (comment_id) => {
        if (!isRequesting) {
            const ctg = replyContentTarget.current.value;
            if (ctg) {
                setIsRequesting(true);
                await axios.post(url + '/comment', {
                    post_id: props.post_id,
                    user_id: '',
                    name: 'JongYeon',
                    password: '0000',
                    content: ctg,
                    parent: comment_id
                }).then(function (response) {
                    setActiveReply(0);
                    commentListLoader();
                    props.changeInfo();
                    setIsRequesting(false);
                }).catch(function (error) {
                    console.error(error);
                    setIsRequesting(false);
                });
            }
        }
    }

    const deleteEvent = (comment_id) => {
        if (!isRequesting) {
            const pw = deletepwTarget.current[comment_id].value;
            deletepwTarget.current[comment_id].value = '';
            if (pw) {
                setIsRequesting(true);
                axios.post(url + '/deletecomment', {
                    post_id: props.post_id,
                    password: pw,
                    comment_id: comment_id,
                    ip: localStorage.getItem('myIP')
                }).then(function (response) {
                    if (response.data) {
                        toast.success('댓글이 성공적으로 삭제되었습니다.',
                            {
                                position: "bottom-center",
                                style: {
                                    borderRadius: '10px',
                                    background: 'var(--bg-toast-success)',
                                    color: 'var(--text-normal)',
                                },
                            });
                        props.changeInfo();
                    } else {
                        toast.error('비밀번호가 틀렸습니다.',
                            {
                                position: "bottom-center",
                                style: {
                                    borderRadius: '10px',
                                    background: 'var(--bg-toast-error)',
                                    color: 'var(--text-normal)',
                                },
                            });
                    }
                    setIsRequesting(false);

                }).catch(function (error) {
                    console.error(error);
                    setIsRequesting(false);
                });
            }
        }
    }

    // 댓글 리스트 데이터 로더 및 MAPPING //
    const commentListLoader = async (init = true) => {
        await axios.get(url + '/comment/' + props.post_id).then((Response) => {

            setComments(Response.data.slice(0).reverse().map((e) => {
                if (e.parent === 0) {
                    const replyComments = Response.data.slice(0).reverse().map((re) => {
                        if (re.parent === e.comment_id) {
                            return (
                                <div className={`${styles.list} ${styles.reply}`} key={re.comment_id}>
                                    <div className={styles.replyIcon}></div>
                                    <div className={styles.list_container}>
                                        <div className={styles.NameAndDate}><span>{re.name}</span><span>{re.date} · {re.time}</span></div>
                                        <p className={styles.content_wrap}>{re.content}</p>
                                    </div>
                                    <div className={styles.option_container}>
                                    </div>
                                </div>
                            )
                        }
                    });
                    return (
                        <div className={styles.Comment_wrap} key={e.comment_id}>
                            <div className={styles.list}>
                                <div className={styles.list_container}>
                                    <div className={styles.NameAndDate}><span>{e.name}</span><span>{e.date} · {e.time}</span></div>
                                    <p className={styles.content_wrap}>{e.content}</p>
                                </div>
                                <div className={styles.option_container}>
                                    <input className={styles.optionPassword} ref={(el) => deletepwTarget.current[e.comment_id] = el} type={'password'} placeholder="비밀번호"></input>
                                    <p className={styles.deleteButton} onClick={() => { !isRequesting && deleteEvent(e.comment_id); }}>삭제</p>
                                    <p className={`${styles.replyButton} ${activeReply === e.comment_id ? styles.active : ''}`} data-tip data-for="reply_tooltip" onClick={() => { /*setActiveReply(activeReply === e.comment_id ? 0 : e.comment_id); */}}>답글달기</p>
                                    {
                                        <ReactTooltip id='reply_tooltip' className={styles.tooltip} place='bottom' type='dark' effect='solid' backgroundColor='rgb(50, 50, 60)' textColor='white'>로그인이 필요합니다.</ReactTooltip>
                                    }
                                </div>
                            </div>
                            <div className={styles.replyComment_container} style={{ display: activeReply === e.comment_id ? 'flex' : 'none' }}>
                                <div className={styles.replyIcon}></div>
                                <div className={styles.replyComment_wrap}><textarea ref={activeReply === e.comment_id ? replyContentTarget : replyContentTarget_none} placeholder='답글을 입력하세요.' maxLength='2000'></textarea></div>
                                <button onClick={() => { !isRequesting && onReplyCommitHandler(e.comment_id); replyContentTarget.current.value = '' }}>등록</button>
                            </div>
                            {replyComments}
                        </div>
                    )
                } else {
                    return
                }
            }
            ));
        });
    }

    useEffect(() => {
        commentListLoader();
    }, [props.cmtnum, activeReply]);

    useEffect(() => {
        if(cursor !== 0)
        contentTarget.current.setSelectionRange(cursor, cursor);
      }, [cursor]);

    return (
        <div className={styles.Comment}>
            <Toaster></Toaster>
            <div className={styles.Comment_container}>
                <div className={styles.commentForm_container}>
                    <p>COMMENT</p>
                    <div className={styles.form_wrap}>
                        <span>NAME</span><input className={Name?.length >= 10 ? styles.max : undefined} type={'text'} placeholder='익명' maxLength='20' ref={nameTarget} onChange={onNameHandler}></input>
                        <span>PASSWORD</span><input className={Password?.length >= 12 ? styles.max : undefined} type={'password'} placeholder='비밀번호' maxLength='20' ref={passwordTarget} onChange={onPasswordHandler}></input>
                    </div>
                </div>
                <div className={styles.commentTextArea_container}>
                    <textarea className={Content?.length >= 2000 ? styles.max : undefined} placeholder='댓글을 입력해보세요!' maxLength='2000' ref={contentTarget} value={Content} onKeyDown={onContentTabHandler} onChange={onContentHandler}></textarea>
                </div>
                <div className={styles.button_wrap}>
                    <p>※ 이름을 입력하지 않으면 '익명'으로 댓글이 등록됩니다.</p>
                    <button onClick={onCommitHandler}>등록</button>
                </div>
                <div className={styles.commentInfo}>{props?.cmtnum === 0 ? '댓글이 없습니다.' : `${props?.cmtnum}개의 댓글이 있습니다.`}</div>
            </div>
            {Comments}
        </div>
    )
}

export default Comment;