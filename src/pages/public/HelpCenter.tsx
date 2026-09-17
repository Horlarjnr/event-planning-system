import { LifeBuoy } from 'lucide-react'
import ComingSoon
  from '../../components/ui/ComingSoon'

export default function HelpCenter() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <ComingSoon
        icon={LifeBuoy}
        title="Help Center"
        description="Our help center is under construction — check back shortly for guides and FAQs."
      />
    </div>
  )
}
