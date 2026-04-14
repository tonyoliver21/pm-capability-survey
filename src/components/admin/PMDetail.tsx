import type { PMWithSubmissions } from '../../types'

interface Props {
  pm: PMWithSubmissions
}

export default function PMDetail({ pm }: Props) {
  return <p className="text-sm text-gray-500">Detail for {pm.name} — coming in Task 10.</p>
}
