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
