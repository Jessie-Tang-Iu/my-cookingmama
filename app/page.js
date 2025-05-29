import Link from "next/link";
import Login from "./login/page";


export default function Home() {

  let linkStyles = "text-cyan-600 underline hover:text-cyan-300";

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1 className="text-3xl"><strong>My Cooking Mama</strong></h1>
      <br />
      <ul>
        {/* <li> <Link href="./userProfile/" className={linkStyles}>Go to My Profile</Link> </li> */}
        <Login />
        {/* <li> <Link href="./login/" className={linkStyles}>Try Log In</Link> </li> */}
      </ul>
    </main>
  );
}
