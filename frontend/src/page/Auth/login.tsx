import { useState } from 'react'
import { useLoginUserMutation } from '../../redux/userApi';
import loading from '../../assets/Iphone-spinner-2.gif'
import './auth.css'

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loginUser, {isLoading, error: LoginError}] = useLoginUserMutation()

    const handleLogin = async () => {

        const body = {
            email: email,
            password: password
        }

        await loginUser(body).unwrap()
        location.replace('/')
    }

    return ( 
        <main>
            <div className="auth-place">
                <div className="auth-border">
                    {isLoading ? <img className='loadingGif' src={loading} alt='...loding'/> :
                    <>
                        <div className="auth-text">LOGIN</div>
                        <input value={email} onChange={e => setEmail(e.target.value)} className="auth-input" type="text" placeholder="email"/>
                        <input value={password} onChange={e => setPassword(e.target.value)} className="auth-input" type="text" placeholder="password"/>
                        {LoginError && <div className='auth-error-message'>{LoginError.data.message || LoginError.data}</div>}
                        <div className="auth-btns">
                            <a className="auth-href" href="/registration">Registration</a>
                            <button onClick={() => handleLogin()} className="auth-done-btn">Done</button>
                        </div>
                    </>
                    }
                </div>
            </div>
        </main>
    );
}

export default Login;