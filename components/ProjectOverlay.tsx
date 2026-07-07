"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryImage, Project } from "@/lib/projects";
import { useLang } from "@/components/LanguageProvider";
import { lenisRef } from "@/lib/scrollState";
import { trackViewContent } from "@/lib/pixel";

export default function ProjectOverlay({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const [zoom, setZoom] = useState<GalleryImage | null>(null);
  const [zoomedIn, setZoomedIn] = useState(false);
  const { lang, t } = useLang();

  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog) return;
    dialog.showModal();
    closing.current = false; // re-arm the close guard each open
    dialog.scrollTop = 0;
    lenisRef.current?.stop();
    // Back button (mobile) closes the overlay instead of leaving the site.
    history.pushState({ overlay: project.slug }, "");
    trackViewContent(project.slug);
    const onPop = () => dialog.close();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      lenisRef.current?.start();
      if (dialog.open) dialog.close();
    };
  }, [project]);

  // Every UI close goes through history.back() so the pushed entry is
  // consumed; the popstate handler does the actual dialog.close().
  // history.back() resolves async, so guard against a re-entrant second
  // call (double-click) popping past our entry and leaving the site.
  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    history.back();
  };

  if (!project) return null;

  return (
    <dialog
      ref={ref}
      className="project-overlay"
      aria-label={project.title}
      onClose={() => {
        setZoom(null);
        setZoomedIn(false);
        onClose();
      }}
      onCancel={(e) => {
        e.preventDefault(); // Esc: close zoom first, dialog second
        if (zoom) {
          setZoom(null);
          setZoomedIn(false);
        } else {
          requestClose();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose(); // backdrop click
      }}
    >
      <div className="overlay-inner">
        <button className="overlay-close" onClick={requestClose} aria-label={t.work.close}>
          ×
        </button>
        <header className="overlay-head">
          <span className="pill">{t.work.categories[project.category]}</span>
          <h3>{project.title}</h3>
          {project.description && <p>{project.description[lang]}</p>}
        </header>
        <div className="overlay-gallery">
          {project.video && <video src={project.video} muted loop playsInline controls preload="metadata" />}
          {project.images.map((img) => (
            <button className="gallery-item" key={img.src} onClick={() => setZoom(img)} aria-label={t.work.zoom}>
              <Image src={img.src} alt={project.title} width={img.w} height={img.h} sizes="(max-width: 960px) 92vw, 880px" />
            </button>
          ))}
        </div>
      </div>
      {zoom && (
        <div className="zoom-layer">
          <button
            className="overlay-close"
            onClick={() => {
              setZoom(null);
              setZoomedIn(false);
            }}
            aria-label={t.work.close}
          >
            ×
          </button>
          <div className={`zoom-scroll${zoomedIn ? " zoomed" : ""}`} onClick={() => setZoomedIn((v) => !v)}>
            {/* separate <Image> so the high-res variant is only fetched on zoom */}
            <Image src={zoom.src} alt={project.title} width={zoom.w} height={zoom.h} sizes={zoomedIn ? "250vw" : "100vw"} />
          </div>
        </div>
      )}
    </dialog>
  );
}
