export const validateIcon = (file: File): string | null => {
  const { type, size } = file
  let message = null
  const MAX_FILE_SIZE = 2

  if (type !== 'image/jpeg' && type !== 'image/png') {
    message = '※サポートしているファイル形式はjpeg、pngです。'
  }
  if (size > MAX_FILE_SIZE * 1024 * 1024) {
    message = '※最大ファイルサイズは2MBです。'
  }

  return message
}

export const validateEmail = (email: string): string | null => {
  const re = /^[A-Za-z0-9]{1}[A-Za-z0-9_.+-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
  let message = null

  if (!re.test(email)) {
    message = '※メールアドレスの形式が異なります。'
  }
  return message
}
