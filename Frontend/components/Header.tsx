export default function Header(props: any) {
  const handleLogo = () => {
    window.location.href = "/";
  }
  return (
    <div className="w-full shadow h-20 flex items-center p-4 justify-between">
      <div className="flex items-center gap-8">
        <img src="images/logo-black.png" className="w-16 cursor-pointer" onClick={handleLogo}></img>
        <h2 className="text-xl sm:text-4xl">{props.text}</h2>
      </div>
      <div>
        <a href="/">Go to Home</a>
      </div>
    </div>
  )
}