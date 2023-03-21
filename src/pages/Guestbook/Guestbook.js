import styles from './Guestbook.module.scss';

import GuestbookList from './GuestbookList/GuestbookList';
import MetaTag from '../../Component/SEOMetaTag';

import { motion } from 'framer-motion';

const Guestbook = () => {
    return (
        <div className={styles.Guestbook}>
            <MetaTag title={"방명록 - JongYeon's 개발 블로그"} description={"안녕하세요 프론트엔드 개발자 김종연입니다. 개발경험에 있어 여러사람들이 알았으면 하는 정보들을 메모해두고 싶어 직접 풀스택으로 만든 블로그입니다. 블로그를 보시고 마음껏 의견과 질문을 남겨주세요!!"} url={"https://blog.poot97.woobi.co.kr/Guestbook"} imgsrc={"/img/logo.png"} />
            <div className={styles.Guestbook_container}>
                <motion.div className={styles.title}
                    initial={{ opacity: 0, transform: 'scale(4)' }}
                    animate={{ opacity: 1, transform: 'scale(1)' }}
                    transition={{ delay: 0, duration: 0.4, ease: "easeOut" }}>
                    GuestBook
                </motion.div>
                <motion.p className={styles.subtitle}
                initial={{ opacity: 0, y: '20px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}>
                블로그를 보시고 마음껏 의견과 질문을 남겨주세요!!
                </motion.p>
                <GuestbookList></GuestbookList>
            </div>
        </div>
    )
}

export default Guestbook;