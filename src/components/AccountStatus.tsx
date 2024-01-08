import pendingImage from "@/public/pending-approval.png";
import { Card } from "@nextui-org/react";
import { Onboarding_Status } from "@prisma/client";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import Image from 'next/image';

interface AccountStatusProps {
    status: Onboarding_Status;
}

export function AccountStatus({
    status
}: AccountStatusProps) {
    return (
        <Card className="m-4 sm:mx-auto p-10 md:mt-10 max-w-[500px] flex flex-col justify-center items-center">
            <div className='mx-auto mt-2 flex justify-center flex-col items-center'>
                {status === 'Declined' ? (
                    <>
                        <AlertTriangle className="w-14 h-14 text-destructive-foreground my-2" />
                        <h2 className='text-2xl my-2 text-center'>Account application declined!</h2>
                        <p className='text-center text-sm'>We&apos;re sorry, but your account application has been declined. If you have any questions, please contact our customer services.</p>
                    </>
                ) : (
                    <>
                        <AlertOctagon className="w-14 h-14 text-yellow-500 my-2" />
                        {/* Uncomment the next line if you want to display an image */}
                        {/* <Image src={pendingImage.src} alt='account pending image' width={300} height={300} className="my-2 mx-auto object-contain" style={{ width: "auto", height: "auto" }} /> */}
                        <h2 className='text-2xl my-2 text-center'>Account application processing</h2>
                        <p className='text-center text-sm'>Your account application is currently under review and will be finalized shortly. To fast track your account processing, you can try to contact our customer services.</p>
                    </>
                )}
            </div>
        </Card>
    )
}
