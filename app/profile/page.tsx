import React from 'react';
import { AuthContext } from '@/context/AuthContext';
import Footer from '@/components/Footer';
import { redirect } from 'next/navigation';

export default function page() {
    const authContext = React.useContext(AuthContext);
    const auth = authContext?.auth;

    if(!auth) {
        redirect('/auth/login');
    }

    return (
        <div>

            <Footer />
        </div>
    )
}
