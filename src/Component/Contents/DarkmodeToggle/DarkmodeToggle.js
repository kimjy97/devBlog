import styles from './DarkmodeToggle.module.scss';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';

const Toggle = (props) => {

    const btnTarget = useRef();
    const textTarget = useRef();
    const containerTarget = useRef();
    const [toggleBool, setToggleBool] = useState();

    const resizeWindowEvent = () => {
        changeEvent(!toggleBool);
    }

    const changeEvent = (bool) => {
        if(bool){
            btnTarget.current.style.left = (containerTarget.current.offsetWidth > 70 ? 123 : containerTarget.current.offsetWidth)-(containerTarget.current.offsetWidth > 70 ? 34 : 44) + 'px';
            btnTarget.current.style.backgroundColor = 'rgb(120,120,220)';
            btnTarget.current.style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
            textTarget.current.style.left = '0px';
            textTarget.current.style.paddingLeft = '14px';
            textTarget.current.style.color = 'rgba(0, 0, 0, 0.9)';
            textTarget.current.innerText = props.op2;
        }else{
            btnTarget.current.style.left = '4px';
            btnTarget.current.style.backgroundColor = 'rgb(25,25,55)';
            btnTarget.current.style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
            textTarget.current.style.left = '0px';
            textTarget.current.style.paddingLeft = '42px';
            textTarget.current.style.color = 'rgba(255, 255, 255, 0.7)';
            textTarget.current.innerText = props.op1;
            
        }
        
    }

    useLayoutEffect(() => {
        const mode = localStorage.getItem('theme') === 'light' ? false : true;
        containerTarget.current.style.width = props.width;
        setToggleBool(mode);
        changeEvent(!mode);
    }, []);

    useEffect(()=> {
        window.addEventListener('resize', resizeWindowEvent);
        return () => {
            window.removeEventListener('resize', resizeWindowEvent);
        }
    }, [])

    useLayoutEffect(() => {
        if(toggleBool){
            localStorage.setItem("theme", "dark");
            document.documentElement.setAttribute("data-theme", "dark");
            props.func('dark');
        }else{
            localStorage.setItem("theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
            props.func('light');
        }
        window.addEventListener('resize', resizeWindowEvent);
        return () => {
            window.removeEventListener('resize', resizeWindowEvent);
        }
        
    }, [toggleBool]);

    return (
        <div className={styles.DarkmodeToggle}>
            <div className={styles.DarkmodeToggle_container} onClick={ () => { changeEvent(toggleBool); setToggleBool(!toggleBool); }} ref={ containerTarget }>
                <p className={styles.text} ref={ textTarget }>{props.op1}</p>
                <div className={styles.DarkmodeToggle_button} ref={ btnTarget }>
                    <div className={toggleBool ? `${styles.modeIcon} ${styles.dark}` : `${styles.modeIcon} ${styles.light}`}></div>
                </div>
            </div>
        </div>

    );
}

Toggle.defaultProps = {
    op1: '',
    op2: '',
    width: '65px'
};

export default Toggle;