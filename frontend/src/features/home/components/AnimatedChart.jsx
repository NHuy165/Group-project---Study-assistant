import { motion } from "framer-motion";
import React from "react";
import { useState } from "react";

export const AnimatedChart = ({ children }) => {
    const [hasEntered, setHasEntered] = useState(false);

    return (
        <motion.div
            initial={{ 
                opacity: 0
            }}

            whileInView={{
                opacity: 1,
            }}

            viewport={{
                once: true,
                amount: 0.6
            }}

            onViewportEnter={
                () => setHasEntered(true)
            }
        >
            {React.cloneElement(children, { isAnimationActive: hasEntered })}
        </motion.div>
    )
}