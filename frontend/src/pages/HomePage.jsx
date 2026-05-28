// import React from "react";

// import { NotebookHeader } from "../features/home/components/NotebookHeader";
import { ChartHolder } from "../features/home/components/ChartHolder";
import { listOfCharts } from "../features/home/utils/listOfCharts";
// import { ThemeWrapper, useTheme } from "../components/theme/ThemeWrapper";
// import { UserProfileCard } from "../features/home/components/LeftBlock/UserProfileCard"; 

// const HomeContent = () => {
//   const { isNight } = useTheme();

//   // Thêm backdrop-blur-xl và giảm bg xuống 60% để mờ ảo
//   const sidebarCardCls = isNight
//     ? "bg-slate-900/60 border-white/[0.08] backdrop-blur-xl"
//     : "bg-white/60 border-white/60 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]";

//   return (
//     <div className="flex flex-col h-full w-full overflow-hidden">
//       <div className="flex flex-1 overflow-hidden gap-8 pl-8 lg:pl-12 pr-4 lg:pr-6 pt-24 pb-5 w-full">
        
//         {/* CỘT TRÁI: Nội dung chính */}
//         <div className="w-[80%] flex-1 overflow-hidden min-w-[600px]">
//           <NotebookHeader />
//         </div>

//         {/* CỘT PHẢI: Sidebar Profile & Charts */}
//         <aside className="w-[20%] shrink-0 flex flex-col gap-5 overflow-y-auto custom-scrollbar pb-6 pr-2">
          
//           {/* ĐÃ TÁCH FILE: Gọi Component UserProfileCard vào đây */}
//           <UserProfileCard name="Minh" />

//           <ChartHolder listOfCharts={listOfCharts} sidebarCardCls={sidebarCardCls} isNight={isNight} />
          
//         </aside>
//       </div>

      
      
//     </div>
//   );
// };

// export const HomePage = () => (
//   <ThemeWrapper showToggle={true}>
//     <HomeContent />
//   </ThemeWrapper>
// );

import React from "react";
import { ThemeWrapper, useTheme } from "../components/theme/ThemeWrapper";
import { NotebookHeader } from "../features/home/components/LeftBlock/NotebookHeader";
import { UserProfileCard } from "../features/home/components/LeftBlock/UserProfileCard"; 
import { getSidebarCardClasses } from "../features/home/utils/dropdownColor";

const HomeContent = () => {
  const { isNight } = useTheme();

  // Thêm backdrop-blur-xl và giảm bg xuống 60% để mờ ảo
  const sidebarCardCls = getSidebarCardClasses(isNight);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex flex-1 overflow-hidden gap-8 px-8 lg:px-12 pt-24 pb-8 w-full">
        
        {/* CỘT TRÁI: Nội dung chính */}
        <div className="flex-1 overflow-hidden min-w-[600px]">
          <NotebookHeader />
        </div>

        {/* CỘT PHẢI: Sidebar Profile & Charts */}
        <aside className="w-[340px] shrink-0 flex flex-col gap-5 overflow-y-auto custom-scrollbar pb-6 pr-2">
          
          {/* ĐÃ TÁCH FILE: Gọi Component UserProfileCard vào đây */}
          <UserProfileCard name="Minh" />

          <ChartHolder listOfCharts={listOfCharts} sidebarCardCls={sidebarCardCls} isNight={isNight} />
          
        </aside>
      </div>
    </div>
  );
};

export const HomePage = () => (
  <ThemeWrapper showToggle={true}>
    <HomeContent />
  </ThemeWrapper>
);