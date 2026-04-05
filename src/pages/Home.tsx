import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Brain, Rocket, Target, Zap, ArrowRight, Star } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen pt-24 overflow-hidden">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-slate-300">AI-Powered Career Guidance</span>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight"
        >
          Design Your Future with <br />
          <span className="text-gradient">Artificial Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Unlock your true potential with personalized career roadmaps, skill analysis, 
          and 24/7 mentorship from our advanced AI career coach.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-lg font-bold text-white shadow-xl hover:shadow-neon-purple/40 transition-all flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl glass text-lg font-bold text-white hover:bg-white/20 transition-all"
          >
            View Demo
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Rocket,
              title: "Career Roadmaps",
              description: "Step-by-step guides tailored to your specific goals and time availability.",
              color: "from-blue-500 to-cyan-400"
            },
            {
              icon: Target,
              title: "Skill Analysis",
              description: "Identify your strengths and bridge the gap with targeted learning paths.",
              color: "from-purple-500 to-pink-400"
            },
            {
              icon: Zap,
              title: "AI Mentorship",
              description: "Real-time chat with an AI mentor trained on global career trends.",
              color: "from-orange-500 to-yellow-400"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-dark p-8 rounded-3xl group hover:border-white/30 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Users", value: "10k+" },
            { label: "Careers Analyzed", value: "50k+" },
            { label: "Success Rate", value: "94%" },
            { label: "AI Accuracy", value: "99.9%" }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-display font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
