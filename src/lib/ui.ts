export const shell =
  "min-h-screen text-white";

export const background =
  "relative isolate overflow-hidden bg-[#050507] " +
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 " +
  "before:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_60%),radial-gradient(circle_at_left,rgba(16,185,129,0.10),transparent_55%)]";

export const heroTitle =
  "text-5xl md:text-6xl font-extrabold tracking-tight " +
  "bg-clip-text text-transparent bg-[linear-gradient(180deg,#ffffff,rgba(255,255,255,0.65))]";

export const heroSubtitle =
  "mt-4 text-base md:text-lg text-white/55";

export const frame =
  "rounded-[28px] border border-white/10 bg-white/[0.03] " +
  "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_120px_rgba(0,0,0,0.75)] " +
  "backdrop-blur-xl";

export const panel =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 " +
  "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]";

export const panelHeader =
  "flex items-center justify-between gap-3 px-6 py-5";

export const panelTitle =
  "text-sm font-semibold tracking-wide text-white/90";

export const panelSubtle =
  "text-xs tracking-widest font-semibold text-white/55";

export const input =
  "h-12 rounded-2xl border-white/10 bg-white/5 text-white " +
  "placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-white/20";

export const primaryBtn =
  "h-12 w-full rounded-2xl text-white " +
  "bg-[linear-gradient(180deg,rgba(59,130,246,1),rgba(37,99,235,1))] " +
  "shadow-[0_16px_40px_rgba(37,99,235,0.35)] " +
  "hover:brightness-110 active:brightness-95 disabled:opacity-60";

export const toggle = `
  relative h-11 w-full rounded-2xl 
  flex items-center justify-center px-4
  text-sm font-medium tracking-wide
  text-white/60 border border-white/5 bg-white/[0.03]
  backdrop-blur-md transition-all duration-300 ease-out
  
  hover:bg-white/[0.08] hover:text-white/90 hover:border-white/10
  
  data-[state=on]:bg-white/[0.12] 
  data-[state=on]:text-white 
  data-[state=on]:border-white/20 
  data-[state=on]:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]
  data-[state=on]:backdrop-blur-lg
`;

export const resultCard =
  "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] " +
  "hover:bg-white/[0.055] transition " +
  "hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.6)]";

export const softDivider =
  "bg-white/10";