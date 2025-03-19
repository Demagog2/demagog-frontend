import { Spinner } from './Spinner'

interface LoadingMessageProps {
  message: string
}

export function LoadingMessage({ message }: LoadingMessageProps) {
  return (
    <div>
      <div className="inline-flex items-center px-4 py-2 leading-6 text-gray-700 transition ease-in-out duration-150">
        <Spinner />
        {message}
      </div>
    </div>
  )
}
