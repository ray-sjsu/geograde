"use client";
import { useRouter } from "next/navigation";
import Link from 'next/link'
import React from 'react';

const ContactUs = () => {
    const router = useRouter(); 

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log(`${text} copied to clipboard! ^_^`);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 flex-col space-y-2">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <div>
                    <h1>BTW THIS IS NOT DONE YET</h1>
                    <p>
                        Have any questions? Ideas? Contact us!
                        
                    </p>

                    <button onClick={() => handleCopy('example@gmail.com')}>
                        Email: example@gmail.com
                    </button>
                        
                    <button onClick={() => handleCopy('800-fake-number')}>
                        Number: 800-fake-number
                    </button>
                </div>

            </div>

            <div className="w3-container"> <br></br>
                
                    Developers:
                    <ul>
                        <li>Liem Le</li>
                        <li>Raymund Mercader</li>
                        <li>Sarah Loh</li>
                        <li>Steven Lu</li>
                    </ul>

                    <br></br><br></br>

                    Professor: Ishie Eswar
                    <br></br>
                    Class: CMPE - 133
                    <br></br>
                    Fall 2024, SJSU
                
            </div>
        </div>    
    
    );
};

export default ContactUs;
