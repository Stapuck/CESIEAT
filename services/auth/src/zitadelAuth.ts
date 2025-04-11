const clientId = process.env.ZITADEL_CLIENT_ID!
const clientSecret = process.env.ZITADEL_CLIENT_SECRET!
const tokenUrl = process.env.ZITADEL_TOKEN_URL!
const scope = 'openid profile urn:zitadel:iam:org:project:id:zitadel:aud'

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getZitadelToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  if (cachedToken && cachedToken.expiresAt - 60 > now) {
    return cachedToken.token
  }

  const basicAuth = Buffer.from(
    `${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`
  ).toString('base64')

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope
    }).toString()
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch token: ${errorText}`)
    // console.log(errorText)
  }

  const data = await response.json()
  const { access_token, expires_in } = data

  cachedToken = {
    token: access_token,
    expiresAt: now + expires_in,
  }

  return access_token
}
