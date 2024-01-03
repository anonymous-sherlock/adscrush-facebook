import TitleSection from '@/components/landing-page/title-section'
import { OnboardingForm } from '@/components/onboarding/onboardingForm'
import {
    Card,
    CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card'
import React from 'react'

function Onboardingpage() {
    return (
        <main className='flex flex-col gap-2 md:gap-6 md:p-20 justify-center items-center min-h-full grainy relative'>
            <TitleSection
                title="Onboarding Process"
                subheading="Join thousands of satisfied users who rely on our platform for their 
            personal and professional productivity needs."
                pill="onboarding"
            />
            <OnboardingForm />
        </main>
    )
}

export default Onboardingpage