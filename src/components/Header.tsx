import { MENTOR_EMAIL } from '@/constants/constants';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  let navigation;
  if (session?.user?.email?.endsWith(MENTOR_EMAIL)){
    navigation = (<nav className="flex-1 text-center">
      <Link href="/dashboard">
        <span className={router.pathname == "/dashboard" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Converter</span>
      </Link>
      <Link href="/acolytes">
        <span className={router.pathname == "/acolytes" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Bonifications</span>
      </Link>
      <Link href="/player">
        <span className={router.pathname == "/player" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Player</span>
      </Link>
      <Link href="/hall">
        <span className={router.pathname == "/hall" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Hall of Fame</span>
      </Link>
    </nav>);
  } else {
    navigation = (<nav className="flex-1 text-center">     
      <Link href="/player">
        <span className={router.pathname == "/player" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Player</span>
      </Link>
      <Link href="/results">
        <span className={router.pathname == "/results" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Results</span>
      </Link>
      <Link href="/hall">
        <span className={router.pathname == "/hall" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Hall of Fame</span>
      </Link>
      <Link href="/shop">
        <span className={router.pathname == "/shop" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Aivan's Shop</span>
      </Link>
      <Link href="/shop/seller">
        <span className={router.pathname == "/shop/seller" ? "text-4xl mx-6 underline" :"text-4xl mx-6 hover:underline"}>Seller's Shop</span>
      </Link>
    </nav>);
  }

  return (
    <header className="fixed w-full bg-black text-white shadow-md py-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center"> 
          <Image src="/images/kaotika.png" alt="Logo" width={200} height={60} />
        </div>
        {
          navigation
        }
        <div className="flex items-center">
          <Image src={session?.user?.image || '/default-avatar.png'} alt="User Avatar" width={48} height={48} className="sepia rounded-full" />
          <button onClick={handleSignOut} className="text-4xl px-3 py-6 ml-2 text-medievalSepia hover:text-darkSepia">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;