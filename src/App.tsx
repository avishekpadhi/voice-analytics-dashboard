export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl flex flex-col gap-12">
        {/* Page Heading */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Voice Agent Call Analytics
          </h1>
          <p className="text-gray-500">
            Analyze voice agent performance and identify improvement areas
          </p>
        </header>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 mt-12">
          © {new Date().getFullYear()} Voice Analytics Dashboard
        </footer>
      </div>
    </main>
  );
}
