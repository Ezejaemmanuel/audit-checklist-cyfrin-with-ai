// ]

// "use client";
// import { ContentLayout } from "@/components/admin-panel/content-layout";
// import { DataCard } from "./wholeData";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { MyThread } from "@/components/ui/assistant-ui/thread";
// import { AssistantRuntimeProvider, useEdgeRuntime } from "@assistant-ui/react";
// import { MyAssistantModal } from "@/components/ui/assistant-ui/assistant-modal";
// import { useWindowSize } from "@uidotdev/usehooks";
// import { useAIMessageStore } from "@/zustand-store";

// export default function Page() {


//   const { width } = useWindowSize();


//   const runtime = useEdgeRuntime({
//     api: "/api/chat"


//   });
//   const isLargeScreen = width !== null && width >= 1024;

//   return (
//     <ContentLayout title="Test">
//       <AssistantRuntimeProvider runtime={runtime}>
//         {width !== null && (
//           <>
//             {isLargeScreen ? (
//               // Large Screen Layout
//               <div className="h-[calc(100vh-4rem)] w-full">
//                 <ResizablePanelGroup
//                   direction="horizontal"
//                   className="h-full w-full rounded-lg border"
//                 >
//                   <ResizablePanel defaultSize={70} minSize={50}>
//                     <div className="h-full w-full">
//                       <DataCard />
//                     </div>
//                   </ResizablePanel>

//                   <ResizableHandle withHandle />

//                   <ResizablePanel defaultSize={40} minSize={20}>
//                     <div className="h-full w-full p-6">
//                       <MyThread />
//                     </div>
//                   </ResizablePanel>
//                 </ResizablePanelGroup>
//               </div>
//             ) : (
//               // Small Screen Layout
//               <div className="h-[calc(100vh-4rem)] w-full flex flex-col">
//                 <div className="flex-1">
//                   <DataCard />
//                 </div>
//                 <MyAssistantModal />
//               </div>
//             )}
//           </>
//         )}
//       </AssistantRuntimeProvider>
//     </ContentLayout>
//   );
// }




"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DataCard } from "./wholeData";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MyThread } from "@/components/ui/assistant-ui/thread";
import { MyAssistantModal } from "@/components/ui/assistant-ui/assistant-modal";
import { useWindowSize } from "@uidotdev/usehooks";
import { MyRuntimeProvider } from "@/components/ui/assistant-ui/my-first-custom-assistant-provider";
import { ProjectDialogs } from "./ProjectDialog";

export default function Page() {


  const { width } = useWindowSize();

  const isLargeScreen = width !== null && width >= 1024;

  return (
    <ProjectDialogs>
      <ContentLayout title="Test">
        <MyRuntimeProvider >
          {width !== null && (
            <>
              {isLargeScreen ? (
                // Large Screen Layout
                <div className="h-[calc(100vh-4rem)] w-full">
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full w-full rounded-lg border"
                  >
                    <ResizablePanel defaultSize={60} minSize={50}>
                      <div className="h-full w-full">
                        <DataCard />
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={40} minSize={20}>
                      <div className="h-full w-full p-6">
                        <MyThread />
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              ) : (
                // Small Screen Layout
                <div className="h-[calc(100vh-4rem)] w-full flex flex-col">
                  <div className="flex-1">
                    <DataCard />
                  </div>
                  <MyAssistantModal />
                </div>
              )}
            </>
          )}
        </MyRuntimeProvider>
      </ContentLayout>
    </ProjectDialogs>
  );
}