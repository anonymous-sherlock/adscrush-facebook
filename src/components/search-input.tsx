import { UserFilterValues, userFilterSchema } from '@/schema/filter.schema';
import { redirect } from 'next/navigation';
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';


interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    defaultValues: UserFilterValues
}

async function filterUsers(formData: FormData) {
    "use server";

    const values = Object.fromEntries(formData.entries());
    const { name } = userFilterSchema.parse(values);

    const searchParams = new URLSearchParams({
        ...(name && { name: name.trim() }),
    });


    redirect(`/admin/users/?${searchParams.toString()}`);
}
export function SearchInput({ defaultValues, ...props }: SearchInputProps) {
    return (
        <form action={filterUsers} key={JSON.stringify(defaultValues)}>
            <div className='flex gap-4 '>
                <Input placeholder="Search" className="pl-8 grow"  {...props} name='name' defaultValue={defaultValues.name} />
                <Button variant="default" type='submit'>Submit</Button>
            </div>
        </form>
    )
}
