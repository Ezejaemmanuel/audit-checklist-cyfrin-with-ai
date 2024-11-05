"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DataCard } from "./wholeData";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MyThread } from "@/components/ui/assistant-ui/thread";
import { AssistantRuntimeProvider, useEdgeRuntime } from "@assistant-ui/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  const runtime = useEdgeRuntime({ api: "/api/chat" });

  return (
    <ContentLayout title="Test">
      <div className="h-[calc(100vh-4rem)] w-full"> {/* Adjust the calc value based on your header/navigation height */}
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-lg border"
        >
          {/* Left Panel - 70% with DataCard */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full w-full ">
              <DataCard />
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle />

          {/* Right Panel - 30% Sidebar */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <AssistantRuntimeProvider runtime={runtime}>

              <ScrollArea className="h-full w-full  p-6">
                <MyThread />
              </ScrollArea>
            </AssistantRuntimeProvider>

          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ContentLayout>
  );
}