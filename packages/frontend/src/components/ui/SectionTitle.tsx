interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2
      style={{
        fontWeight: 200,
        fontSize: '30px',
        lineHeight: '35px',
        letterSpacing: '1.25px',
        textTransform: 'uppercase',
        textAlign: 'center',
        margin: 0,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </h2>
  );
}
