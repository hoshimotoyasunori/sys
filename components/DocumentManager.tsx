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
    <div className="h-full flex flex-col bg-white">
      {/* 固定ヘッダー */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            ドキュメント管理
          </h3>
          <div className="flex items-center gap-2">
            {latestDocumentsCount > 0 && (
              <Button
                onClick={handleDownloadLatestDocuments}
                size="sm"
                variant="outline"
                className="rounded-full text-xs h-8"
              >
                <Archive className="h-3 w-3 mr-1" />
                最新版一括DL ({latestDocumentsCount})
              </Button>
            )}
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-700 h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* スクロール可能なコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 min-w-0">
          {/* 検索・フィルター */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="h-3 w-3 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 text-sm rounded-lg border-gray-200"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value="all">すべての種別</option>
              {Object.entries(documentTypes).map(
                ([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* ドキュメント一覧（アコーディオン） */}
          <div className="space-y-2">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium">
                  ドキュメントなし
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  追加してください
                </p>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {filteredDocuments.map((doc) => {
                  const typeInfo = documentTypes[doc.type];
                  return (
                    <AccordionItem
                      key={doc.id}
                      value={doc.id}
                      className="border rounded-lg mb-2 last:mb-0"
                    >
                      <AccordionTrigger className="hover:no-underline px-4 py-3">
                        <div className="flex items-center w-full min-w-0 pr-2">
                          {/* 左側：メイン情報 */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {doc.name}
                                </h4>
                                {doc.isLatest && (
                                  <Badge
                                    variant="default"
                                    className="text-xs rounded-full bg-green-500 hover:bg-green-600 flex-shrink-0"
                                  >
                                    最新版
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                                <Badge
                                  variant="outline"
                                  className="text-xs rounded-full flex-shrink-0"
                                >
                                  {typeInfo.label}
                                </Badge>
                                <span className="flex-shrink-0">
                                  •
                                </span>
                                <span className="flex-shrink-0">
                                  {formatFileSize(doc.size)}
                                </span>
                                <span className="flex-shrink-0">
                                  •
                                </span>
                                <span className="truncate">
                                  更新:{" "}
                                  {formatDateTimeShort(
                                    doc.updateDate,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 右側：アクション（閉じている時の簡易表示） */}
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4"></div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                          {/* タグ */}
                          {doc.tags.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-gray-700">
                                タグ
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {doc.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs rounded-full"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 説明文 */}
                          {doc.description && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-gray-700">
                                説明
                              </h5>
                              <p className="text-xs text-gray-600">
                                {doc.description}
                              </p>
                            </div>
                          )}

                          {/* 内容プレビュー */}
                          {doc.content && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-gray-700">
                                内容プレビュー
                              </h5>
                              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-auto">
                                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono break-words">
                                  {doc.content.length > 200
                                    ? `${doc.content.substring(0, 200)}...`
                                    : doc.content}
                                </pre>
                              </div>
                            </div>
                          )}

                          {/* 詳細メタ情報 */}
                          <div className="space-y-2 text-xs text-gray-400 border-t pt-3">
                            <h5 className="text-xs font-medium text-gray-700">
                              詳細情報
                            </h5>
                            <div className="grid grid-cols-1 gap-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  作成:{" "}
                                  {formatDateTime(
                                    doc.uploadDate,
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>
                                  更新:{" "}
                                  {formatDateTime(
                                    doc.updateDate,
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>
                                  作成者: {doc.author}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* アクションボタン */}
                          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDownloadDocument(doc)
                              }
                              className="h-8 px-3 text-xs flex-shrink-0"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              ダウンロード
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleEditDocument(doc);
                                setIsUploadDialogOpen(true);
                              }}
                              className="h-8 px-3 text-xs flex-shrink-0"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              編集
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteDocument(doc.id)
                              }
                              className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 flex-shrink-0"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              削除
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
        </div>
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
              ファイルをアップロードするか、新規作成してくださ��
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
                    className="w-full p-2 border border-gray-200 rounded-xl bg-white"
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
                  {editingDocument ? "更新" : "��成"}
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
                    className="w-full p-2 border border-gray-200 rounded-xl bg-white"
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