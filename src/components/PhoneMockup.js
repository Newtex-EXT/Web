
const BarChart = ({ data }) => {
    const maxVal = Math.max(...data);
    const chartHeight = 100;
    const chartWidth = 100;
    const barWidth = 80 / data.length;
    const gap = 20 / (data.length - 1);

    return (
        <div className="w-full aspect-video bg-white/5 rounded-xl border border-white/10 relative overflow-hidden flex items-end p-2">
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
            >
                {data.map((value, index) => {
                    const height = Math.max((value / maxVal) * chartHeight, 5);
                    const x = index * (barWidth + gap);
                    const y = chartHeight - height;

                    const opacityClass = index % 2 === 0 ? "opacity-80" : "opacity-50";
                    let op = 0.4;
                    if (index === 3) op = 1;
                    else if (index === 2) op = 0.6;
                    else if (index === 1) op = 0.4;
                    else if (index === 4) op = 0.5;
                    else op = 0.2;

                    return (
                        <rect
                            key={index}
                            x={`${x}%`}
                            y={`${y}%`}
                            width={`${barWidth}%`}
                            height={`${height}%`}
                            className="fill-primary transition-all duration-500 hover:fill-[#00CFFF]"
                            fillOpacity={op}
                            rx="2"
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default function PhoneMockup() {
    const chartData = [50, 75, 60, 90, 80];

    return (
        <div className="relative w-[280px] h-[580px] bg-[#0a1518] rounded-[3rem] border-[8px] border-[#454545] shadow-2xl overflow-hidden group">
            {/* Screen Content */}
            <div className="absolute inset-0 bg-background-dark p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between text-white/40">
                    <span className="text-xs font-bold">9:41</span>
                    <div className="flex gap-1">
                        <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                        <span className="material-symbols-outlined text-[14px]">wifi</span>
                        <span className="material-symbols-outlined text-[14px]">battery_full</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="h-1 bg-white/10 w-8 rounded-full"></div>
                    <h3 className="text-white text-lg font-bold">Panel de Control</h3>
                    {/* Stats in Mockup */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <p className="text-[10px] text-primary">STATUS</p>
                            <p className="text-sm font-bold">Active</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <p className="text-[10px] text-primary">LOAD</p>
                            <p className="text-sm font-bold">24%</p>
                        </div>
                    </div>
                    {/* Charts */}
                    <BarChart data={chartData} />
                    <div className="flex flex-col gap-2">
                        <div className="w-full h-12 bg-white/5 rounded-lg border border-white/10 flex items-center px-3 gap-3">
                            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[16px]">sensors</span>
                            </div>
                            <div className="flex-1 h-2 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="w-full h-12 bg-white/5 rounded-lg border border-white/10 flex items-center px-3 gap-3">
                            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[16px]">settings_remote</span>
                            </div>
                            <div className="flex-1 h-2 bg-white/10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Highlight */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent"></div>
        </div>
    );
}
