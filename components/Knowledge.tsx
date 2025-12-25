import React from 'react';
import { INSIGHTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

const Knowledge: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-coolMist/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-baseline mb-16">
          <h2 className="text-3xl font-serif text-deepCharcoal">Knowledge & Insights</h2>
          <a href="#" className="text-sm text-trustBlue hover:underline">View all updates</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Quote Block */}
            <div className="col-span-1 md:col-span-2 bg-deepCharcoal text-white p-10 rounded-2xl flex flex-col justify-center min-h-[300px]">
                <span className="text-6xl font-serif text-healingTeal opacity-50 mb-4">"</span>
                <p className="text-2xl md:text-3xl font-serif leading-tight">
                    The future of medicine isn't about replacing doctors. It's about giving them superpowers through calm, intelligent systems.
                </p>
                <div className="mt-8 flex items-center gap-3">
                    <div className="w-8 h-px bg-white/30"></div>
                    <span className="text-sm font-mono uppercase tracking-widest text-white/60">SEHAT Vision</span>
                </div>
            </div>

            {/* Standard Insight Cards */}
            {INSIGHTS.map((insight) => (
                <a key={insight.id} href="#" className="group bg-white p-8 rounded-2xl border border-hairline hover:shadow-lg transition-all duration-500 flex flex-col justify-between h-[300px]">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold uppercase tracking-widest text-trustBlue bg-trustBlue/5 px-3 py-1 rounded-full">
                            {insight.category}
                        </span>
                        <ArrowUpRight className="text-slate-300 group-hover:text-deepCharcoal transition-colors" size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-deepCharcoal mb-4 group-hover:underline decoration-1 underline-offset-4">
                            {insight.title}
                        </h3>
                        <p className="text-sm text-slate-400">{insight.date}</p>
                    </div>
                </a>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Knowledge;