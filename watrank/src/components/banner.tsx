import React from 'react';

const Banner: React.FC = () => {
    return (
        <div className="bg-secondary/10 p-6 rounded-full inline-block mb-6 shadow-banner border border-muted animate-bounce">
            <span className="text-xl lg:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-blue-400 dark:to-pink-400 font-bold">
                Cycle 2 rankings are up!
            </span>
        </div>
    );
};

export default Banner;
