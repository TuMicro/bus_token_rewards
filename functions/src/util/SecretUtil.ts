// Imports the Secret Manager library
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
// Instantiates a client
const client = new SecretManagerServiceClient();

// https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets
export async function getSecret(secretName: string): Promise<string | null> {
  // Access the secret.
  const [accessResponse] = await client.accessSecretVersion({
    name: secretName,
  });
  const data = accessResponse?.payload?.data;
  if (data != null) {
    if (data instanceof Uint8Array) {
      // uint8array to utf8 string
      return Buffer.from(data).toString('utf8');
    }
    return data;
  }
  return null;
}