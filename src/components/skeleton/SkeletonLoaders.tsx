export function IndexCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between p-4 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-transparent border border-[#2A2A2A] animate-pulse">
   
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gray-700" />
      
 
      <div className="flex items-start justify-between mb-3 ml-3">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-700 rounded" />
          <div className="h-3 w-16 bg-gray-800 rounded" />
        </div>
        <div className="w-5 h-5 bg-gray-700 rounded" />
      </div>

      <div className="ml-3 mb-2 space-y-2">
        <div className="h-8 w-32 bg-gray-700 rounded" />
        <div className="h-4 w-24 bg-gray-800 rounded" />
      </div>

      <div className="ml-3 mt-2">
        <div className="h-5 w-16 bg-gray-800 rounded" />
      </div>
    </div>
  );
}


export function IndexChartSkeleton() {
  return (
    <div className="relative space-y-4 animate-pulse">
\
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-lg border border-[#2A2A2A]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-12 h-8 bg-gray-700 rounded-md" />
          ))}
        </div>
      </div>


      <div className="flex justify-center gap-4 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
            <div className="w-3 h-1 bg-gray-700 rounded-full" />
            <div className="space-y-1">
              <div className="h-3 w-16 bg-gray-700 rounded" />
              <div className="h-4 w-12 bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>


      <div className="bg-gradient-to-b from-[#1A1A1A]/50 to-transparent rounded-xl p-4 border border-[#2A2A2A]">
        <div className="relative h-[320px] flex items-end justify-between px-4">

          {[40, 65, 45, 80, 55, 75, 60, 70].map((height, i) => (
            <div 
              key={i}
              className="w-8 bg-gray-700 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

 
      <div className="grid grid-cols-3 gap-3 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A]/50 border border-[#2A2A2A]">
            <div className="w-4 h-4 bg-gray-700 rounded" />
            <div className="space-y-1">
              <div className="h-3 w-12 bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}