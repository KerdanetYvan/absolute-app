import Image from 'next/image';
import { RegisterForm } from '../../../components/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="h-screen max-h-screen overflow-hidden snap-none dark:bg-[#454141] flex flex-col justify-center py-8 px-4 relative">
            <div className="mx-auto w-full max-w-md">
                <div className="flex flex-col items-center justify-center text-center">
                    <Image
                        src="/logo.webp"
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="dark:hidden absolute mx-auto top-[12%]"
                    />
                    <Image
                        src='/logo_dark.webp'
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="hidden dark:block absolute mx-auto top-[12%]"
                    />
                    <h2 className="text-xl text-gray-600 dark:text-white mb-8 font-montserrat">Commencer les recherches !</h2>
                </div>
                <RegisterForm />
            </div>
            
            <div className='absolute bottom-0 left-0 w-full h-[150px] overflow-hidden pointer-events-none'>
                <span className='bg-[#FCB259] dark:bg-[#3CBDD1] w-[298px] h-[298px] left-[-50px] top-[30px] rounded-full absolute z-0'></span>
                <span className='w-[247px] h-[247px] bg-[#FCB259]/30 dark:bg-[#3CBDD1]/30 backdrop-blur-sm rounded-full absolute z-10 top-0 right-[-50px]'>
                </span>
            </div>
        </div>
    );
}
