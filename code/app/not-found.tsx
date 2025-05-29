import Link from "next/link";

export default function NotFound() {
 return (
  <div className="flex justify-center items-center flex-grow text-main-text min-h-screen bg-off-white">
    <div className="flex flex-col space-y-4 text-xl font-medium items-center">
      <h2 className="text-4xl">404 - Not Found</h2>
      <p>Page does not exist!</p>
      <Link href='/' className="hover:text-brand active:text-brand">Go back to home page</Link>
    </div>
  </div>
 );
}
