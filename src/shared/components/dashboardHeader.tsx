interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-center ">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-default-500">{description}</p>
    </div>
  );
}
