type DBProperties = {
  collection: string
  key: string
}

export type User = {
  auth0_id: string
  name: string
  profile: string
  icon_url: string
  is_deleted: boolean
}

export type DBUser = DBProperties & { props: User }

export type Auth0User = {
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
}

// TODO: google以外のログインも受け付けるなら要変更
export type Auth0AuthenticatedBy = 'google' | 'auth0'
