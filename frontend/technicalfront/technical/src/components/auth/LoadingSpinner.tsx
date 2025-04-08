interface LoadingSpinnerProps {
  title: string;
  message: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ title, message }) => (
  <div className="flex justify-center items-center h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  </div>
);