import { motion } from "framer-motion";
import { User, Shield, Palette, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import logoImg from "../assets/logo.png";

export default function SettingsPage() {
  const { session, signOut } = useAuth();
  const userInitial = session?.user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#FF3366]" />
                User Profile
              </div>
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF3366] to-[#6366F1] p-[2px] shadow-lg shadow-[#FF3366]/20">
                <div className="w-full h-full rounded-2xl bg-[#0F1225] flex items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    {userInitial}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-base tracking-tight">
                  {session?.user?.email || "User"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Member since{" "}
                  {session?.user?.created_at
                    ? new Date(session.user.created_at).toLocaleDateString(
                        "id-ID",
                        { year: "numeric", month: "long" }
                      )
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* App Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-[#FFAA00]" />
                Application Info
              </div>
            </CardTitle>
            <img src={logoImg} alt="Logo" className="w-7 h-7 object-contain" />
          </CardHeader>
          <div className="space-y-1 text-sm divide-y divide-white/[0.06]">
            <div className="flex justify-between py-2.5">
              <span className="text-slate-400">Application</span>
              <span className="font-semibold text-white">ScholarVault</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-slate-400">Version</span>
              <span className="font-semibold text-white">2.0.0 (Degens Dark Edition)</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-slate-400">Stack</span>
              <span className="font-semibold text-white">
                React 19 + Vite + Tailwind CSS v4
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-slate-400">Database & Auth</span>
              <span className="font-semibold text-white">Supabase Cloud</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-rose-400" />
                Session & Security
              </div>
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Keluar dari sesi akun Anda di perangkat ini. Anda dapat masuk kembali kapan
              saja untuk mengakses pustaka akademik Anda.
            </p>
            <Button variant="danger" onClick={signOut}>
              Sign Out from Device
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
