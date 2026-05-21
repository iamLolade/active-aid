/** @typedef {{ title: string, instruction: string, durationSeconds: number }} SessionStep */
/** @typedef {{ id: string, title: string, tagline: string, durationMinutes: number, steps: SessionStep[] }} Session */

/** @type {Session[]} */
export const SESSIONS = [
  {
    id: "neck",
    title: "Neck Relief",
    tagline: "Ease tension from screen time",
    durationMinutes: 2,
    steps: [
      {
        title: "Settle in",
        instruction: "Sit tall with feet flat. Let your shoulders drop away from your ears.",
        durationSeconds: 25,
      },
      {
        title: "Chin tuck",
        instruction:
          "Slowly draw your chin toward your chest. Hold gently, only if it feels comfortable.",
        durationSeconds: 30,
      },
      {
        title: "Side stretch",
        instruction:
          "Tilt your ear toward one shoulder, then the other. Move slowly, no forcing.",
        durationSeconds: 40,
      },
      {
        title: "Shoulder rolls",
        instruction: "Roll your shoulders back in small circles. Breathe steadily.",
        durationSeconds: 25,
      },
    ],
  },
  {
    id: "wrist",
    title: "Wrist Relief",
    tagline: "Reset after typing or clicking",
    durationMinutes: 2,
    steps: [
      {
        title: "Shake it out",
        instruction: "Relax your hands and gently shake your wrists for a few seconds.",
        durationSeconds: 20,
      },
      {
        title: "Flex and extend",
        instruction:
          "Extend one arm, palm up. With the other hand, gently pull fingers back, then down.",
        durationSeconds: 35,
      },
      {
        title: "Other side",
        instruction: "Switch hands. Keep the stretch mild. Stop if anything feels sharp.",
        durationSeconds: 35,
      },
      {
        title: "Circles",
        instruction: "Make slow circles with your wrists in both directions.",
        durationSeconds: 30,
      },
    ],
  },
  {
    id: "lower-back",
    title: "Lower Back Reset",
    tagline: "Light relief from sitting",
    durationMinutes: 2,
    steps: [
      {
        title: "Feet grounded",
        instruction: "Place feet flat. Sit slightly forward on your chair if that feels stable.",
        durationSeconds: 20,
      },
      {
        title: "Gentle twist",
        instruction:
          "Place one hand on the opposite knee. Rotate your torso slightly. Switch sides.",
        durationSeconds: 45,
      },
      {
        title: "Pelvic tilt",
        instruction:
          "Arch your lower back slightly, then flatten it against the chair. Move slowly.",
        durationSeconds: 35,
      },
      {
        title: "Stand if you can",
        instruction: "If comfortable, stand and reach arms overhead for a light stretch.",
        durationSeconds: 30,
      },
    ],
  },
  {
    id: "shoulder",
    title: "Shoulder Release",
    tagline: "Unwind upper-body stiffness",
    durationMinutes: 2,
    steps: [
      {
        title: "Drop and breathe",
        instruction: "Inhale. On the exhale, let your shoulders fall heavy.",
        durationSeconds: 25,
      },
      {
        title: "Ear to shoulder",
        instruction: "Bring your ear toward your shoulder without lifting the shoulder.",
        durationSeconds: 35,
      },
      {
        title: "Cross-body stretch",
        instruction:
          "Bring one arm across your chest. Use the other arm to hug it in gently.",
        durationSeconds: 40,
      },
      {
        title: "Switch sides",
        instruction: "Repeat on the other side. Keep your neck relaxed.",
        durationSeconds: 40,
      },
    ],
  },
  {
    id: "eyes",
    title: "Eye Relaxation",
    tagline: "Give your eyes a short break",
    durationMinutes: 1,
    steps: [
      {
        title: "Look away",
        instruction: "Focus on something at least 20 feet away for a few breaths.",
        durationSeconds: 30,
      },
      {
        title: "Palming",
        instruction: "Cup your palms over closed eyes without pressing. Rest in the dark.",
        durationSeconds: 25,
      },
      {
        title: "Blink reset",
        instruction: "Blink slowly ten times. Let your face soften.",
        durationSeconds: 20,
      },
    ],
  },
]

export function getSessionById(id) {
  return SESSIONS.find((s) => s.id === id) ?? null
}

export function getTotalDurationSeconds(session) {
  return session.steps.reduce((sum, step) => sum + step.durationSeconds, 0)
}
