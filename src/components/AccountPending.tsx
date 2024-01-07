import pendingImage from "@/public/pending-approval.png";
import { Card } from "@nextui-org/react";
import Image from 'next/image';

function AccountPending() {
    return (
        <Card className="m-4 sm:mx-auto p-10 md:mt-10 max-w-[500px] flex flex-col justify-center items-center">
            <div className='mx-auto mt-2'>
                <Image src={pendingImage.src} alt='account pending image' width={300} height={300} className="my-2 mx-auto object-contain" />
                <h2 className='text-2xl my-2 text-center'>Account application proccessing</h2>
                <p className='text-center text-sm'>Your account application is currently under review & will be finalize shortly.
                    To fast track your account proccessing, you can try to contact our customer services.</p>
            </div>
        </Card>
    )
}

export default AccountPending