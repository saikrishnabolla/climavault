"use client"

import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { ArrowRight, BarChart3, Cloud, Database, Globe, Zap, ShieldCheck, History } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-inter">
            {/* Premium Hero Section */}
            <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
                {/* Abstract Background Shapes */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"
                />

                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-6 py-2.5 mb-10 border border-primary/10 shadow-sm"
                    >
                        <History className="h-4 w-4" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Climate Archive Since 1940</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl lg:text-[10rem] font-black tracking-tighter mb-10 leading-[0.85]"
                    >
                        The World&apos;s <br />
                        <span className="text-primary">ClimaVault.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl lg:text-3xl text-muted-foreground/80 max-w-3xl mx-auto mb-16 leading-tight font-medium"
                    >
                        Access 90TB of precise historical meteorological data. From local researchers to global enterprises, we provide the ground truth for our planet.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        <Link href="/dashboard">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="h-20 px-14 rounded-full bg-primary text-white text-xl font-black shadow-[0_20px_50px_-10px_rgba(0,120,255,0.4)] hover:bg-primary/90 transition-all">
                                    Unlock ClimaVault
                                    <ArrowRight className="ml-3 h-6 w-6" />
                                </Button>
                            </motion.div>
                        </Link>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button size="lg" variant="outline" className="h-20 px-14 rounded-full text-xl font-bold bg-white/50 backdrop-blur-md border-secondary-foreground/5 hover:bg-white shadow-xl">
                                Platform Specs
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="mt-28 grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto"
                    >
                        {[
                            { icon: Database, label: "90TB DATA" },
                            { icon: Globe, label: "GLOBAL NODES" },
                            { icon: Zap, label: "REAL-TIME" },
                            { icon: ShieldCheck, label: "SLA BACKED" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-center gap-3 transition-all hover:text-primary cursor-default group">
                                <item.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                <span className="font-black text-sm tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Feature Grids (One UI Style) */}
            <section className="py-32 px-6 bg-secondary/40 relative">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <motion.div
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 50 }}
                            viewport={{ once: true }}
                            className="one-ui-card bg-white lg:col-span-2 flex flex-col justify-between group cursor-default h-[600px] border-none shadow-2xl"
                        >
                            <div>
                                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <BarChart3 className="text-primary h-8 w-8" />
                                </div>
                                <h3 className="text-5xl font-black mb-6 tracking-tight">Powerful<br />Visualization</h3>
                                <p className="text-muted-foreground text-xl max-w-lg leading-relaxed font-medium">
                                    Animate 80 years of climate patterns with our advanced charting engine. Identify high-resolution trends that matter to your research.
                                </p>
                            </div>
                            <div className="mt-16 overflow-hidden rounded-[2.5rem] border-4 border-secondary/20 shadow-inner bg-secondary/5 h-64 flex items-end justify-center p-8">
                                <div className="flex gap-4 items-end h-full">
                                    {[30, 60, 40, 80, 50, 90, 70, 85, 45, 95].map((h, i) => (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 1 }}
                                            key={i}
                                            className="w-10 bg-primary/30 rounded-t-2xl hover:bg-primary transition-colors cursor-pointer"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 50 }}
                            viewport={{ once: true }}
                            className="one-ui-card bg-primary text-white flex flex-col justify-between h-[600px] shadow-[0_30px_60px_-15px_rgba(0,120,255,0.4)] border-none"
                        >
                            <div>
                                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-10 shadow-inner">
                                    <Cloud className="text-white h-8 w-8" />
                                </div>
                                <h3 className="text-5xl font-black mb-6 tracking-tight">Cloud<br />Native</h3>
                                <p className="text-white/80 text-xl leading-relaxed font-medium">
                                    Built on a global grid of meteorological sensors and satellites. No infrastructure required for your scale.
                                </p>
                            </div>
                            <Link href="/dashboard">
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    className="inline-flex items-center font-black text-2xl gap-3 group"
                                >
                                    Get Started
                                    <ArrowRight className="h-7 w-7 transition-transform group-hover:scale-110" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust Quote */}
            <section className="py-48 px-6 text-center">
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto space-y-12"
                >
                    <p className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tighter text-foreground decoration-primary/20 decoration-8 underline-offset-[15px]">
                        &quot;ClimaVault has fundamentally changed how we model risk. The speed is unmatched.&quot;
                    </p>
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-4 border-white shadow-xl overflow-hidden" />
                        <div className="text-center">
                            <p className="font-black text-2xl">Dr. Helena Vance</p>
                            <p className="text-lg text-muted-foreground font-bold uppercase tracking-widest mt-1">Chief Scientist at AtmosRisk</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer Branding */}
            <footer className="py-20 px-6 border-t border-secondary relative bg-white">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Cloud className="text-white h-6 w-6" />
                        </div>
                        <span className="font-black text-3xl tracking-tighter">ClimaVault</span>
                    </div>
                    <div className="flex gap-12 text-sm font-black uppercase tracking-widest text-muted-foreground/60">
                        <span className="hover:text-primary cursor-pointer transition-colors">Twitter</span>
                        <span className="hover:text-primary cursor-pointer transition-colors">Github</span>
                        <span className="hover:text-primary cursor-pointer transition-colors">Specs</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-bold">© 2025 ClimaVault Archive. Data by Open-Meteo.</p>
                </div>
            </footer>
        </div>
    )
}
