import { Shell } from '@/components/shell'
import Image from 'next/image'
import WalletImage from "@/public/icons/wallet-no-data.png"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AddUpiForm } from '@/components/forms/add-upi-form'
import { PaymentMethodsCard } from '@/components/cards/payment-methods-card'
import { db } from '@/db'
import { getCurrentUser } from '@/lib/auth'
import { AddNetbankingForm } from '@/components/forms/add-netbanking-form'


async function PayoutPage() {
  const user = await getCurrentUser()

  const paymentMethods = await db.userPaymentMethod.findMany({
    where: {
      UserPrefrence: {
        userId: user?.id
      }
    }
  })
  return (
    <Shell className='min-h-80 flex gap-4 justify-between items-stretch !p-0'>
      <div className='flex-1 h-auto'>
        <Accordion type="single" className='space-y-2' defaultValue='UPI'>
          <AccordionItem value="UPI" className='bg-white p-4 border'>
            <AccordionTrigger>UPI</AccordionTrigger>
            <AccordionContent className=''>
              <div className='grid grid-cols-2 gap-3'>
                {paymentMethods.filter((pay) => pay.methodType === "UPI").map((payment) => {
                  return <PaymentMethodsCard paymentMethod={payment} key={payment.id} />
                })}
              </div>
              <AddUpiForm className='justify-end mt-4 ml-auto' />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="NETBANKING" className='bg-white p-4 border'>
            <AccordionTrigger>NETBANKING</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2 gap-3'>
                {paymentMethods.filter((pay) => pay.methodType === "NETBANKING").map((payment) => {
                  return <PaymentMethodsCard paymentMethod={payment} key={payment.id} />
                })}
              </div>
              <AddNetbankingForm className='justify-end mt-4 ml-auto' />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
      <div className='w-1/3 bg-white border h-auto p-4 flex gap-4 flex-col items-center justify-center'>
        <Image src={WalletImage.src} width={100} height={100} alt='wallet image' />
        <p className='text-sm text-center'>
          Add your details to the payment method which is convenient for you. Wire transfers are processed through a personal manager. Each method has its commision - that&apos;s life
        </p>
      </div>
    </Shell>
  )
}

export default PayoutPage