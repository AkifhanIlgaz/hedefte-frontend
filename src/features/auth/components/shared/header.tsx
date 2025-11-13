interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="text-default-500">{subtitle}</p>
    </div>
  );
}
