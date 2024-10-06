import { Link, useSearchParams } from "react-router-dom"
import { SignedOut, SignedIn, UserButton, SignIn, useUser } from "@clerk/clerk-react"
import { Button } from "./ui/button"
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react"
import { useState, useEffect } from "react"

const Header = () => {
    const [ showSignIn, setShowSignIn ] = useState(false)

    const { user } = useUser()

    const [ search, setSearch ] = useSearchParams()

    useEffect(() => {
        if(search.get('sign-in')) {
            setShowSignIn(true)
        }
    }, [search])

    const handleOverlayClick = (e) => {
        if(e.target === e.currentTarget) {
            setShowSignIn(false)
            setSearch({})
        }
    }
  return (
    <>
        <nav className="py-4 flex justify-between items-center">
            <Link to='/'>
                <img src={'/logo.png'} alt="logo" className="h-20"  />
            </Link>
        
            <div className="flex gap-8">
                <SignedOut>
                    <Button variant='outline' onClick={() => setShowSignIn(true)}>
                        Login
                    </Button>
                </SignedOut>
                <SignedIn>
                    {user?.unsafeMetadata?.role === 'recruiter' && (
                        <Link to={'/post-job'}>
                            <Button variant='destructive' className="rounded-full">
                                <PenBox size={20} className="mr-2" />
                                Post a Job
                            </Button>
                        </Link>
                    )}
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }}
                    >
                        <UserButton.MenuItems>
                            <UserButton.Link 
                                label="My Jobs"
                                labelIcon={<BriefcaseBusiness size={15} />}
                                href="/my-jobs"
                            />
                             <UserButton.Link 
                                label="Saved Jobs"
                                labelIcon={<Heart size={15} />}
                                href="/saved-jobs"
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                </SignedIn>
            </div>
        </nav>
        {showSignIn && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" 
                onClick={handleOverlayClick}
            >
                <SignIn 
                    signUpForceRedirectUrl="/onboarding"
                    fallbackRedirectUrl="/onboarding"
                />
           </div>
        )}
    </>
  )
}

export default Header