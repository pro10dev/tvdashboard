import Image from "next/image";

export default function Welcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-fade-in">
      <Image
        src="/images/logo.gif"
        alt="RICTMD-10 Logo"
        width={200}
        height={200}
        className="drop-shadow-[0_0_30px_rgba(0,200,255,0.3)]"
        priority
        unoptimized
      />
      <div className="flex flex-col items-center gap-3">
        <h1
          className="text-3xl font-bold tracking-[0.12em] text-foreground text-center uppercase"
          style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
        >
          Welcome to Regional Information and
          <br />
          Communications Technology Management
        </h1>
        <p
          className="text-xl tracking-[0.15em] text-muted text-center uppercase"
          style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
        >
          Secured, Mobile, AI-driven, Real-Time, Technology Policing
        </p>
      </div>
    </div>
  );
}
