# Strava OAuth Setup

## 1. Generate Authorization URL

```javascript
const redirect_uri = process.env.STRAVA_REDIRECT_URI;
const auth = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&approval_prompt=force&scope=activity:read_all`;
```

## 2. User Authorization

- Send users to the authorization URL
- The URL will generate a `code` that we need to extract

## 3. Exchange Code for Refresh Token

```bash
curl -X POST https://www.strava.com/api/v3/oauth/token
  -d client_id=MY_STRAVA_CLIENT_ID
  -d client_secret=MY_STRAVA_CLIENT_SECRET
  -d code=AUTHORIZATION_CODE
  -d grant_type=authorization_code
```

## 4. Store Refresh Token

- Extract `refresh_token` from response
- Add to Vercel environment variables for each user