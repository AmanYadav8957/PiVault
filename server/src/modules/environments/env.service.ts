import { EnvVariable } from './env.model.js';
import { encryptSecret } from '../../common/utils/encryption.js';

export class EnvService {
  async getEnvVariables(query: any): Promise<any[]> {
    const { projectId, environment, search } = query;

    const filter: any = {};
    if (projectId) filter.projectId = projectId;
    if (environment) filter.environment = environment;

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [{ key: searchRegex }, { description: searchRegex }];
    }

    const items = await EnvVariable.find(filter).sort({ lastModified: -1 });

    return items.map((e) => {
      const json = e.toJSON();
      json.value = e.getDecryptedValue();
      return json;
    });
  }

  async createEnvVariable(data: any): Promise<any> {
    const { projectId, environment, key, value, isSecret, description } = data;

    const valStr = value !== undefined ? String(value) : '';
    const storedValue = isSecret ? encryptSecret(valStr) : valStr;

    const newEnv = new EnvVariable({
      id: `env-${Date.now()}`,
      projectId,
      environment: environment || 'production',
      key,
      value: storedValue,
      isSecret: !!isSecret,
      description: description || '',
      lastModified: new Date().toISOString().split('T')[0],
    });

    await newEnv.save();

    const json = newEnv.toJSON();
    json.value = valStr;
    return json;
  }

  async bulkImport(projectId: string, environment: string, rawEnvText: string): Promise<any[]> {
    const lines = rawEnvText.split('\n');
    const createdDocs = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();

        // Strip surrounding quotes
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }

        const isSecret = /SECRET|KEY|PASSWORD|TOKEN|PASS|PRIVATE|AUTH|SALT|CERT/i.test(key);
        const storedValue = isSecret ? encryptSecret(val) : val;

        const doc = new EnvVariable({
          id: `env-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          projectId,
          environment: environment || 'production',
          key,
          value: storedValue,
          isSecret,
          description: `Imported variable for ${environment}`,
          lastModified: new Date().toISOString().split('T')[0],
        });

        await doc.save();
        const json = doc.toJSON();
        json.value = val;
        createdDocs.push(json);
      }
    }

    return createdDocs;
  }

  async updateEnvVariable(id: string, data: any): Promise<any | null> {
    const env = await EnvVariable.findOne({ id });
    if (!env) return null;

    const { key, value, isSecret, description, environment } = data;

    if (key !== undefined) env.key = key;
    if (environment !== undefined) env.environment = environment;
    if (description !== undefined) env.description = description;
    if (isSecret !== undefined) env.isSecret = isSecret;

    if (value !== undefined) {
      env.value = env.isSecret ? encryptSecret(String(value)) : String(value);
    }

    env.lastModified = new Date().toISOString().split('T')[0];
    await env.save();

    const json = env.toJSON();
    json.value = env.getDecryptedValue();
    return json;
  }

  async deleteEnvVariable(id: string): Promise<boolean> {
    const env = await EnvVariable.findOneAndDelete({ id });
    return !!env;
  }
}

export const envService = new EnvService();
