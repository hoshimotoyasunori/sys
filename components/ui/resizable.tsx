"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from './utils';

interface ResizableSidebarProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  position: 'left' | 'right';
  onResize?: (width: number) => void;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ResizableSidebar({
  children,
  minWidth = 200,
  maxWidth = 600,
  defaultWidth = 280,
  position,
  onResize,
  className,
  isOpen = true,
  onToggle
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // リサイズ開始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  // リサイズ中
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = position === 'left' 
      ? e.clientX - startXRef.current 
      : startXRef.current - e.clientX;
    
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
    setWidth(newWidth);
    onResize?.(newWidth);
  }, [isResizing, position, minWidth, maxWidth, onResize]);

  // リサイズ終了
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // マウスイベントの設定
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // サイドバーが閉じている場合は最小幅で表示
  const displayWidth = isOpen ? width : 64;

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'relative bg-white border-gray-200 transition-all duration-300 flex flex-col shadow-sm',
        position === 'left' ? 'border-r' : 'border-l',
        className
      )}
      style={{ width: displayWidth }}
    >
      {/* リサイズハンドル */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-100 transition-colors duration-200 z-10 group',
            position === 'left' ? '-right-1' : '-left-1'
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-1 h-12 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors duration-200 flex flex-col items-center justify-center gap-1">
              <div className="w-0.5 h-1 bg-gray-400 rounded-full group-hover:bg-blue-300"></div>
              <div className="w-0.5 h-1 bg-gray-400 rounded-full group-hover:bg-blue-300"></div>
              <div className="w-0.5 h-1 bg-gray-400 rounded-full group-hover:bg-blue-300"></div>
            </div>
          </div>
        </div>
      )}

      {/* 開閉ボタン */}
      {onToggle && (
        <button
          onClick={onToggle}
          className={cn(
            'absolute w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 z-20',
            position === 'left' ? '-right-3 top-6' : '-left-3 top-6'
          )}
        >
          {position === 'left' 
            ? (isOpen ? '◀' : '▶') 
            : (isOpen ? '▶' : '◀')
          }
        </button>
      )}

      {/* コンテンツ */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// リサイズ可能なコンテナコンポーネント
interface ResizableContainerProps {
  leftSidebar: React.ReactNode;
  rightSidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onMainContentResize?: (width: number) => void;
}

export function ResizableContainer({
  leftSidebar,
  rightSidebar,
  children,
  className,
  onMainContentResize
}: ResizableContainerProps) {
  const mainContentRef = useRef<HTMLDivElement>(null);

  // メインコンテンツエリアの幅を監視
  useEffect(() => {
    if (!mainContentRef.current || !onMainContentResize) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        onMainContentResize(width);
      }
    });

    resizeObserver.observe(mainContentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onMainContentResize]);

  return (
    <div className={cn('flex h-full', className)}>
      {leftSidebar}
      <div ref={mainContentRef} className="flex-1 overflow-hidden">
        {children}
      </div>
      {rightSidebar}
    </div>
  );
}
