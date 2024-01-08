import { formatPrice } from '@/lib/utils';
import { Icons } from '../Icons';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface InfoCardProps {
  title: string;
  type?: "price" | "text";
  icon?: "withdrawal" | "revenue" | "active" | "user";
  subTitle: string;  // Add a new prop for the text value
}

export function OverviewInfoCard({ title, type = "text", subTitle, icon }: InfoCardProps) {
  const IconComponent = Icons[icon || "user"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <IconComponent className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {type === "price" ? formatPrice(5500) : subTitle || ""}
        </div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  );
}
