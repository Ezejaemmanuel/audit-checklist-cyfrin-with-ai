import { SignIn } from '@clerk/nextjs'

export default function Page() {

    return (
        <div className='flex flex-col items-center mt-8 justify-center min-h-[60vh] space-y-4'>
            <SignIn />

        </div>
    )

}