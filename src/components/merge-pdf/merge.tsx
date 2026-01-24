"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/bytes";
import { AnimatePresence, motion } from "framer-motion";

interface PdfFile {
  id: string;
  file: File;
}

export default function Merge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    if (direction === "up" && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [
        newFiles[index - 1],
        newFiles[index],
      ];
    } else if (direction === "down" && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [
        newFiles[index + 1],
        newFiles[index],
      ];
    }
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const fileBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `merged-document-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert(
        "Failed to merge PDFs. One or more files might be corrupted or password protected.",
      );
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Merge PDF Files
          </h1>
          <p className="text-lg text-white/60">
            Combine multiple PDF files into one single document instantly.
          </p>
        </div>

        <Card className="bg-black/20 border-white/10 p-8 rounded-3xl backdrop-blur-sm">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`
              relative group cursor-pointer
              border-2 border-dashed rounded-2xl p-12
              transition-all duration-200 ease-in-out
              flex flex-col items-center justify-center text-center
              outline-none
              ${
                isDragActive
                  ? "border-white/40 bg-white/5 scale-[0.99]"
                  : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
              }
            `}
          >
            <input {...getInputProps()} />

            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-8 h-8 text-white/80" />
            </div>

            <h3 className="text-xl font-semibold mb-2 text-white/90">
              {isDragActive
                ? "Drop PDF files here..."
                : "Drag & Drop PDF files here"}
            </h3>
            <p className="text-sm text-white/40">or click to upload files</p>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <div className="mt-8 space-y-3">
                {files.map((pdf, index) => (
                  <motion.div
                    key={pdf.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-white/70" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white/90 truncate">
                        {pdf.file.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {formatBytes(pdf.file.size)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1 mr-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFile(index, "up");
                          }}
                          disabled={index === 0 || isMerging}
                          className="p-1 hover:bg-white/10 rounded text-white/60 disabled:opacity-30 hover:text-white"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFile(index, "down");
                          }}
                          disabled={index === files.length - 1 || isMerging}
                          className="p-1 hover:bg-white/10 rounded text-white/60 disabled:opacity-30 hover:text-white"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(pdf.id);
                        }}
                        disabled={isMerging}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div
            className={`mt-8 flex justify-center transition-all duration-300 ${
              files.length > 0
                ? "opacity-100 translate-y-0"
                : "opacity-50 translate-y-4 pointer-events-none"
            }`}
          >
            <Button
              size="lg"
              onClick={handleMerge}
              disabled={isMerging || files.length === 0}
              className="rounded-full px-12 h-14 text-base font-semibold bg-white text-black hover:bg-white/90 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-70"
            >
              {isMerging ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Merging...
                </>
              ) : (
                "Merge PDF Files"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
