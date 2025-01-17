import { themeChange } from 'theme-change'
import React, {  useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BellIcon  from '@heroicons/react/24/outline/BellIcon'
import Bars3Icon  from '@heroicons/react/24/outline/Bars3Icon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'

import { NavLink,  Routes, Link , useLocation} from 'react-router-dom'


function Header(){

    const dispatch = useDispatch()
    const {noOfNotifications, pageTitle} = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

    useEffect(() => {
        themeChange(false)
        if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            }else{
                setCurrentTheme("light")
            }
        }
        // 👆 false parameter is required for react project
      }, [])


    // Opening right sidebar for notification
    const openNotification = () => {
        dispatch(openRightDrawer({header : "Notifications", bodyType : RIGHT_DRAWER_TYPES.NOTIFICATION}))
    }


    function logoutUser(){
        localStorage.clear();
        window.location.href = '/'
    }

    return(
        // navbar fixed  flex-none justify-between bg-base-300  z-10 shadow-md
        
        <>
            <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md ">


                {/* Menu toogle for mobile view or small screen */}
                <div className="flex-1">
                    <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                    <Bars3Icon className="h-5 inline-block w-5"/></label>
                    <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
                </div>

                

            <div className="flex-none ">

                {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection, 
                also includes corporate and retro themes in tailwind.config file */}
                
                {/* <select className="select select-sm mr-4" data-choose-theme>
                    <option disabled selected>Theme</option>
                    <option value="light">Default</option>
                    <option value="dark">Dark</option>
                    <option value="corporate">Corporate</option>
                    <option value="retro">Retro</option>
                </select> */}


            {/* Light and dark theme selection toogle **/}
            <label className="swap ">
                <input type="checkbox"/>
                <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "dark" ? "swap-on" : "swap-off")}/>
                <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "light" ? "swap-on" : "swap-off")} />
            </label>


                {/* Notification icon
                <button className="btn btn-ghost ml-4  btn-circle" onClick={() => openNotification()}>
                    <div className="indicator">
                        <BellIcon className="h-6 w-6"/>
                        {noOfNotifications > 0 ? <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span> : null }
                    </div>
                </button> */}


                {/* Profile icon, opening menu on click */}
                <div className="dropdown dropdown-end ml-4">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALUAAACUCAMAAADifZgIAAAAY1BMVEX///8AAACjo6OysrLu7u74+PiUlJT7+/uqqqrZ2dk8PDy6urrj4+NMTEzT09Nra2seHh4kJCTMzMxUVFTFxcWDg4OampoNDQ1HR0cxMTF7e3spKSk3NzdgYGCJiYlzc3MVFRU4rAdKAAAD2UlEQVR4nO2ciZaiMBBFCQLKorLj0i7//5XTyHFam1aoqpBHz+T+APfkFJWlKnEcrfihW6jvFG7o6/2MVpL41FPuOMUJWu4FSbB+4dyyDmbp7e7fOLfsV2jFHnk04NwS5WjNJ/xghHNLMKPfMjmMlFbqMJvoTvrJ7jXFTLQ3KUFaqXSDFm4JM5K0UlmIVv4Mjx1RWqkdPEi8LVlaqa2HlV5WDGmlqiXUesGSVmqBlPZo6eOLFBkjnKDu2OKky4Zt3ZQoaZ8/1J+DjVqRlNyobklBg+2fBdJKnTGDHYqklcJM7K7QGrO1GbN7eUeEkPaE0kohZpqV2BoxrUuSdQdifpSGNSSwfeoWpk9mPmOHkomxIzWfsWP+yulOExu3XmiwNp9E5IkPMTtaa2v9nt/5N+ZXsfXV/HF2Ip9lMvOLPv8otj4C9mDvSkfjWJuXdsYWNV4TAKw3YmvE8bsvtoYcLUg3MxeEtJMLrTHFR49S+upTgA6DZcc4LkbaCSUb3ghWCasF1jVK2vE+2NIfwBJHzLY2v9F94FXvzRAnpLTj8X7ICFwmLTlHUBmslHSHk7RRqfoBenXmjFZuoZbSK7TwjWVA2fheA2zl/y8+5WxkNZ9+rfFFvBn04XzhX8Yc6jSX+Qz0jeVieLVdLGYS0g8kAy2fmQtvd/qR5M3Ktann6Xyj3Eb9k7Q02sKn8AG8+Hwpjvd/szkWl3MMXiuNw0/yMl65rruKyzyZWdqwWCwWi8VisfzTeGFeLtq1qITVosxDU0vvZVlXpx92LBzS6FTV5fQr8M1hJ2/keybbHSat8nq1niHuk9ZThUpY6x7lR7J6imMpP5A3pr4n0n9lcyMr5I6j0Bvfnuziw3gqjeGdcEtddE7ajqhy+hVGPjtNx1Siyzx0rlq0uZcB+WhoTiyNSyslHu3cbHh0pMI2HcZdYh3I7iN75lLeMydJ3jY1ufQR1H/ljYZ8+JO7vBWVD7uJVd6JKoHZxRpi8scdZh6R3rqUwuoiSfgNZHr44Ay2+fXHdxjrkeXUG65hInrZXXoDWgf0/S827XXQk5/8ioacPVWa/NrNFJBf0EEn6w5qyh7/7tSUHGjSokc29EF8roP0XNZ0EB/i2uDnmJaItspmtfrqh9g8zG9i1wutJR6/dOqgLaCstQRrbQ5rbQ5rbQ5rbQ5rbQ5rbQ5rbY7/wfp37sDyoaflzbCnFXmFbyjogvoWwwUtfIP6WIeG55zk0B+EwpbtOnZUaUhfyHcYfSL4yOY8QZOgDygjVnE3RBb/lVozO0BD5NH7lt2O4+HKd4GkGSesEHm7qQai4w/MikcapvETZQAAAABJRU5ErkJggg==" alt="profile" />
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="justify-between">
                        <Link to={'/app/settings-profile'}>
                            Profile Settings
                            <span className="badge">New</span>
                            </Link>
                        </li>
                        <li className=''><Link to={'/app/settings-billing'}>Bill History</Link></li>
                        <div className="divider mt-0 mb-0"></div>
                        <li><a onClick={logoutUser}>Logout</a></li>
                    </ul>
                </div>
            </div>
            </div>

        </>
    )
}

export default Header