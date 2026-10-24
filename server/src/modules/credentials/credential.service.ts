import { Credential } from './credential.model.js';
import { encryptSecret } from '../../common/utils/encryption.js';

export class CredentialService {
  async getCredentials(query: any): Promise<any[]> {
    const { projectId, category, environment, search } = query;

    const filter: any = {};
    if (projectId) filter.projectId = projectId;
    if (category && category !== 'All') filter.category = category;
    if (environment && environment !== 'All') filter.environment = environment;

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { name: searchRegex },
        { service: searchRegex },
        { endpoint: searchRegex },
        { username: searchRegex },
        { notes: searchRegex },
      ];
    }

    const credentials = await Credential.find(filter).sort({ updatedAt: -1 });

    return credentials.map((c) => {
      const json = c.toJSON();
      json.secretValue = c.getDecryptedSecret();
      return json;
    });
  }

  async revealSecret(id: string): Promise<{ id: string; name: string; secretValue: string } | null> {
    const cred = await Credential.findOne({ id });
    if (!cred) return null;

    return {
      id: cred.id,
      name: cred.name,
      secretValue: cred.getDecryptedSecret(),
    };
  }

  async createCredential(data: any, authorName: string): Promise<any> {
    const { projectId, name, service, category, environment, username, secretValue, endpoint, notes } = data;

    const newCred = new Credential({
      id: `cred-${Date.now()}`,
      projectId,
      name,
      service: service || '',
      category: category || 'General',
      environment: environment || 'Production',
      username: username || '',
      secretValue: encryptSecret(secretValue),
      endpoint: endpoint || '',
      notes: notes || '',
      updatedBy: authorName,
      updatedAt: new Date().toISOString().split('T')[0],
    });

    await newCred.save();

    const responseJson = newCred.toJSON();
    responseJson.secretValue = secretValue;
    return responseJson;
  }

  async updateCredential(id: string, data: any, authorName: string): Promise<any | null> {
    const cred = await Credential.findOne({ id });
    if (!cred) return null;

    const { name, service, category, environment, username, secretValue, endpoint, notes } = data;

    if (name !== undefined) cred.name = name;
    if (service !== undefined) cred.service = service;
    if (category !== undefined) cred.category = category;
    if (environment !== undefined) cred.environment = environment;
    if (username !== undefined) cred.username = username;
    if (endpoint !== undefined) cred.endpoint = endpoint;
    if (notes !== undefined) cred.notes = notes;
    if (secretValue !== undefined) {
      cred.secretValue = encryptSecret(secretValue);
    }
    cred.updatedBy = authorName;
    cred.updatedAt = new Date().toISOString().split('T')[0];

    await cred.save();

    const responseJson = cred.toJSON();
    responseJson.secretValue = cred.getDecryptedSecret();
    return responseJson;
  }

  async deleteCredential(id: string): Promise<boolean> {
    const cred = await Credential.findOneAndDelete({ id });
    return !!cred;
  }
}

export const credentialService = new CredentialService();
