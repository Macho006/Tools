import Page from "./app/page";
import ImageCompressorPage from "./components/compressor/ImageCompressorPage";
import LinkPreviewTool from "./components/link-preview/LinkPreviewTool";
import Merge from "./components/merge-pdf/merge";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <LinkPreviewTool />
        <Page />
        <ImageCompressorPage />
        <Merge />
      </div>
    </div>
  );
}
