export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono px-8 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-white/40 text-sm mb-8">Last updated March 28, 2026</p>
      
      <div className="space-y-6 text-white/70 text-sm leading-relaxed">
        <p>This Privacy Policy describes how TeamAutomation collects, uses, and shares information about you when you use our services.</p>
        
        <h2 className="text-white font-bold text-lg">Information We Collect</h2>
        <p>We collect information you provide directly: name, email address, and Slack workspace data when you connect your account.</p>
        
        <h2 className="text-white font-bold text-lg">How We Use Information</h2>
        <p>We use your information to provide the TeamAutomation service, send notifications, and improve our product.</p>
        
        <h2 className="text-white font-bold text-lg">Data Storage</h2>
        <p>Your data is stored securely on Supabase servers. Payment information is handled by Stripe.</p>
        
        <h2 className="text-white font-bold text-lg">Contact</h2>
        <p>Questions? Email us at hafizmahadtahir1@gmail.com</p>
      </div>
    </div>
  );
}