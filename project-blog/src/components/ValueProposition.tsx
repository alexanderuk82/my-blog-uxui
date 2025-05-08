import React from 'react';

const ValueProposition: React.FC = () => {
  return (
    <section id="about" className="py-64 md:py-32 border-t border-keyline">
      <div className="flex flex-col gap-8">
        <div>
          <span className="text-sm uppercase tracking-wide">ABOUT UI STORE</span>
          <div className="w-24 h-px bg-black dark:bg-white mt-2"></div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl uppercase leading-tight">
          WE BUILD <span className="font-bold">PIXEL-PERFECT</span> COMPONENTS 
          SO DEVELOPERS <span className="font-bold">SHIP FASTER</span> & WITH 
          <span className="font-bold"> CONFIDENCE</span>.
        </h2>
      </div>
    </section>
  );
};

export default ValueProposition;