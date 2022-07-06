import Link from "next/link";
import Badge from "../UI/Badge";

export default function LandingNav() {
  return (
    <div className="left-0 top-0 fixed z-50 flex w-screen justify-center">
      <nav className="px-20 py-12 w-full max-w-screen-2xl">
        <Link href="/">
          <a className="flex items-center gap-2">
            <h2>cuota.</h2>
            <Badge>Beta</Badge>
          </a>
        </Link>
      </nav>
    </div>
  );
}
