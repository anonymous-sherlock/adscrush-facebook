import TitleSection from '@/components/landing-page/title-section'
import { OnboardingForm } from '@/components/onboarding/onboardingForm'
import { Shell } from '@/components/shell'
import { getCurrentIsOnboarded } from '@/lib/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@routes'
import { redirect } from 'next/navigation'

async function Onboardingpage() {
    const isOnboarded = await getCurrentIsOnboarded()

    if(isOnboarded) redirect(DEFAULT_LOGIN_REDIRECT)
    return (
        <main className='flex flex-col gap-2 md:gap-6 md:p-20 justify-center items-center min-h-full grainy relative'>
            <Shell className='p-5 md:container max-w-3xl mx-auto'>
                <TitleSection
                    title="Onboarding Process"
                    subheading="Join thousands of satisfied users who rely on our platform for their personal and professional productivity needs."
                    pill="onboarding"
                />
                <OnboardingForm />
            </Shell>

        </main>
    )
}

export default Onboardingpage