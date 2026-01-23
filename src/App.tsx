import ImageCompressorPage from "./components/compressor/ImageCompressorPage";
import LinkPreviewTool from "./components/link-preview/LinkPreviewTool";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <LinkPreviewTool />
        <ImageCompressorPage />
      </div>
    </div>
  );
}
