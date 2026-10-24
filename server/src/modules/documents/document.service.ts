import { ProjectDocumentModel } from './document.model.js';

export class DocumentService {
  async getDocuments(query: any): Promise<any[]> {
    const { projectId, category, search } = query;

    const filter: any = {};
    if (projectId) filter.projectId = projectId;
    if (category && category !== 'All') filter.category = category;

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { author: searchRegex },
        { tags: searchRegex },
        { fileName: searchRegex },
      ];
    }

    const docs = await ProjectDocumentModel.find(filter).sort({ updatedAt: -1 });
    return docs.map((d) => d.toJSON());
  }

  async getDocumentById(id: string): Promise<any | null> {
    const doc = await ProjectDocumentModel.findOne({ id });
    return doc ? doc.toJSON() : null;
  }

  async createDocument(data: any, defaultAuthor: string, defaultAvatar: string): Promise<any> {
    const {
      projectId,
      title,
      category,
      tags,
      content,
      fileName,
      fileSize,
      fileType,
      fileDataUrl,
      isUploaded,
      readTime,
    } = data;

    const newDoc = new ProjectDocumentModel({
      id: `doc-${Date.now()}`,
      projectId,
      title,
      category: category || 'General Note',
      author: defaultAuthor || 'Project Lead',
      authorAvatar: defaultAvatar || '',
      updatedAt: new Date().toISOString().split('T')[0],
      readTime: readTime || '2 min read',
      tags: Array.isArray(tags) ? tags : [],
      content: content || '',
      fileName,
      fileSize,
      fileType,
      fileDataUrl,
      isUploaded: !!isUploaded,
    });

    await newDoc.save();
    return newDoc.toJSON();
  }

  async updateDocument(id: string, data: any): Promise<any | null> {
    const doc = await ProjectDocumentModel.findOne({ id });
    if (!doc) return null;

    const { title, category, tags, content, fileName, fileSize, fileType, fileDataUrl, readTime } = data;

    if (title !== undefined) doc.title = title;
    if (category !== undefined) doc.category = category;
    if (tags !== undefined) doc.tags = Array.isArray(tags) ? tags : [];
    if (content !== undefined) doc.content = content;
    if (fileName !== undefined) doc.fileName = fileName;
    if (fileSize !== undefined) doc.fileSize = fileSize;
    if (fileType !== undefined) doc.fileType = fileType;
    if (fileDataUrl !== undefined) doc.fileDataUrl = fileDataUrl;
    if (readTime !== undefined) doc.readTime = readTime;

    doc.updatedAt = new Date().toISOString().split('T')[0];
    await doc.save();

    return doc.toJSON();
  }

  async deleteDocument(id: string): Promise<boolean> {
    const doc = await ProjectDocumentModel.findOneAndDelete({ id });
    return !!doc;
  }
}

export const documentService = new DocumentService();
