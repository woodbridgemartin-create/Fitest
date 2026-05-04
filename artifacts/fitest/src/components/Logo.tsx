export default function Logo({ className = "text-xl" }: { className?: string }) {
  return (
    <span className={`${className} font-black tracking-tighter uppercase`}>
      <span className="text-foreground">FIT</span>
      <span className="text-primary">EST</span>
    </span>
  );
}
