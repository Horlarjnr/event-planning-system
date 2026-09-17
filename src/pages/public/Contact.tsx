import { Mail } from 'lucide-react'
import ComingSoon from '../../components/ui/ComingSoon'

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <ComingSoon
        icon={Mail}
        title="Contact Us"
        description="Our contact page is on its way. In the meantime, reach us at hello@eventease.app."
      />
    </div>
  )
}
