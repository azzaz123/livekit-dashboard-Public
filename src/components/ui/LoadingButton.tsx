interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({ loading, children, disabled, ...props }: LoadingButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      {...props}
      className={`${props.className} relative ${loading ? 'text-transparent' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
    </button>
  );
} 