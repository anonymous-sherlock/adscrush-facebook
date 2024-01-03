
import Logo from '@/public/logo.png';
import Image from 'next/image';
import Link from 'next/link';

import { useCurrentUser } from '@/lib/hooks/use-current-user';
import { authPages } from '@routes';
import { Button, buttonVariants } from '../ui/button';
import { getCurrentUser } from '@/lib/auth';


const Header = async () => {

const user= await getCurrentUser()
  return (
    <header
      className="p-4
      flex
      justify-center
      items-center
  "
    >
      <Link
        href={'/'}
        className="w-full flex gap-2
        justify-left items-center"
      >
        <Image
          src={Logo}
          alt="Cypress Logo"
          width={30}
          height={30}
          className='rounded-md'
        />
        <span
          className="font-semibold
          dark:text-white text-lg
        "
        >
          Adscrush.
        </span>
      </Link>

      <aside
        className="flex
        w-full
        gap-2
        justify-end
      "
      >{
          user ?
            <Link
              href='/dashboard'
              className={buttonVariants({
                variant: 'ghost',
              })}>
              Dashboard
            </Link>
            : null
        }
        <Link href={authPages.login}>
          <Button
            variant="btn-secondary"
            className=" p-1 hidden sm:block"
          >
            Login
          </Button>
        </Link>
        <Link href={authPages.register}>
          <Button
            variant="btn-primary"
            className="whitespace-nowrap"
          >
            Sign Up
          </Button>
        </Link>
      </aside>
    </header>
  );
};

export default Header;

