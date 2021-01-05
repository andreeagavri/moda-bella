import Link from "next/link";
export default function SignIn() {
  return (
    <div>
      sign in
      <Link href="/signup">
        <a>Înregistrare</a>
      </Link>
    </div>
  );
}
