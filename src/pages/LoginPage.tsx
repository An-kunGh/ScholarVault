import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import logoImg from "../assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) setError(authError.message);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080913] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#FF3366]/20 via-[#FFAA00]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-gradient-to-tl from-[#6366F1]/20 via-[#FF3366]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
            className="relative inline-block mb-4"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-[#FF3366] to-[#FFAA00] rounded-2xl opacity-40 blur-md" />
            <div className="relative w-16 h-16 rounded-2xl bg-[#0F1225] border border-white/10 p-2.5 flex items-center justify-center shadow-xl">
              <img
                src={logoImg}
                alt="ScholarVault Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Build Your Personal <br />
            <span className="bg-gradient-to-r from-[#FF3366] via-[#FF5E82] to-[#FFAA00] bg-clip-text text-transparent">
              Academic Vault.
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 font-medium">
            Simpan, kelola, dan akses seluruh literatur akademik Anda.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#0F1225]/85 backdrop-blur-2xl rounded-2xl border border-white/[0.09] p-7 sm:p-8 shadow-2xl shadow-black/80 relative">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FF3366] to-transparent" />

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="nama@kampus.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="coral"
                loading={loading}
                className="w-full py-3"
                size="lg"
              >
                Sign In to Vault
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6 tracking-wide">
          ScholarVault • Secure Academic Library & Research Repository
        </p>
      </motion.div>
    </div>
  );
}
