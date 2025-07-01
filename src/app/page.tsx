import "./indexStyle.css";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-800/10 rounded-full animate-pulse blur-xl"></div>
        <div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-gray-700/10 rounded-full animate-pulse blur-xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-slate-800/10 rounded-full animate-pulse blur-xl"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-zinc-700/10 rounded-full animate-pulse blur-xl"
          style={{ animationDelay: "0.5s" }}
        ></div>
        {/* Floating particles */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-gray-400/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-white">Hello World</h1>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
