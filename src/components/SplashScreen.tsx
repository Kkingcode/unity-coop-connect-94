import { Building2, Users, Shield } from 'lucide-react';
const SplashScreen = () => {
  return <div className="min-h-screen flex items-center justify-center gradient-primary">
      <div className="text-center animate-fade-in-up">
        <div className="mb-8 relative">
          {/* Logo with animated rings */}
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute inset-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <Building2 size={48} className="text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">ONCS</h1>
          <p className="text-blue-100 text-lg">Olorun Ni Nsogo Cooperative Society</p>
        </div>
        
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-white/80">
            <Users size={20} />
            <span className="text-sm">Community</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Shield size={20} />
            <span className="text-sm">Security</span>
          </div>
        </div>
        
        <div className="animate-pulse">
          <div className="w-8 h-1 bg-white/60 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>;
};
export default SplashScreen;