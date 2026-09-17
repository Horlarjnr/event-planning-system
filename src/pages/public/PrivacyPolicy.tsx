import { ShieldCheck } from 'lucide-react'
import ComingSoon from '../../components/ui/ComingSoon'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <ComingSoon
        icon={ShieldCheck}
        title="Privacy Policy"
        description="Our privacy policy is being finalized — check back shortly."
      />
    </div>
  )
}
