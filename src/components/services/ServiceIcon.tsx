import {
  Boxes,
  Building2,
  PackageCheck,
  Sofa,
  Trash2,
  Truck,
  Warehouse,
  Wrench,
  type LucideProps,
} from "lucide-react";

export const serviceIconNames = [
  "Truck",
  "Building2",
  "Sofa",
  "Boxes",
  "PackageCheck",
  "Wrench",
  "Warehouse",
  "Trash2",
] as const;

const icons = { Truck, Building2, Sofa, Boxes, PackageCheck, Wrench, Warehouse, Trash2 };

export default function ServiceIcon({ name, ...props }: LucideProps & { name: string }) {
  const Icon = icons[name as keyof typeof icons] ?? Truck;
  return <Icon {...props} />;
}
