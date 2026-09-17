import { Info } from 'lucide-react'
import ComingSoon from '../../components/ui/ComingSoon'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <ComingSoon
        icon={Info}
        title="About Event Ease"
        description="We're putting together our story — check back shortly to learn more about the team behind Event Ease."
      />
    </div>
  )
}
