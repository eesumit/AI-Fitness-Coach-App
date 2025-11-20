'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from './ModeToggle'

const Navbar = () => {
    const pathname = usePathname()
    return (
        <div className='w-full h-16 font-sans font-bold text-xl flex items-center justify-center gap-10 border-b-2'>
            <div>
                <Link href="/" className={pathname === '/' ? 'underline' : ''}>
                    Home
                </Link>
            </div>
            <div>
                <Link href="/user-info" className={pathname === '/user-info' ? 'underline' : ''}>
                    Get Personalised Plan
                </Link>
            </div>
            <div>
                <Link href="/latest-plan" className={pathname === '/latest-plan' ? 'underline' : ''}>
                    Latest Plan
                </Link>
            </div>
            <div>
                <Link
                    href="/plans"
                    className={pathname.startsWith('/plans') ? 'underline' : ''}
                >
                    Plans
                </Link>

            </div>
            <div>
                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar