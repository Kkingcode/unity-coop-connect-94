
import { Home, CreditCard, History, Bell, User } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigate: (screen: Screen) => void;
}

const BottomNavigation = ({ activeTab, onTabChange, onNavigate }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home', screen: 'member-dashboard' as Screen },
    { id: 'loans', icon: CreditCard, label: 'Loans', screen: 'loan-application' as Screen },
    { id: 'history', icon: History, label: 'History', screen: 'transaction-history' as Screen },
    { id: 'notifications', icon: Bell, label: 'Alerts', screen: 'member-dashboard' as Screen },
    { id: 'profile', icon: User, label: 'Profile', screen: 'member-dashboard' as Screen },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    onTabChange(tab.id);
    if (tab.screen !== 'member-dashboard') {
      onNavigate(tab.screen);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
