import { RegisterForm } from '../../components/RegisterForm';
import { NextPage } from 'next';

const RegisterPage: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
