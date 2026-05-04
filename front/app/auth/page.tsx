import Image from "next/image";
import AuthInfo from "./components/AuthInfo";

export default function AuthPage() {
  return (
    <div className="flex justify-between ">
      <div className="flex flex-col gap-20">
        <div className="flex justify-center">
          <Image
            src="/fallenway-logo.svg"
            width={400}
            height={400}
            alt="Foto de perfil"
          />
        </div>
        <div>
          <AuthInfo />
        </div>
      </div>
      <div>
        <h1>hello</h1>
      </div>
    </div>
  );
}
