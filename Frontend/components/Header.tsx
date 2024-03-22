import Link from "next/link";
import Image from "next/image";
export default function Header(props: any) {
  const handleLogo = () => {
    window.location.href = "/";
  }
  return (
    <div className="w-full shadow h-20 flex items-center p-4 justify-between">
      <div className="flex items-center gap-8">
        <Image src="images/logo-black.png" alt="logo" className="cursor-pointer" width={64} height={64} onClick={handleLogo}></Image>
        <h2 className="text-xl sm:text-4xl">{props.text}</h2>
      </div>
      <div>
        <Link href="/">Go to Home</Link>
      </div>
    </div>
  )
}