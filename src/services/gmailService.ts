import { getAccessToken } from '../firebase';

export interface GmailSendResponse {
  id: string;
  threadId: string;
  labelIds: string[];
}

/**
 * Encodes non-Latin strings (like Thai) safely to base64url format.
 */
function base64urlEncode(str: string): string {
  // First, UTF-8 encode and then Base64 encode
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = utf8Bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Builds an RFC 2822 compliant MIME message string.
 */
function buildMimeMessage(to: string, subject: string, body: string): string {
  // Use UTF-8 encoded subject
  const escapedSubject = `=?utf-8?B?${btoa(
    Array.from(new TextEncoder().encode(subject))
      .map(b => String.fromCharCode(b))
      .join('')
  )}?=`;

  const mimeParts = [
    `To: ${to}`,
    `Subject: ${escapedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    body
  ];

  return base64urlEncode(mimeParts.join('\r\n'));
}

/**
 * Fetches the Gmail profile of the logged-in user.
 */
export async function getGmailProfile(accessToken: string): Promise<{ emailAddress: string; messagesTotal: number } | null> {
  try {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Failed to get Gmail profile:', errText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching Gmail profile:', error);
    return null;
  }
}

/**
 * Sends an email using Gmail REST API.
 */
export async function sendGmailMessage(
  to: string,
  subject: string,
  body: string
): Promise<GmailSendResponse> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const rawMime = buildMimeMessage(to, subject, body);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: rawMime,
    }),
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error('Gmail send API failed:', errorDetails);
    throw new Error(`Gmail Send Error: ${res.statusText} (${errorDetails})`);
  }

  return await res.json();
}
