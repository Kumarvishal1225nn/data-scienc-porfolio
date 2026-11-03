"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Photo that wipes open on scroll and drifts slower than the page. */
export function ParallaxPhoto({ src, alt, position, sizes }: { src: string; alt: string; position?: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div className="absolute inset-[-10%_0]" style={{ y }}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position ?? "50% 50%" }} />
      </motion.div>
    </motion.div>
  );
}
