import { motion } from "framer-motion";
import BackgroundCanvas from "./components/BackgroundCanvas";

export default function App() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden flex flex-col items-center">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#141421] to-[#0b0b12] -z-20"></div>

      {/* Particle canvas (behind everything except gradient) */}
      <BackgroundCanvas />

      {/* Gradient blobs for glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#00e5ff33] blur-[160px] rounded-full z-0"></div>
      <div className="absolute top-60 -right-40 w-[400px] h-[400px] bg-[#ff00ff33] blur-[160px] rounded-full z-0"></div>

      {/* Header */}
      <motion.section
        className="relative z-10 w-full max-w-5xl text-center py-24 px-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-semibold mb-4 bg-gradient-to-r from-[#00e5ff] to-[#ff00ff] text-transparent bg-clip-text">
          The missing layer for your voice agent.
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Analyze call performance with intelligent insights — visualize how
          your voice agents handle conversations.
        </p>
      </motion.section>

      {/* Charts Section */}
      <section className="relative w-full max-w-6xl z-10 grid gap-12 px-6">
        <motion.div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="text-center text-gray-400 italic">
            Chart 1 will render here
          </div>
        </motion.div>

        <motion.div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="text-center text-gray-400 italic">
            Chart 2 will render here
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-gray-500 text-sm mb-6 z-10">
        © {new Date().getFullYear()} Voice Analytics Dashboard
      </footer>
    </main>
  );
}
