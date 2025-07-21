import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

// カスタムノードコンポーネント
const CustomNode: React.FC<{ data: { label: string; type: string } }> = ({ data }) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'client':
        return {
          background: '#e1f5fe',
          border: '2px solid #01579b',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '120px',
        };
      case 'network':
        return {
          background: '#e8f5e8',
          border: '2px solid #388e3c',
          borderRadius: '50%',
          padding: '15px',
          minWidth: '100px',
          textAlign: 'center' as const,
        };
      case 'backend':
        return {
          background: '#f3e5f5',
          border: '2px solid #7b1fa2',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '120px',
        };
      case 'sync':
        return {
          background: '#fff8e1',
          border: '2px solid #f57f17',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '100px',
        };
      case 'external':
        return {
          background: '#fff3e0',
          border: '2px solid #e65100',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '120px',
        };
      default:
        return {
          background: '#f1f5f9',
          border: '2px solid #64748b',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '120px',
        };
    }
  };

  return (
    <div style={getNodeStyle()}>
      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{data.label}</div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const DataFlowDiagram: React.FC = () => {
  const initialNodes: Node[] = [
    // クライアント端末
    {
      id: 'desktop-app',
      type: 'custom',
      position: { x: 50, y: 50 },
      data: { label: 'Electron App', type: 'client' },
    },
    {
      id: 'desktop-cache',
      type: 'custom',
      position: { x: 50, y: 120 },
      data: { label: 'ローカルキャッシュ', type: 'client' },
    },
    {
      id: 'mobile-app',
      type: 'custom',
      position: { x: 200, y: 50 },
      data: { label: 'Mobile App', type: 'client' },
    },
    {
      id: 'mobile-cache',
      type: 'custom',
      position: { x: 200, y: 120 },
      data: { label: 'ローカルキャッシュ', type: 'client' },
    },
    {
      id: 'web-app',
      type: 'custom',
      position: { x: 350, y: 50 },
      data: { label: 'Web Browser', type: 'client' },
    },
    {
      id: 'service-worker',
      type: 'custom',
      position: { x: 350, y: 120 },
      data: { label: 'Service Worker', type: 'client' },
    },

    // ネットワーク層
    {
      id: 'cdn',
      type: 'custom',
      position: { x: 500, y: 30 },
      data: { label: 'CDN\nVercel', type: 'network' },
    },
    {
      id: 'api-gateway',
      type: 'custom',
      position: { x: 500, y: 120 },
      data: { label: 'API Gateway', type: 'network' },
    },

    // バックエンド
    {
      id: 'auth',
      type: 'custom',
      position: { x: 700, y: 30 },
      data: { label: '認証サービス', type: 'backend' },
    },
    {
      id: 'database',
      type: 'custom',
      position: { x: 700, y: 100 },
      data: { label: 'PostgreSQL\nデータベース', type: 'backend' },
    },
    {
      id: 'realtime',
      type: 'custom',
      position: { x: 700, y: 170 },
      data: { label: 'リアルタイム\nWebSocket', type: 'backend' },
    },
    {
      id: 'storage',
      type: 'custom',
      position: { x: 700, y: 240 },
      data: { label: 'ファイル\nストレージ', type: 'backend' },
    },
    {
      id: 'functions',
      type: 'custom',
      position: { x: 700, y: 310 },
      data: { label: 'Edge Functions', type: 'backend' },
    },

    // 外部サービス
    {
      id: 'email',
      type: 'custom',
      position: { x: 900, y: 30 },
      data: { label: 'メールサービス\nResend', type: 'external' },
    },
    {
      id: 'notification',
      type: 'custom',
      position: { x: 900, y: 100 },
      data: { label: 'プッシュ通知\nFirebase', type: 'external' },
    },

    // データ同期
    {
      id: 'sync-manager',
      type: 'custom',
      position: { x: 500, y: 200 },
      data: { label: '同期管理', type: 'sync' },
    },
    {
      id: 'conflict-resolver',
      type: 'custom',
      position: { x: 500, y: 270 },
      data: { label: '競合解決', type: 'sync' },
    },
    {
      id: 'version-control',
      type: 'custom',
      position: { x: 500, y: 340 },
      data: { label: 'バージョン管理', type: 'sync' },
    },
  ];

  const initialEdges: Edge[] = [
    // クライアントからネットワーク
    {
      id: 'desktop-cdn',
      source: 'desktop-app',
      target: 'cdn',
      label: 'HTTPS',
      style: { stroke: '#1976d2', strokeWidth: 2 },
    },
    {
      id: 'mobile-cdn',
      source: 'mobile-app',
      target: 'cdn',
      label: 'HTTPS',
      style: { stroke: '#1976d2', strokeWidth: 2 },
    },
    {
      id: 'web-cdn',
      source: 'web-app',
      target: 'cdn',
      label: 'HTTPS',
      style: { stroke: '#1976d2', strokeWidth: 2 },
    },

    // ネットワークからバックエンド
    {
      id: 'api-auth',
      source: 'api-gateway',
      target: 'auth',
      label: 'API',
      style: { stroke: '#388e3c', strokeWidth: 2 },
    },
    {
      id: 'api-database',
      source: 'api-gateway',
      target: 'database',
      label: 'API',
      style: { stroke: '#388e3c', strokeWidth: 2 },
    },
    {
      id: 'api-storage',
      source: 'api-gateway',
      target: 'storage',
      label: 'API',
      style: { stroke: '#388e3c', strokeWidth: 2 },
    },
    {
      id: 'api-functions',
      source: 'api-gateway',
      target: 'functions',
      label: 'API',
      style: { stroke: '#388e3c', strokeWidth: 2 },
    },

    // リアルタイム接続
    {
      id: 'realtime-desktop',
      source: 'realtime',
      target: 'desktop-app',
      label: 'WebSocket',
      style: { stroke: '#ff5722', strokeWidth: 2 },
    },
    {
      id: 'realtime-mobile',
      source: 'realtime',
      target: 'mobile-app',
      label: 'WebSocket',
      style: { stroke: '#ff5722', strokeWidth: 2 },
    },
    {
      id: 'realtime-web',
      source: 'realtime',
      target: 'web-app',
      label: 'WebSocket',
      style: { stroke: '#ff5722', strokeWidth: 2 },
    },

    // データ同期
    {
      id: 'desktop-cache-sync',
      source: 'desktop-cache',
      target: 'sync-manager',
      label: '同期',
      style: { stroke: '#f57f17', strokeWidth: 2 },
    },
    {
      id: 'mobile-cache-sync',
      source: 'mobile-cache',
      target: 'sync-manager',
      label: '同期',
      style: { stroke: '#f57f17', strokeWidth: 2 },
    },
    {
      id: 'service-worker-sync',
      source: 'service-worker',
      target: 'sync-manager',
      label: '同期',
      style: { stroke: '#f57f17', strokeWidth: 2 },
    },

    // 同期処理
    {
      id: 'sync-conflict',
      source: 'sync-manager',
      target: 'conflict-resolver',
      label: '競合検出',
      style: { stroke: '#f57f17', strokeWidth: 2 },
    },
    {
      id: 'conflict-version',
      source: 'conflict-resolver',
      target: 'version-control',
      label: 'バージョン管理',
      style: { stroke: '#f57f17', strokeWidth: 2 },
    },
    {
      id: 'version-database',
      source: 'version-control',
      target: 'database',
      label: '最終保存',
      style: { stroke: '#f57f17', strokeWidth: 2 },
    },

    // 通知・メール
    {
      id: 'functions-email',
      source: 'functions',
      target: 'email',
      label: 'メール送信',
      style: { stroke: '#e65100', strokeWidth: 2 },
    },
    {
      id: 'functions-notification',
      source: 'functions',
      target: 'notification',
      label: 'プッシュ通知',
      style: { stroke: '#e65100', strokeWidth: 2 },
    },
    {
      id: 'mobile-notification',
      source: 'mobile-app',
      target: 'notification',
      label: '通知受信',
      style: { stroke: '#e65100', strokeWidth: 2 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <div style={{ 
        padding: '10px', 
        background: '#f8fafc', 
        borderBottom: '1px solid #e2e8f0',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        システム設計アシスタント - 3端末間データ同期フロー（React Flow版）
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#f1f5f9" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'client': return '#e1f5fe';
              case 'network': return '#e8f5e8';
              case 'backend': return '#f3e5f5';
              case 'sync': return '#fff8e1';
              case 'external': return '#fff3e0';
              default: return '#f1f5f9';
            }
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

export default DataFlowDiagram; 