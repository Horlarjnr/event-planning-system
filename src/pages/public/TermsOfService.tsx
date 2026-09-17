import { FileText } from 'lucide-react'
import ComingSoon from '../../components/ui/ComingSoon'

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <ComingSoon
        icon={FileText}
        title="Terms of Service"
        description="Our terms of service are being finalized — check back shortly."
      />
    </div>
  )
}
