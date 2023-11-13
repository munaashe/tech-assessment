import React, { ReactNode } from 'react';
import FavouritePosts from './FavouritePosts';

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <div className="root-layout">
            <aside className="fixed top-0 right-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-gray-100">
                <div className='p-4 font-semibold text-lg'>
                    Your Favourite Posts
                </div>
                <FavouritePosts/>
            </aside>
            <div>
                {children}
            </div>
        </div>
    );
};

export default RootLayout;