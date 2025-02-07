export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
  )
}