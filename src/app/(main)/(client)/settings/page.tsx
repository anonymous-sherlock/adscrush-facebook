import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";
import WelcomeImage from "@/public/welcome.png"

async function SettingsPage() {
  const user = await getCurrentUser();
  const userInfo = await db.userPrefrence.findFirst({
    where: { userId: user?.id },
    select: {
      phone: true,
      skype: true,
      telegram: true,
      whatsapp: true,
      facebook: true,
    },
  });

  return (
    <Shell className="flex flex-col md:flex-row gap-4 justify-between  items-stretch !p-0">
      <Card className="flex-1 w-full md:w-3/5">
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileSettingsForm
            userDetails={
              {
                name: user?.name || "",
                email: user?.email || "",
                phone: userInfo?.phone || "",
                skype: userInfo?.skype || "",
                telegram: userInfo?.telegram || "",
                whatsapp: userInfo?.whatsapp || "",
                facebook: userInfo?.facebook || "",
              } || null
            }
          />
        </CardContent>
      </Card>

      {/* right card */}
      <Card className="w-full md:w-2/5 h-auto flex justify-center items-center">
        <div className="flex flex-col justify-center items-center text-center gap-3  p-6">
          <Image src={WelcomeImage.src} width={250} height={250} alt='Welcome image' />
          <h3 className="text-xl md:text-2xl font-semibold text-pretty text-primary ">Welcome on Board, lets get started with Adscrush</h3>
          <p className="">Telling us a bit about yourself to get the best experience, this will only take a minute or two.</p>
        </div>
      </Card>
    </Shell>
  );
}

export default SettingsPage;
