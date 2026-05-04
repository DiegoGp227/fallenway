interface ISelectAuthSystemProps {
  setIsLogin: (state: boolean) => void;
  isLogin: boolean;
}

export default function SelectAuthSystem({
  setIsLogin,
  isLogin,
}: ISelectAuthSystemProps) {
  return (
    <div className="bg-surface flex p-1 rounded-lg w-full">
      <button
        onClick={() => setIsLogin(true)}
        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
          isLogin
            ? "bg-bg shadow-sm text-text"
            : "text-fg-muted hover:text-text"
        }`}
      >
        Login
      </button>
      <button
        onClick={() => setIsLogin(false)}
        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
          !isLogin
            ? "bg-bg shadow-sm text-text"
            : "text-fg-muted hover:text-text"
        }`}
      >
        Register
      </button>
    </div>
  );
}
