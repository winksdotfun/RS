import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from "../assets/Icons/logo.png";
import Mail from "../assets/Icons/mail.png";
import Footer from './Footer';
import axios from 'axios';

const Email = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = async (email) => {
        try {
            const response = await axios.post('https://rhinospiderapi.vercel.app/api/auth/validate-email', {
                email
            });
            setError('');
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError('This email is already registered');
                } else if (error.response.status === 500) {
                    setError('Server error. Please try again');
                } else {
                    setError(error.response.data.message || 'Validation failed');
                }
            } else {
                setError('Network error. Please check your connection');
            }
            throw error;
        }
    };

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            await validateEmail(email);
            setError('');
            // Store email in sessionStorage after successful validation
            sessionStorage.setItem('userEmail', email);
            onNext();
        } catch (error) {
            console.error('Submit Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear error when user starts typing
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    return (
        <div className='bg-custom-bg2 bg-cover bg-center h-fit w-fit p-4 sm:p-10 rounded font-semibold relative'>
            <div className="w-[220px] sm:w-[380px]">
                <img 
                    src={Logo} 
                    className='w-16 sm:w-24 h-auto absolute top-0 right-0' 
                    alt="RhinoSpider" 
                />
                <p className='text-base sm:text-3xl'>Email</p>
                <p className='text-xs sm:text-base font-normal py-3'>
                    Please make sure your email address is correct so we can get in touch with you.
                </p>
                <div className='border-2 border-white rounded-[20px] p-2 sm:p-3 flex items-center gap-2 glow-container'>
                    <img src={Mail} className='w-8 h-auto' alt="Mail" />
                    <input
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={handleEmailChange}
                        className='text-base sm:text-xl bg-transparent outline-none w-full font-normal'
                    />
                </div>
                {error && (
                    <p className='text-red-500 text-sm mt-2 px-3'>
                        {error}
                    </p>
                )}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={`bg-white text-black text-sm sm:text-base p-2 sm:p-3 mt-2 sm:mt-5 rounded-full mx-auto w-full glow-button ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Validating...' : 'Next'}
                </motion.button>
                <Footer />
            </div>
        </div>
    );
};

export default Email;