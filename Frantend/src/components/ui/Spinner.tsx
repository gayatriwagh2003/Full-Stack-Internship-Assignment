export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size];
  return (
    <div className={`${sz} border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin`} />
  );
};