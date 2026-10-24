import { Project, IProject } from './project.model.js';
import { Credential } from '../credentials/credential.model.js';
import { EnvVariable } from '../environments/env.model.js';
import { ProjectDocumentModel } from '../documents/document.model.js';
import { User, IUser } from '../users/user.model.js';

export class ProjectService {
  async getAllProjects(): Promise<any[]> {
    const projects = await Project.find().sort({ createdAt: -1 });

    return Promise.all(
      projects.map(async (p) => {
        const [credCount, envCount, docCount, teamCount] = await Promise.all([
          Credential.countDocuments({ projectId: p.id }),
          EnvVariable.countDocuments({ projectId: p.id }),
          ProjectDocumentModel.countDocuments({ projectId: p.id }),
          User.countDocuments({ assignedProjectIds: p.id }),
        ]);

        const json = p.toJSON();
        json.credentialsCount = credCount;
        json.envCount = envCount;
        json.docsCount = docCount;
        json.teamCount = teamCount || 1;
        return json;
      })
    );
  }

  async getProjectById(id: string): Promise<any | null> {
    const project = await Project.findOne({ id });
    return project ? project.toJSON() : null;
  }

  async createProject(body: any, user?: IUser): Promise<any> {
    const { name, description, slug, repoUrl, color, category, status } = body;

    const generatedId = `prj-${Date.now()}`;
    const projectSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProject = new Project({
      id: generatedId,
      name,
      slug: projectSlug,
      description: description || '',
      status: status || 'active',
      leadName: user?.name || 'Project Lead',
      leadAvatar: user?.avatar || '',
      repoUrl: repoUrl || '',
      color: color || 'from-blue-600 to-indigo-600',
      category: category || 'General',
      teamCount: 1,
      credentialsCount: 0,
      envCount: 0,
      docsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    });

    await newProject.save();

    // Automatically assign creator to the project
    if (user && !user.assignedProjectIds.includes(generatedId)) {
      user.assignedProjectIds.push(generatedId);
      await user.save();
    }

    return newProject.toJSON();
  }

  async updateProject(id: string, updateData: any): Promise<any | null> {
    const project = await Project.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    );
    return project ? project.toJSON() : null;
  }

  async deleteProject(id: string): Promise<boolean> {
    const project = await Project.findOneAndDelete({ id });
    if (!project) return false;

    // Cascade delete credentials, env variables, and documents
    await Promise.all([
      Credential.deleteMany({ projectId: id }),
      EnvVariable.deleteMany({ projectId: id }),
      ProjectDocumentModel.deleteMany({ projectId: id }),
    ]);

    return true;
  }
}

export const projectService = new ProjectService();
