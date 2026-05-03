export const BUSINESS_QUESTIONS = [
  "I feel mentally fresh at the start of most workdays.",
  "I sleep seven or more hours of quality sleep most nights.",
  "My energy stays steady through the afternoon without crashes.",
  "I move my body for at least 30 minutes daily.",
  "My stress levels feel manageable week to week.",
  "I switch off from work in the evenings and at weekends.",
  "I eat regular, nourishing meals during the workday.",
  "I rarely rely on caffeine to function.",
  "My blood sugar feels stable, with no mid morning slumps.",
  "I sleep without anxiety or racing thoughts.",
  "I drink at least two litres of water across the day.",
  "I rarely crave sugar or ultra processed snacks.",
  "I rarely experience symptoms of burnout.",
  "I recover quickly from a bad night of sleep.",
  "My waist measurement is stable or improving.",
  "I take my full annual leave allowance.",
  "I can focus deeply for 60 minutes without crashing.",
  "I rarely feel inflamed, bloated or sluggish after meals.",
  "I rarely work late or at weekends.",
  "Overall, I feel energised, focused and resilient day to day.",
];

export const GYM_QUESTIONS = [
  "I train with a structured programme, not random workouts.",
  "I hit my weekly strength training target of three or more sessions.",
  "I track measurable progress in my key lifts or output metrics.",
  "My recovery between sessions feels complete.",
  "I sleep seven or more hours of quality sleep most nights.",
  "My nutrition is built to support my training goal.",
  "I hydrate consistently throughout training days.",
  "I rarely train through pain or injury.",
  "I include mobility and flexibility work weekly.",
  "I include conditioning work appropriate to my goal.",
  "My energy in sessions is consistently high.",
  "I have clear performance goals for the next 90 days.",
  "I deload or rest when my body signals fatigue.",
  "My body composition matches my performance goal.",
  "I manage stress without it killing my output.",
  "I supplement strategically, not impulsively.",
  "I warm up and cool down properly every session.",
  "I have access to coaching or expert feedback.",
  "I am motivated to train without forcing myself.",
  "Overall, my body feels physically resilient and capable.",
];

export const TIERS = [
  {
    name: "Critical",
    min: 0,
    max: 25,
    color: "text-red-500",
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    description:
      "Immediate intervention needed. Performance foundations are at risk and output is likely compromised.",
  },
  {
    name: "Exposed",
    min: 26,
    max: 50,
    color: "text-amber-500",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    description:
      "Vulnerability present. Key pillars need attention to prevent further decline.",
  },
  {
    name: "Performing",
    min: 51,
    max: 75,
    color: "text-lime-500",
    border: "border-lime-500/20",
    bg: "bg-lime-500/10",
    description:
      "A solid performing tier. Now it is about optimisation: recovery quality, stress mastery and the marginal gains that move you into Elite.",
  },
  {
    name: "Elite",
    min: 76,
    max: 100,
    color: "text-emerald-500",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    description:
      "Exceptional foundation. Sustain it, refine the edges, and set the standard for those around you.",
  },
];

export type AuditPath = "business" | "gym";

export function getTier(score: number) {
  return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0];
}
