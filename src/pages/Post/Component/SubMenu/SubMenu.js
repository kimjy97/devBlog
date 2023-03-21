import styles from './SubMenu.module.scss';

import ReactTooltip from 'react-tooltip';
import { useEffect, useState } from 'react';

const SubMenu = (props) => {

    const [active, setActive] = useState();

    useEffect(()=>{
        setActive(false); // LIKE 초기값 설정
    }, []);

    useEffect(()=>{
        setActive(props.likeActive);
    }, [props.likeActive])

    return (
        <div className={styles.SubMenu}>
            <div className={styles.SubMenu_container}>
            <div className={styles.topButton} onClick={()=> window.scrollTo(0,0)}>TOP</div>
            <div className={styles.topArrow}><div className={styles.arrow_top}></div></div>
                <ul className={styles.item}>
                    <li className={`${styles.like_item} ${active ? styles.active : ''}`} data-tip data-for='like_tooltip' onClick={() => {setActive(!active); props.likeEvent(!active)}}>
                        <div className={styles.like_img}></div>
                        <div className={styles.like_img_active}></div>
                        <p>{props?.like}</p>
                    </li>
                    { !active ?
                        <ReactTooltip id='like_tooltip' className={styles.tooltip} place='left' type='light' effect='solid' backgroundColor='var(--bg-submenu-tooltip)' textColor='white'>글이 도움이 되셨다면 눌러주세요!</ReactTooltip>
                    : ''
                    }
                    <li className={styles.comment_item} onClick={()=> props.gotoComment() }>
                        <div className={styles.comment_img}></div>
                        <p>{props?.cmtnum}</p>
                    </li>
                    <div className={styles.commentArrow}>
                            <div className={styles.arrow_bottom}></div>
                    </div>
                </ul>
            </div>
            <div className={styles.SubMenu_mini}>
                <div className={styles.SubMenu_mini_container}>
                    <div className={styles.topButton} onClick={()=> window.scrollTo(0,0)}>
                        <div className={styles.arrow_top}></div>
                        TOP
                    </div>
                    <div className={styles.comment_img} onClick={()=> props.gotoComment() }>
                        <div className={styles.icon}></div>
                        <div className={styles.arrow_bottom}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubMenu;