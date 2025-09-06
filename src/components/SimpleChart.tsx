"use client";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface SimpleChartProps {
  data: ChartData[];
  title: string;
  type: "bar" | "doughnut";
}

export default function SimpleChart({ data, title, type }: SimpleChartProps) {
  if (type === "doughnut") {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Simple doughnut chart using CSS */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const rotation = data
                .slice(0, index)
                .reduce((sum, prev) => sum + (prev.value / total) * 360, 0);

              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${rotation}deg, ${
                      item.color
                    } 0deg, ${item.color} ${percentage * 3.6}deg, transparent ${
                      percentage * 3.6
                    }deg)`,
                    mask: "radial-gradient(circle at center, transparent 40%, black 40%)",
                    WebkitMask:
                      "radial-gradient(circle at center, transparent 40%, black 40%)",
                  }}
                ></div>
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-gray-700">{total}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Bar chart
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold text-gray-800">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
