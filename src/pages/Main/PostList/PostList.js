import styles_1 from './PostList_1.module.scss';
import styles_2 from './PostList_2.module.scss';
import styles_3 from './PostList_3.module.scss';

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useAnimation, use } from 'framer-motion';


const PostList = (props) => {
    const mode = parseInt(props.mode);
    const selectedTag = props.selectedTag;
    const _data = props.data;
    const [data, setData] = useState();
    const [_postList, _setPostList] = useState();
    const [noData, setNoData] = useState(false);
    const refreshAnimation = useAnimation();
    const location = useLocation();

    useEffect(()=>{
        refreshAnimation.set({ opacity: 0, y: '-20px' });
        refreshAnimation.start({ opacity: 1, y: '0px', transition: { delay: 0, duration: 0.15 } });
    }, [props.selectedTag, props.mode]);

    useEffect(()=>{
        refreshAnimation.set({ opacity: 0 });
    }, [location]);

    useEffect(()=>{
        refreshAnimation.set({ opacity: 0 });
        refreshAnimation.start({ opacity: 1 });
    }, [_data]);

    // 선택된 TAG에 따라 DATA 가공. //
    useEffect(() => {
        if (_data) {
            if (selectedTag) {
                if (selectedTag === 'ALL') {
                    setData(_data.slice(0));
                } else {
                    setData(_data.slice(0).filter(name => name.tags.includes(selectedTag)));
                }
            }
            if (!_data.slice(0)[0]) {
                setNoData(true);
            } else {
                setNoData(false);
            }
        }

    }, [props]);

    // 가공된 DATA로 MODE에 따라 MAPPING. //
    useEffect(() => {
        if (data) {
            // MODE 1 //
            if (mode === 1) {
                _setPostList(data.map((e, idx) => {
                    const listData = data;
                    const listIndex = idx;

                    return(
                    <Link to={'/post/' + e.post_id} state={{ postTitle: e.title, postId: e.post_id, currentBoard: 'noBoard', listData, listIndex }} key={e.post_id}>
                        <div className={styles_1.list}>
                            <div className={styles_1.flexBox}>
                                <p className={styles_1.mainTag}>[{e.tags[0]}]</p>
                                <p className={styles_1.postTitle}>{e.title}</p>
                            </div>
                            <div className={styles_1.flexBox}>
                                <p className={styles_1.postDate}>{e.date}</p>
                            </div>
                        </div>
                    </Link>
                    )
                }
                ));
            }
            // MODE 2 //
            if (mode === 2) {
                _setPostList(data.map((e, idx) => {
                    const thumbnailImg = e.content.slice(e.content.indexOf('<img'), e.content.indexOf('>', e.content.indexOf('<img')) + 1);
                    const noTagData = parseMd(e.content).replace(/<[^>]*>?/g, '').substring(0,300);
                    const listData = data;
                    const listIndex = idx;
                    return (
                        <Link to={'/post/' + e.post_id} state={{ postTitle: e.title, postId: e.post_id, currentBoard: 'noBoard', listData, listIndex }} key={e.post_id}>
                            <div className={styles_2.list}>
                                <div className={styles_2.thumbnail} dangerouslySetInnerHTML={{ __html: thumbnailImg }} style={{ display: thumbnailImg ? 'block' : 'none' }}></div><div className={styles_2.thumbnail_cover} style={{ display: thumbnailImg ? 'none' : 'flex', position: thumbnailImg ? 'absolute' : 'static', backgroundColor: thumbnailImg ? 'rgba(0, 0, 0, 0.25)' : getRandomColor() }}><p>[{e.tags[0]}]<br></br>{e.title}</p></div>
                                <div className={styles_2.container}>
                                    <div className={styles_2.inner}>
                                        <div className={styles_2.flexBox}>
                                            <p className={styles_2.mainTag}>[{e.tags[0]}]</p><p className={styles_2.postTitle}>{e.title}</p>
                                        </div>
                                        <p className={styles_2.postDate}>{e.date}</p>
                                    </div>
                                    <div className={styles_2.postContent}> {noTagData}</div>
                                    <div className={styles_2.info_wrap}>
                                        <div className={`${styles_2.view_img} ${styles_2.icon}`}></div><p>{e.view.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        <div className={`${styles_2.comment_img} ${styles_2.icon}`}></div><p>{e.cmtnum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        <div className={`${styles_2.like_img} ${styles_2.icon}`}></div><p>{e.like.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        <div className={styles_2.name}>{e.name}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                }
                ));
            }
            // MODE 2 //
            if (mode === 3) {
                _setPostList(data.map((e, idx) => {
                    const thumbnailImg = e.content.slice(e.content.indexOf('<img'), e.content.indexOf('>', e.content.indexOf('<img')) + 1);
                    const listData = data;
                    return (
                        <div className={styles_3.list_container} key={e.post_id}>
                            <Link to={'/post/' + e.post_id} state={{ postTitle: e.title, postId: e.post_id, currentBoard: 'noBoard', listData: listData, listIndex: idx}}>
                                <div className={styles_3.list}>
                                    <div className={styles_3.thumbnail} dangerouslySetInnerHTML={{ __html: thumbnailImg }} style={{ display: thumbnailImg ? 'block' : 'none' }}></div><div className={styles_3.thumbnail_cover} style={{ display: thumbnailImg ? 'none' : 'flex', position: thumbnailImg ? 'absolute' : 'static', backgroundColor: thumbnailImg ? 'none' : getRandomColor() }}><p>[{e.tags[0]}]<br></br>{e.title}</p></div>
                                    <div className={styles_3.inner}>
                                        <p className={styles_3.postTitle}><span className={styles_3.mainTag}>[{e.tags[0]}]</span>{e.title}</p>
                                    </div>
                                    <p className={styles_3.postDate}>{e.date} · {e.tags.slice(1, 4).map((element) => ' · ' + element)}</p>
                                    <div className={styles_3.info_wrap}>
                                        <div className={`${styles_3.view_img} ${styles_3.icon}`}></div><p>{e.view.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        <div className={`${styles_3.comment_img} ${styles_3.icon}`}></div><p>{e.cmtnum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        <div className={`${styles_3.like_img} ${styles_3.icon}`}></div><p>{e.like.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        <div className={styles_3.name}>{e.name}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                }
                ));
            }
        }
    }, [data, mode])

    // 랜덤색상 생성 함수 //
    const getRandomColor = () => {
        let r, r1, r2, r3;
        r1 = Math.floor(Math.random() * 250) + 5;
        r2 = Math.floor(Math.random() * 250) + 5;
        r3 = Math.floor(Math.random() * 250) + 5;
        if (localStorage.getItem('theme') === 'dark')
            r = 'rgba(' + r1 + ',' + r2 + ',' + r3 + ', 0.2)';
        else
            r = 'rgba(' + r1 + ',' + r2 + ',' + r3 + ', 0.6)';
        return r;
    }

    const parseMd = (md) => {
  
        //ul
        md = md.replace(/^\s*\n\*/gm, '<ul>\n*');
        md = md.replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2');
        md = md.replace(/^\*(.+)/gm, '<li>$1</li>');
        
        //ol
        md = md.replace(/^\s*\n\d\./gm, '<ol>\n1.');
        md = md.replace(/^(\d\..+)\s*\n([^\d\.])/gm, '$1\n</ol>\n\n$2');
        md = md.replace(/^\d\.(.+)/gm, '<li>$1</li>');
        
        //blockquote
        md = md.replace(/^\>(.+)/gm, '<blockquote>$1</blockquote>');
        
        //h
        md = md.replace(/[\#]{6}(.+)/g, '<h6>$1</h6>');
        md = md.replace(/[\#]{5}(.+)/g, '<h5>$1</h5>');
        md = md.replace(/[\#]{4}(.+)/g, '<h4>$1</h4>');
        md = md.replace(/[\#]{3}(.+)/g, '<h3>$1</h3>');
        md = md.replace(/[\#]{2}(.+)/g, '<h2>$1</h2>');
        md = md.replace(/[\#]{1}(.+)/g, '<h1>$1</h1>');
        
        //alt h
        md = md.replace(/^(.+)\n\=+/gm, '<h1>$1</h1>');
        md = md.replace(/^(.+)\n\-+/gm, '<h2>$1</h2>');
        
        //images
        md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
        
        //links
        md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
        
        //font styles
        md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<b>$1</b>');
        md = md.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, '<i>$1</i>');
        md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');
        
        //pre
        md = md.replace(/^\s*\n\`\`\`(([^\s]+))?/gm, '<pre class="$2">');
        md = md.replace(/^\`\`\`\s*\n/gm, '</pre>\n\n');
        
        //code
        md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');
        
        //p
        md = md.replace(/^\s*(\n)?(.+)/gm, function(m){
          return  /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
        });
        
        //strip p from pre
        md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, '$1$2');
        
        return md;
        
      }


    return (
        <motion.div className={mode === 3 ? styles_3.PostList : mode === 2 ? styles_2.PostList : styles_1.PostList}
            animate={ refreshAnimation }
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}>
            {_postList}
            <div className={styles_1.noPostScreen} style={{ display: noData ? 'block' : 'none' }}>
                <div>
                    <span className={ styles_1.warning }></span>
                    <p>{props.noData ?? "해당 게시판이 비어있습니다."}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default PostList;