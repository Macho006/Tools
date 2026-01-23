import { TitleGenerator } from "@/components/title-generator/TitleGenerator";

export default function Page() {
    return (
        <div>
            <header className="text-center">
                <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">YouTube Title Generator</h1>
                <p className="mt-4 text-base text-white/55 md:text-lg">
                    Generate viral, high-CTR video titles using AI templates.
                </p>
            </header>

            <div className="mt-10">
                <TitleGenerator />
            </div>
        </div>
    );
}
