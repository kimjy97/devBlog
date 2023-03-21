import styles from './SearchResultList.module.scss';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const SearchResultList = (props) => {

    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    

    return (
        <motion.div className={styles.GuestbookList}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}>
        </motion.div>
    );
}

export default SearchResultList;