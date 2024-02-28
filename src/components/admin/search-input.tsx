import { UserFilterValues, userFilterSchema } from '@/schema/filter.schema';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { redirect } from 'next/navigation';
import React from 'react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    defaultValues: UserFilterValues
}
export function UsersSearchInput({ defaultValues, ...props }: SearchInputProps) {
    async function filterUsers(formData: FormData) {
        "use server";
        const values = Object.fromEntries(formData.entries());
        const { name, onboarded } = userFilterSchema.parse(values);
        const searchParams = new URLSearchParams({
            ...(name && { name: name.trim() }),
            ...(defaultValues.onboarded && { onboarded: defaultValues.onboarded }),
        });
        redirect(`/admin/users/?${searchParams.toString()}`);
    }

    return (
        <form action={filterUsers} key={JSON.stringify(defaultValues)}>
            <div className='flex flex-col md:flex-row gap-4 '>
                <Input placeholder="Search" className="pl-8 grow"  {...props} name='name' defaultValue={defaultValues.name} />
                <Button variant="default" type='submit'>Search</Button>
            </div>
        </form>
    )
}
