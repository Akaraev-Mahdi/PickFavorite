import { useRegistrationUserMutation } from '../../redux/userApi';
import './auth.css'
import { useState } from 'react';
import loading from '../../assets/Iphone-spinner-2.gif'
import mail from '../../assets/email.png'

function Registration() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [registrationUser, { data: tokens, isLoading, error: RegistrationError }] = useRegistrationUserMutation()

    const handleRegistration = async () => {

        const body = {
            username: username,
            email: email,
            password: password
        }

        await registrationUser(body).unwrap()
    }

    if(tokens !== undefined){
        return (
            <div className='auth-message'>
                <div className='auth-message-border'>
                    <img className='mailIcon' src={mail} alt='mail'/>
                    <div className='message'>We have sent an activation email to the address you provided.</div>
                </div>
            </div>
        )
    }

    return (
        <main>
            <div className="auth-place">
                <div className="auth-border">
                    {
                        isLoading ? 
                        <img className='loadingGif' src={loading} alt='...loding'/> : 
                        <>
                            <div className="auth-text">REGISTRATION</div>
                            <input value={username} onChange={e => setUsername(e.target.value)} className="auth-input" type="text" placeholder="name"/>
                            <input value={email} onChange={e => setEmail(e.target.value)} className="auth-input" type="text" placeholder="email"/>
                            <input value={password} onChange={e => setPassword(e.target.value)} className="auth-input" type="text" placeholder="password"/>
                            {RegistrationError && <div className='auth-error-message'>{RegistrationError.data.message || RegistrationError.data}</div>}
                            <div className="auth-btns">
                                <a className="auth-href" href="/login">Login</a>
                                <button onClick={() => handleRegistration()} className="auth-done-btn">Done</button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </main>
    );
}

export default Registration;