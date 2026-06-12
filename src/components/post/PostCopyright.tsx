import { getFormattedDateTime } from '@/utils/date'
import { useEffect, useState } from 'react'

export function PostCopyright({
  lastMod,
}: {
  lastMod: Date
}) {
  const [lastModStr, setLastModStr] = useState('')

  useEffect(() => {
    setLastModStr(getFormattedDateTime(lastMod))
  }, [lastMod])

  return (
    <section className="text-xs leading-loose text-secondary">
      <p>最后修改时间：{lastModStr}</p>
    </section>
  )
}
