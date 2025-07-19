import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Upload,
  FileText,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Calendar,
  User,
  Tag,
  Archive,
  Clock,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type:
    | "requirements-definition"
    | "basic-design"
    | "external-design"
    | "development-prep"
    | "other";
  size: number;
  uploadDate: Date;
  updateDate: Date;
  author: string;
  content?: string;
  description?: string;
  tags: string[];
  isLatest: boolean;
}

interface DocumentManagerProps {
  phaseId: string;
}

const documentTypes = {
  "requirements-definition": {
    label: "要件定義",
    color: "bg-blue-500",
  },
  "basic-design": { label: "基本設計", color: "bg-green-500" },
  "external-design": {
    label: "外部設計",
    color: "bg-purple-500",
  },
  "development-prep": {
    label: "開発準備",
    color: "bg-orange-500",
  },
  other: { label: "その他", color: "bg-gray-500" },
};

const defaultTags = [
  "最新版",
  "Draft",
  "Review",
  "Approved",
  "Archived",
];

// DocumentCardコンポーネントを追加
interface DocumentCardProps {
  document: Document;
  onEdit: (doc: Document) => void;
  onDelete: (docId: string) => void;
  onDownload: (doc: Document) => void;
}

function DocumentCard({ document: doc, onEdit, onDelete, onDownload }: DocumentCardProps) {
  const typeInfo = documentTypes[doc.type];
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {doc.name}
            </h4>
            {doc.isLatest && (
              <Badge variant="default" className="text-xs rounded-full bg-green-500 hover:bg-green-600">
                最新版
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Badge variant="outline" className="text-xs rounded-full">
              {typeInfo.label}
            </Badge>
            <span>•</span>
            <span>{formatFileSize(doc.size)}</span>
            <span>•</span>
            <span>更新: {formatDateTimeShort(doc.updateDate)}</span>
          </div>
        </div>
      </div>
      
      {doc.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {doc.description}
        </p>
      )}
      
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(doc)}
          className="h-8 px-3 text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          ダウンロード
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(doc)}
          className="h-8 px-3 text-xs"
        >
          <Edit className="h-3 w-3 mr-1" />
          編集
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(doc.id)}
          className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          削除
        </Button>
      </div>
    </div>
  );
}

