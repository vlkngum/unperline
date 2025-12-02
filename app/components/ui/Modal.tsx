import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
    maxW?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
};

export default function Modal({ open, setOpen, children, maxW = 'md' }: ModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`bg-neutral-900 p-6 rounded-b-xl w-full ${maxWClasses[maxW]} mx-4 mt-30 relative`}
                        >
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            {children}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
