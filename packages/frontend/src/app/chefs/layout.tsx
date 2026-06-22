import { HeaderShadow } from '@/components/layout/HeaderShadow';

export default function ChefsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderShadow />
      {children}
    </>
  );
}
