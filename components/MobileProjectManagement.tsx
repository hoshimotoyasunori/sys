import React, { useState } from 'react';
import { Users, Plus, Settings, Trash2, LogOut, User, ArrowLeft, Search, Mail, Phone, Calendar } from 'lucide-react';

interface MobileProjectManagementProps {
  onBack: () => void;
  onNavigateToView: (view: string) => void;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  memberCount: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedAt: string;
}

export function MobileProjectManagement({ onBack, onNavigateToView }: MobileProjectManagementProps) {
  const [activeView, setActiveView] = useState<'main' | 'members' | 'create' | 'switch'>('main');
  const [searchTerm, setSearchTerm] = useState('');

  // モックデータ
  const mockMembers: Member[] = [
    {
      id: '1',
      name: '田中太郎',
      email: 'tanaka@example.com',
      role: 'プロジェクトマネージャー',
      avatar: '👨‍💼',
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: '佐藤花子',
      email: 'sato@example.com',
      role: 'システムエンジニア',
      avatar: '👩‍💻',
      joinedAt: '2024-02-01'
    },
    {
      id: '3',
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      role: 'UI/UXデザイナー',
      avatar: '👨‍🎨',
      joinedAt: '2024-02-10'
    },
    {
      id: '4',
      name: '高橋美咲',
      email: 'takahashi@example.com',
      role: 'テスター',
      avatar: '👩‍🔬',
      joinedAt: '2024-03-01'
    }
  ];

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'ECサイト開発プロジェクト',
      description: 'オンラインショッピングサイトの開発',
      createdAt: '2024-01-01',
      memberCount: 8
    },
    {
      id: '2',
      name: '社内管理システム',
      description: '従業員管理と勤怠管理システム',
      createdAt: '2024-02-01',
      memberCount: 5
    },
    {
      id: '3',
      name: 'モバイルアプリ開発',
      description: 'iOS/Androidアプリの開発',
      createdAt: '2024-03-01',
      memberCount: 6
    }
  ];

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMainView = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">現在のプロジェクト</h3>
        <p className="text-blue-800">ECサイト開発プロジェクト</p>
        <p className="text-sm text-blue-600 mt-1">メンバー数: 8名</p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => setActiveView('members')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">メンバー一覧</span>
          <div className="ml-auto">
            <span className="text-gray-400">›</span>
          </div>
        </button>
        
        <button 
          onClick={() => setActiveView('create')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-green-600">
            <Plus className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">プロジェクト作成</span>
          <div className="ml-auto">
            <span className="text-gray-400">›</span>
          </div>
        </button>
        
        <button 
          onClick={() => setActiveView('switch')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-yellow-600">
            <Settings className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">プロジェクト切り替え</span>
          <div className="ml-auto">
            <span className="text-gray-400">›</span>
          </div>
        </button>
        
        <button 
          onClick={() => {
            if (window.confirm('プロジェクトを削除しますか？この操作は取り消せません。')) {
              // 削除処理
            }
          }}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 bg-white"
        >
          <div className="p-2 rounded-lg bg-gray-50 text-red-600">
            <Trash2 className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-900">プロジェクト削除</span>
        </button>
      </div>
    </div>
  );

  const renderMembersView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="メンバーを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{member.avatar}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">参加日: {member.joinedAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>メンバーが見つかりません</p>
        </div>
      )}
    </div>
  );

  const renderCreateView = () => (
    <div className="space-y-4">
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-bold text-green-900 mb-2">新しいプロジェクトを作成</h3>
        <p className="text-green-800 text-sm">プロジェクト名、説明、メンバーを設定してください</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">プロジェクト名</label>
          <input
            type="text"
            placeholder="プロジェクト名を入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
          <textarea
            placeholder="プロジェクトの説明を入力"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メンバーを追加</label>
          <div className="space-y-2">
            {mockMembers.slice(0, 3).map((member) => (
              <label key={member.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                <div className="flex items-center gap-2">
                  <span className="text-lg">{member.avatar}</span>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
          プロジェクトを作成
        </button>
      </div>
    </div>
  );

  const renderSwitchView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="プロジェクトを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => {
              // プロジェクト切り替え処理
              alert(`プロジェクト「${project.name}」に切り替えました`);
            }}
            className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{project.memberCount}名</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">作成日: {project.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="text-yellow-600">
                <Settings className="h-5 w-5" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>プロジェクトが見つかりません</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeView === 'main') {
                onBack();
              } else {
                setActiveView('main');
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {activeView === 'main' ? 'プロジェクト管理' :
             activeView === 'members' ? 'メンバー一覧' :
             activeView === 'create' ? 'プロジェクト作成' :
             'プロジェクト切り替え'}
          </h1>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        {activeView === 'main' && renderMainView()}
        {activeView === 'members' && renderMembersView()}
        {activeView === 'create' && renderCreateView()}
        {activeView === 'switch' && renderSwitchView()}
      </div>
    </div>
  );
} 