
import { ProfileSettingsForm } from "@/components/forms/profile-settings-form"
import { Shell } from "@/components/shell"
import { redirect } from "next/navigation"


function SettingsPage() {

  redirect("settings/payout")
  return (
    <Shell className='bg-white'>
      <ProfileSettingsForm />
    </Shell>
  )
}

export default SettingsPage