export function DocumentManager({
  phaseId,
}: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] =
    useState<string>("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] =
    useState(false);
  const [editingDocument, setEditingDocument] =
    useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "requirements-definition" as Document["type"],
    description: "",
    content: "",
    tags: [] as string[],
    isLatest: false,
  });

  const [newTag, setNewTag] = useState("");

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const now = new Date();
        const doc: Document = {
          id:
            Date.now().toString() +
            Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: newDocument.type,
          size: file.size,
          uploadDate: now,
          updateDate: now,
          author: "Current User",
          content: content,
          description: newDocument.description,
          tags: newDocument.tags,
          isLatest: newDocument.isLatest,
        };

        // 最新版の場合、同じ名前の他のドキュメントの最新版フラグを削除
        if (newDocument.isLatest) {
          setDocuments((prev) =>
            prev.map((d) =>
              d.name === file.name
                ? { ...d, isLatest: false }
                : d,
            ),
          );
        }

        setDocuments((prev) => [...prev, doc]);
      };
      reader.readAsText(file);
    });

    setIsUploadDialogOpen(false);
    setNewDocument({
      name: "",
      type: "requirements-definition",
      description: "",
      content: "",
      tags: [],
      isLatest: false,
    });
  };

  const handleCreateDocument = () => {
    if (!newDocument.name.trim()) return;

    const now = new Date();
    const doc: Document = {
      id:
        Date.now().toString() +
        Math.random().toString(36).substr(2, 9),
      name: newDocument.name,
      type: newDocument.type,
      size: new Blob([newDocument.content]).size,
      uploadDate: now,
      updateDate: now,
      author: "Current User",
      content: newDocument.content,
      description: newDocument.description,
      tags: newDocument.tags,
      isLatest: newDocument.isLatest,
    };

    // 最新版の場合、同じ名前の他のドキュメントの最新版フラグを削除
    if (newDocument.isLatest) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.name === newDocument.name
            ? { ...d, isLatest: false }
            : d,
        ),
      );
    }

    setDocuments((prev) => [...prev, doc]);
    setIsUploadDialogOpen(false);
    setNewDocument({
      name: "",
      type: "requirements-definition",
      description: "",
      content: "",
      tags: [],
      isLatest: false,
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== docId),
    );
  };

  const handleDownloadDocument = (doc: Document) => {
    const blob = new Blob([doc.content || ""], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadLatestDocuments = () => {
    const latestDocs = documents.filter((doc) => doc.isLatest);
    if (latestDocs.length === 0) return;

    latestDocs.forEach((doc) => {
      setTimeout(() => handleDownloadDocument(doc), 100);
    });
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocument(doc);
    setNewDocument({
      name: doc.name,
      type: doc.type,
      description: doc.description || "",
      content: doc.content || "",
      tags: doc.tags,
      isLatest: doc.isLatest,
    });
  };

  const handleUpdateDocument = () => {
    if (!editingDocument) return;

    const now = new Date();

    // 最新版の場合、同じ名前の他のドキュメントの最新版フラグを削除
    if (newDocument.isLatest) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.name === newDocument.name &&
          d.id !== editingDocument.id
            ? { ...d, isLatest: false }
            : d,
        ),
      );
    }

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === editingDocument.id
          ? {
              ...doc,
              name: newDocument.name,
              type: newDocument.type,
              description: newDocument.description,
              content: newDocument.content,
              size: new Blob([newDocument.content]).size,
              updateDate: now,
              tags: newDocument.tags,
              isLatest: newDocument.isLatest,
            }
          : doc,
      ),
    );

    setEditingDocument(null);
    setIsUploadDialogOpen(false);
    setNewDocument({
      name: "",
      type: "requirements-definition",
      description: "",
      content: "",
      tags: [],
      isLatest: false,
    });
  };

  const handleAddTag = (tag: string) => {
    if (tag && !newDocument.tags.includes(tag)) {
      setNewDocument((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewDocument((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        doc.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesType =
        selectedType === "all" || doc.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // 更新日の新しい順に並べ替え
      return (
        new Date(b.updateDate).getTime() -
        new Date(a.updateDate).getTime()
      );
    });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTimeShort = (date: Date) => {
    return date.toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const latestDocumentsCount = documents.filter(
    (doc) => doc.isLatest,
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">ドキュメント管理</h3>
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            size="sm"
            className="h-8 px-3"
          >
            <Plus className="h-4 w-4 mr-1" />
            追加
          </Button>
        </div>

        {/* 検索とフィルター */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Q 検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">すべての種別</option>
            <option value="requirements-definition">要件定義</option>
            <option value="basic-design">基本設計</option>
            <option value="external-design">外部設計</option>
            <option value="development-prep">開発準備</option>
            <option value="other">その他</option>
          </select>
        </div>
      </div>

      {/* ドキュメントリスト */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">ドキュメントなし</h4>
            <p className="text-sm text-gray-500 mb-4">追加してください</p>
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              ドキュメントを追加
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onEdit={handleEditDocument}
                onDelete={handleDeleteDocument}
                onDownload={handleDownloadDocument}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingDocument
                ? "ドキュメント編集"
                : "新しいドキュメント"}
            </DialogTitle>
            <DialogDescription>
              ファイルをアップロードするか、新規作成してください
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="create">新規作成</TabsTrigger>
              <TabsTrigger
                value="upload"
                disabled={!!editingDocument}
              >
                ファイルアップロード
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    ドキュメント名
                  </label>
                  <Input
                    value={newDocument.name}
                    onChange={(e) =>
                      setNewDocument((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="ドキュメント名を入力"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    種別
                  </label>
                  <select
                    value={newDocument.type}
                    onChange={(e) =>
                      setNewDocument((prev) => ({
                        ...prev,
                        type: e.target
                          .value as Document["type"],
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(documentTypes).map(
                      ([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  説明
                </label>
                <Input
                  value={newDocument.description}
                  onChange={(e) =>
                    setNewDocument((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="ドキュメントの説明を入力"
                  className="rounded-xl"
                />
              </div>

              {/* タグ管理 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  タグ
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newDocument.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新しいタグを入力"
                    className="rounded-xl"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddTag(newTag)
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddTag(newTag)}
                    disabled={!newTag.trim()}
                    className="rounded-xl"
                  >
                    追加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {defaultTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTag(tag)}
                      disabled={newDocument.tags.includes(tag)}
                      className="text-xs rounded-full"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 最新版チェック */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLatest"
                  checked={newDocument.isLatest}
                  onChange={(e) =>
                    setNewDocument((prev) => ({
                      ...prev,
                      isLatest: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <label
                  htmlFor="isLatest"
                  className="text-sm font-medium"
                >
                  最新版としてマークする
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  内容
                </label>
                <Textarea
                  value={newDocument.content}
                  onChange={(e) =>
                    setNewDocument((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="ドキュメントの内容を入力"
                  rows={20}
                  className="rounded-xl resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={
                    editingDocument
                      ? handleUpdateDocument
                      : handleCreateDocument
                  }
                  disabled={!newDocument.name.trim()}
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  {editingDocument ? "更新" : "作成"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUploadDialogOpen(false);
                    setEditingDocument(null);
                    setNewDocument({
                      name: "",
                      type: "requirements-definition",
                      description: "",
                      content: "",
                      tags: [],
                      isLatest: false,
                    });
                  }}
                  className="rounded-full"
                >
                  キャンセル
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    種別
                  </label>
                  <select
                    value={newDocument.type}
                    onChange={(e) =>
                      setNewDocument((prev) => ({
                        ...prev,
                        type: e.target
                          .value as Document["type"],
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(documentTypes).map(
                      ([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    説明
                  </label>
                  <Input
                    value={newDocument.description}
                    onChange={(e) =>
                      setNewDocument((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="ドキュメントの説明を入力"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* タグ管理（アップロード時） */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  タグ
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newDocument.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新しいタグを入力"
                    className="rounded-xl"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddTag(newTag)
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddTag(newTag)}
                    disabled={!newTag.trim()}
                    className="rounded-xl"
                  >
                    追加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {defaultTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTag(tag)}
                      disabled={newDocument.tags.includes(tag)}
                      className="text-xs rounded-full"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 最新版チェック（アップロード時） */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLatestUpload"
                  checked={newDocument.isLatest}
                  onChange={(e) =>
                    setNewDocument((prev) => ({
                      ...prev,
                      isLatest: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <label
                  htmlFor="isLatestUpload"
                  className="text-sm font-medium"
                >
                  最新版としてマークする
                </label>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl mb-2">
                  ファイルをドラッグ&ドロップ
                </p>
                <p className="text-sm text-gray-500">
                  または、クリックしてファイルを選択
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.md,.doc,.docx,.pdf"
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}