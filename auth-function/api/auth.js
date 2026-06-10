const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

export default async function handler(req, res) {
  const { code } = req.query

  if (!code) {
    // Step 1: Redirect to GitHub OAuth
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `${process.env.URL}/api/auth`,
      scope: 'read:user user:email repo',
    })
    res.redirect(`https://github.com/login/oauth/authorize?${params}`)
    return
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
      redirect_uri: `${process.env.URL}/api/auth`,
    }),
  })

  const data = await response.json()

  if (data.error) {
    res.status(400).json({ error: data.error })
    return
  }

  // Step 3: Return token to Decap CMS
  res.send(`
    <script>
      window.opener.postMessage(
        'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
        window.location.origin
      );
      window.close();
    </script>
  `)
}
