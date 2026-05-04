import AuthInfo from "./components/molecules/AuthInfo";
import AuthSistem from "./components/organism/AuthSistem";

export default function AuthPage() {
  return (
    <div className="flex flex-1 gap-8 py-8">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 min-w-0">
        <AuthInfo />
      </div>
      <div className="shrink-0 w-2/5 max-w-lg min-w-72 flex items-center rounded-xl bg-bg/90 overflow-y-auto">
        <AuthSistem />
      </div>
    </div>
  );
}
