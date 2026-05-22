"use client"

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.2, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
