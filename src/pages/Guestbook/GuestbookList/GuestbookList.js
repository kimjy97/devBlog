import styles from './GuestbookList.module.scss';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const GuestbookList = (props) => {

    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const [Name, setName] = useState();
    const [Password, setPassword] = useState();
    const [Content, setContent] = useState('');
    const [Comments, setComments] = useState();
    const [cursor, setCursor] = useState(0);
    const [activeReply, setActiveReply] = useState();
    const nameTarget = useRef();
    const passwordTarget = useRef();
    const contentTarget = useRef();
    const replyContentTarget = useRef();
    const replyContentTarget_none = useRef();
    const deletepwTarget = useRef([]);

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
        const ntg = nameTarget.current.value;
        const ctg = contentTarget.current.value;
        if (ctg) {
            if (Password) {
                if (ntg != "JongYeon" && ntg != "Jongyeon" && ntg != "jongyeon" && ntg != "종연" && ntg != "김종연" && ntg != "poot97" && ntg != "poot972") {
                    if(Name?.length > 10) {toast.error('이름이 너무 깁니다. ( 최대 10글자 )',
                    {
                        position: "bottom-center",
                        style: {
                            borderRadius: '10px',
                            background: 'var(--bg-toast-error)',
                            color: 'var(--text-normal)',
                        },
                    }); return;}
                    if(Password?.length > 12) {toast.error('비밀번호가 너무 깁니다. ( 최대 12글자 )',
                    {
                        position: "bottom-center",
                        style: {
                            borderRadius: '10px',
                            background: 'var(--bg-toast-error)',
                            color: 'var(--text-normal)',
                        },
                    }); return;}
                    await axios.post(url + '/comment', {
                        post_id: 0,
                        user_id: '',
                        name: Name ?? '익명',
                        password: Password ?? '0000',
                        content: Content,
                        ip: localStorage.getItem('myIP'),
                        parent: 0
                    }).then(function (response) {
                        if (response.data) {
                            toast.success('댓글이 등록되었습니다.',
                                {
                                    position: "bottom-center",
                                    style: {
                                        borderRadius: '10px',
                                        background: 'var(--bg-toast-success)',
                                        color: 'var(--text-normal)',
                                    },
                                });
                            }
                        commentListLoader();
                        props.changeInfo();
                    }).catch(function (error) {
                        console.error(error);
                    });
                    passwordTarget.current.value = '';
                    contentTarget.current.value = '';
                    setPassword('');
                    setContent('');
                }else{
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

    const onReplyCommitHandler = async (comment_id) => {
        const ctg = replyContentTarget.current.value;
        if (ctg) {
            await axios.post(url + '/comment', {
                post_id: 0,
                user_id: '',
                name: 'JongYeon',
                password: '0000',
                content: ctg,
                ip: localStorage.getItem('myIP'),
                parent: comment_id
            }).then(function (response) {
                setActiveReply(0);
                commentListLoader();
                props.changeInfo();
            }).catch(function (error) {
                console.error(error);
            });
        }
    }

    const deleteEvent = async (comment_id) => {
        const pw = deletepwTarget.current[comment_id].value;
        if (pw) {
            await axios.post(url + '/deletecomment', {
                post_id: 0,
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
                    commentListLoader();
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
            }).catch(function (error) {
                console.error(error);
            });
        }
    }

    // 댓글 리스트 데이터 로더 및 MAPPING //
    const commentListLoader = async () => {
        await axios.get(url + '/comment/' + 0).then((Response) => {
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
                                    <p className={styles.deleteButton} onClick={() => { deleteEvent(e.comment_id); }}>삭제</p>
                                    <p className={`${styles.replyButton} ${activeReply === e.comment_id ? styles.active : ''}`} data-tip data-for="reply_tooltip" onClick={() => { /*setActiveReply(activeReply === e.comment_id ? 0 : e.comment_id);  */}}>답글달기</p>
                                    {
                                        <ReactTooltip id='reply_tooltip' className={styles.tooltip} place='bottom' type='dark' effect='solid' backgroundColor='rgb(50, 50, 60)' textColor='white'>로그인이 필요합니다.</ReactTooltip>
                                    }
                                </div>
                            </div>
                            <div className={styles.replyComment_container} style={{ display: activeReply === e.comment_id ? 'flex' : 'none' }}>
                                <div className={styles.replyIcon}></div>
                                <div className={styles.replyComment_wrap}><textarea ref={activeReply === e.comment_id ? replyContentTarget : replyContentTarget_none} placeholder='답글을 입력하세요.' maxLength='2000'></textarea></div>
                                <button onClick={() => { onReplyCommitHandler(e.comment_id); replyContentTarget.current.value = '' }}>등록</button>
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
    }, [])

    useEffect(() => {
        commentListLoader();
    }, [activeReply])

    useEffect(() => {
        if(cursor !== 0)
        contentTarget.current.setSelectionRange(cursor, cursor);
      }, [cursor]);

    return (
        <motion.div className={styles.GuestbookList}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}>
            <Toaster></Toaster>
            <div className={styles.GuestbookList_container}>
                <div className={styles.commentForm_container}>
                    <div>
                        <div className={styles.commentForm_wrap}>
                            <p>GuestBook</p>
                            <div className={styles.form_wrap}>
                                <p>NAME</p><input className={Name?.length > 10 ? styles.max : undefined} type={'text'} placeholder='익명' maxLength='20' ref={nameTarget} onChange={onNameHandler}></input>
                                <p>PASSWORD</p><input className={Password?.length > 12 ? styles.max : undefined} type={'password'} placeholder='비밀번호' maxLength='20' ref={passwordTarget} onChange={onPasswordHandler}></input>
                            </div>
                        </div>
                        <div className={styles.commentTextArea_container}>
                            <textarea className={Content?.length >= 2000 ? styles.max : undefined} placeholder='내용을 입력하세요. (최대 2000자)' maxLength='2000' ref={contentTarget} value={Content} onKeyDown={onContentTabHandler} onChange={onContentHandler}></textarea>
                        </div>
                    </div>
                    <div className={styles.button_wrap}>
                        <button onClick={onCommitHandler}>등록</button>
                    </div>
                </div>
                <p>※ 이름을 입력하지 않으면 '익명'으로 댓글이 등록됩니다.</p>
            </div>
            {Comments}
        </motion.div>
    );
}

export default GuestbookList;