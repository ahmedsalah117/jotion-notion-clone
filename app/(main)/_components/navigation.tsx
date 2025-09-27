"use client"
import { cn } from '@/lib/utils'
import { ChevronLeft, MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from "./UserItem";
const Navigation = () => {
const pathName = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<HTMLDivElement>(null);
const navbarRef = useRef<HTMLDivElement>(null);
const [isResetting, setIsResetting] = useState(false)
const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
  event.preventDefault()
  event.stopPropagation()
    isResizingRef.current = true;
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

  function handleMouseMove(event: MouseEvent) {
    if (!isResizingRef.current) return;
    
    // so here we are simply following the mouse coordinates in the x-axis and adjusting the width of the sidebar and the navbar accordingly so that we can have a resizable sidebar.
    let newWidth = event.clientX;
    // forcing a minimum width for the sidebar
    if (newWidth < 240) {
      newWidth = 240;
    }
    // forcing a maximum width for the sidebar
    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.left = `${newWidth}px`;
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
    }
  }

  // this function is used to fixate the width of the sidebar once the user releases the mouse after resizing.
  function handleMouseUp() {
    isResizingRef.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

  }
// this will reset the sidebar width to its original width.
  function resetSidebarWidth() {

    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      // this is to animate the sidebar width while resetting it to its original width.
      setIsResetting(true)
      
      sidebarRef.current.style.width = isMobile ? "100%": "240px";
      navbarRef.current.style.left = isMobile? "100%" : "240px";
      navbarRef.current.style.width = isMobile ? "0": "calc(100% - 240px)";
    }
    setTimeout(()=>{
      setIsResetting(false)
    }, 300)


// here we are setting the isResetting state to false after the transition is complete just because we are using a transition animation on the sidebar while it resets, and we do not want this animation to happen anytime especially during a manual resize of the sidebar width. we just want it to happen only when resetting the sidebar width via a single click on the right border of the sidebar. we use 300ms in the timeout function to make sure the transition is complete before setting the isResetting state to false. since the transition duration is already 300ms.



  }


  function collapseSidebar() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.left = "0";
      navbarRef.current.style.width = "100%";
    }
    setTimeout(()=>{
      setIsResetting(false)
    }, 300)
  }

  // Tracking the isMobile state and collapsing or resetting the sidebar width accordingly.
  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    } else {
      resetSidebarWidth();
    }
  }, [isMobile])

  useEffect(()=>{
    if(isMobile){
      collapseSidebar();
    }
  }, [pathName, isMobile])

  return (
    <>
      <aside
        ref={sidebarRef}
        // we are adding special animation while resetting only because if we add this animation as a default, it would also be applied while resizing the sidebar width manullay and it would look very weird & off.
        className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]", isResetting && "transition-all ease-in-out duration-300", isMobile && "w-0")}
      >
        <div
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100",
          )}
          onClick={collapseSidebar}
        >
          <ChevronLeft className="h-6 w-6" />
        </div>

        <div>
          <UserItem />
        </div>

        <div className="mt-4">
          <p>Documents</p>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetSidebarWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 cursor-ew-resize transition absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div ref={navbarRef} className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]", isResetting && "transition-all ease-in-out duration-300", isMobile && "left-0 w-full")}>
        <nav className="bg-transparent px-3 py-2 w-full">{isCollapsed && <MenuIcon onClick={resetSidebarWidth} role="button" className="h-6 w-6 text-muted-foreground" />}</nav>
      </div>
    </>
  );
}

export default Navigation

//Notes............................................................................................................................
  //if we use a state here to track the isResizing state this would cause many issues.

  //1- the handleMouseMove and handleMouseUp functions will not recieve the latest value of isResizingRef.current because of closures.
  //2- Every time the user moves their mouse during resizing, the handleMouseMove function would be called, and if it updated the isResizing state, it would trigger a re-render of the entire component. This would cause:
// Performance issues - The component would re-render hundreds of times per second during mouse movement
// Visual stuttering - The constant re-renders could interfere with the smooth resizing animation
  // Unnecessary work - The DOM would be constantly updating even though the visual changes are handled directly via style properties
  
  // Why useRef works better...
//   The isResizingRef.current value can be updated without triggering re-renders
// The resizing logic only needs to track whether the user is currently dragging
// The actual visual updates happen directly via DOM manipulation (sidebarRef.current.style.width = ...)
// No component re-renders occur during the resizing process
// The Resizing Flow
// Mouse down: isResizingRef.current = true (no re-render)
// Mouse move: Check isResizingRef.current and update DOM styles directly (no re-render)
// Mouse up: isResizingRef.current = false and cleanup event listeners (no re-render)
// This pattern is common when you need to track state that doesn't affect the UI directly but is used for logic control. The isResizingRef is purely a "flag" to control whether the mouse move handler should perform resizing operations - it doesn't need to trigger any visual updates or re-renders.