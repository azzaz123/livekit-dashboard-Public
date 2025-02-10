import DashboardStats from "@/components/DashboardStats";
import IngressList from "@/components/IngressList";
import EgressList from "@/components/EgressList";
import RoomsList from "@/components/RoomsList";

export default function Dashboard() {
  return (
    <div className="space-y-8">      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Overview</h2>
        <p className="text-surface-500">Monitor your LiveKit server's performance and activity</p>
        <div className="mt-6">
          <DashboardStats />
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="bg-surface-50/50 rounded-2xl p-6 border border-surface-200/50">
          <RoomsList />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-50/50 rounded-2xl p-6 border border-surface-200/50">
            <IngressList />
          </div>
          <div className="bg-surface-50/50 rounded-2xl p-6 border border-surface-200/50">
            <EgressList />
          </div>
        </div>
      </div>
    </div>
  );
}
