import React from 'react';

export function Footer() {
    return <footer className="shadow-inner dark:shadow-gray-700 bg-background">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-center text-sm text-gray-500 dark:text-gray-400 sm:text-center ">
            <span>
                Made with ❤️ by some UWaterloo students. Got ideas or feedback?{" "}
                <a target="_blank" href="https://forms.gle/Qg7GzWkKnj4jGWmm8" className="hover:underline italic">Contact us!</a>
            </span>
        </div>
    </footer>


}
