import Image from 'next/image';
import { RegisterForm } from '../../../components/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex flex-col items-center justify-center text-center mb-8">
                    <Image
                        src="/logo.webp"
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="mb-8"
                    />
                    <h2 className="text-xl text-gray-600 mb-8 font-['Montserrat Alternates']">Commencer les recherches</h2>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
