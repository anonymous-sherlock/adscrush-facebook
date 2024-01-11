import React from 'react'

interface UserPageProps {
    params: {
        userId: string
    }
}
function UserPage({ params: { userId } }: UserPageProps) {
    return (
        <div>{userId}</div>
    )
}

export default UserPage