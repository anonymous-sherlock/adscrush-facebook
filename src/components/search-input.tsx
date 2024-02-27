import { UserFilterValues, userFilterSchema } from '@/schema/filter.schema';
import { redirect } from 'next/navigation';
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';


interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    defaultValues: UserFilterValues
}

async function filterUsers(formData: FormData) {
    "use server";
    const values = Object.fromEntries(formData.entries());
    const { name, onboarded } = userFilterSchema.parse(values);
    const searchParams = new URLSearchParams({
        ...(name && { name: name.trim() }),
        ...(onboarded && { onboarded: "true" }),
    });
    redirect(`/admin/users/?${searchParams.toString()}`);
}
export function SearchInput({ defaultValues, ...props }: SearchInputProps) {
    return (
        <form action={filterUsers} key={JSON.stringify(defaultValues)}>
            <div className='flex gap-4 '>
                <Input placeholder="Search" className="pl-8 grow"  {...props} name='name' defaultValue={defaultValues.name} />
                <div className="flex items-center space-x-2 grow shrink-0">
                    <Switch id="onboarded-mode" name='onboarded' defaultChecked={defaultValues.onboarded} />
                    <Label htmlFor="onboarded-mode">Onboarded Users</Label>
                </div>
                <Button variant="default" type='submit'>Search</Button>
            </div>
        </form>
    )
}
