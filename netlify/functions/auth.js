const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

exports.handler = async (event) => {
  const { code } = event.queryStringParameters || {}

  if (!code) {
    // Step 1: Redirect to GitHub OAuth
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `${process.env.URL}/.netlify/functions/auth`,
      scope: 'read:user user:email repo',
    })
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params}`,
      },
    }
  }

  // Step 2: Exchange code for token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.URL}/.netlify/functions/auth`,
    }),
  })

  const data = await response.json()

  if (data.error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: data.error }),
    }
  }

  // Step 3: Return token to Decap CMS
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
      <script>
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
          window.location.origin
        );
        window.close();
      </script>
    `,
  }
}
