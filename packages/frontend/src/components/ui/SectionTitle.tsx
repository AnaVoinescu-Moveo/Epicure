interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2
      style={{
        fontWeight: 200,
        fontSize: '18px',
        lineHeight: '24px',
        letterSpacing: '1.25px',
        textTransform: 'uppercase',
        margin: 0,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </h2>
  );
}
