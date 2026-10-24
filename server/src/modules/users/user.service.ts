import { User } from './user.model.js';

export class UserService {
  async getUsers(query: any): Promise<any[]> {
    const { role, search } = query;

    const filter: any = {};
    if (role && role !== 'All') filter.role = role;

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }, { department: searchRegex }];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    return users.map((u) => u.toJSON());
  }

  async createUser(data: any): Promise<any> {
    const { name, email, role, department, avatar, assignedProjectIds } = data;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw new Error('A user with this email already exists');
    }

    const newUser = new User({
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      role: role || 'Employee',
      department: department || 'Engineering',
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      status: 'Active',
      assignedProjectIds: Array.isArray(assignedProjectIds) ? assignedProjectIds : [],
      joinedAt: new Date().toISOString().split('T')[0],
    });

    await newUser.save();
    return newUser.toJSON();
  }

  async updateUser(id: string, data: any): Promise<any | null> {
    const user = await User.findOne({ id });
    if (!user) return null;

    const { name, email, role, department, avatar, status, assignedProjectIds } = data;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (role !== undefined) user.role = role;
    if (department !== undefined) user.department = department;
    if (avatar !== undefined) user.avatar = avatar;
    if (status !== undefined) user.status = status;
    if (assignedProjectIds !== undefined) user.assignedProjectIds = assignedProjectIds;

    await user.save();
    return user.toJSON();
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await User.findOneAndDelete({ id });
    return !!user;
  }

  async toggleProject(userId: string, projectId: string): Promise<any | null> {
    const user = await User.findOne({ id: userId });
    if (!user) return null;

    const index = user.assignedProjectIds.indexOf(projectId);
    if (index > -1) {
      user.assignedProjectIds.splice(index, 1);
    } else {
      user.assignedProjectIds.push(projectId);
    }

    await user.save();
    return user.toJSON();
  }
}

export const userService = new UserService();
