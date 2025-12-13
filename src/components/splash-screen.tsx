'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, Award, Sparkles } from 'lucide-react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-2xl">
                <FileText className="w-16 h-16 text-white" />
              </div>
              
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-2 -left-2 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg"
              >
                <Award className="w-5 h-5 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <h1 className="text-4xl font-bold gradient-text mb-2">dResume</h1>
              <p className="text-sky-600 text-sm">Decentralized Resume Verification</p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
              className="mt-6 h-1 w-48 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 rounded-full mx-auto"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
