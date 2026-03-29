export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono px-8 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-white/40 text-sm mb-8">Last updated March 28, 2026</p>
      
      <div className="space-y-6 text-white/70 text-sm leading-relaxed">
        <p>By using TeamAutomation, you agree to these terms.</p>
        
        <h2 className="text-white font-bold text-lg">Service</h2>
        <p>TeamAutomation provides Slack-based approval automation. We offer a 14-day free trial followed by $49/month subscription.</p>
        
        <h2 className="text-white font-bold text-lg">Account</h2>
        <p>You are responsible for maintaining the security of your account and Slack workspace connection.</p>
        
        <h2 className="text-white font-bold text-lg">Payment</h2>
        <p>Subscriptions are billed monthly. You can cancel anytime. No refunds for partial months.</p>
        
        <h2 className="text-white font-bold text-lg">Termination</h2>
        <p>We reserve the right to terminate accounts that violate these terms.</p>
        
        <h2 className="text-white font-bold text-lg">Contact</h2>
        <p>Questions? Email us at hafizmahadtahir1@gmail.com</p>
      </div>
    </div>
  );
}