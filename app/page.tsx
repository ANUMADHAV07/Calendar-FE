import Image from "next/image";
import AuthButton from "./_components/AuthButton";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <AuthButton />
      </div>
    </div>
  );
}
