import './header.css'
import profileIcon from '../../assets/profile-picture.png'
import { useState } from 'react';

function Header() {
    const [isDashboardVisible, setIsDashboardVisible] = useState(false)

    const toggleDashboard = () => {
        setIsDashboardVisible(prev => !prev)
    }

    return (
        <>
            <header>
                <a href="/" className="logo">PickFavorite</a>
                <div className="profile">
                    <img onClick={() => toggleDashboard()} className="profile-icon" src={profileIcon} alt="1" />
                </div>
            </header>
            {isDashboardVisible &&
            <>
                <div className='dashboard'>
                    <div className="dashboard-content">
                        <a href="/registration">REGISTRATION</a>
                        <a href="/login">LOGIN</a>
                    </div>
                    <hr/>
                    <a href="/activity_center">ACTIVITY CENTER</a>
                </div>
                <div onClick={() => toggleDashboard()} className='overlay'></div>
            </>
            }
        </>
    );
}

export default Header;