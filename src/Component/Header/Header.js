import styles from './Header.module.scss';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Header = () => {

    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const [position, setPosition] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);
    const headerRef = useRef();
    const location = useLocation();


    const ipLoader = () => {
        axios.get('https://api.ip.pe.kr/json/')
        .then((res) => {
            axios.post(url + '/viewer', {
                ip: res.data.ip,
                post_id: 0
            }).catch(function (error) {
                console.log(error);
            });
            localStorage.setItem("myIP", res.data.ip);
        }).catch(function (error) {
            console.log(error);
        })
    }

    

    useEffect(() => {
        const handleScroll = () => {
            const moving = window.scrollY;
            setVisible(position > moving);
            setPosition(moving);
            if (window.scrollY >= 50) {
                headerRef.current.style.boxShadow = '0 5px 10px rgba(0,0,0,0.25)';
                headerRef.current.style.background = 'var(--bg-header1)';
                headerRef.current.style.WebkitBackdropFilter = 'blur(10px)';
                headerRef.current.style.backdropFilter = 'blur(10px)';
            } else {
                headerRef.current.style.position = 'absolute';
                headerRef.current.style.top = '0';
                headerRef.current.style.boxShadow = 'none';
                headerRef.current.style.background = 'var(--bg-header2)';
                headerRef.current.style.WebkitBackdropFilter = 'none';
                headerRef.current.style.backdropFilter = 'none';
            }
        }
        const timer = setInterval(() => {
            window.addEventListener('scroll', handleScroll);
        }, 0);
        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [position]);

    useEffect(() => {
        if (visible) {
            headerRef.current.style.position = 'fixed';
            headerRef.current.style.top = '0';
        } else {
            headerRef.current.style.position = 'absolute';
            headerRef.current.style.top = window.scrollY + 'px';
        }
    }, [visible]);

    useEffect(() => {
        window.onbeforeunload = function pushRefresh() {
            window.scrollTo(0, 0);
        };
        ipLoader();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className={styles.Header} ref={headerRef}>
            <div className={styles.Header_container}>
                <div className={styles.left}>
                    <Link to={'/'} state={{ currentBoard: 'ALL' }} onClick={()=>localStorage.setItem("selectedTag", 'ALL')}>
                        <p className={styles.logo}>Dev.</p>
                    </Link>
                </div>
                <div className={styles.right}>
                    <ul>
                        <Link to={'/Guestbook'} state={{ currentBoard: 'noBoard&Guestbook' }}>
                        <li className={location.pathname==='/Guestbook' ? styles.active : ''}>GUESTBOOK</li>
                        </Link>
                        <li>DESIGN LAB.</li>
                        <li>NOTICE</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header;