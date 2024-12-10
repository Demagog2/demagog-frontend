export function AdminEvaluationHidden() {
  return (
    <div className="bg-gray-50 sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">
          Hodnocení a odůvodnění skryto
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Hodnocení a odůvodnění tohoto výroku můžete vidět teprve až po
            schválení.
          </p>
        </div>
      </div>
    </div>
  )
}
