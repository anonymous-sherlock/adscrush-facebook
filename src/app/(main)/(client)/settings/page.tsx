import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";

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
      <Card className="w-full md:w-2/5 h-auto">
        <CardHeader> </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Shell>
  );
}

export default SettingsPage;
