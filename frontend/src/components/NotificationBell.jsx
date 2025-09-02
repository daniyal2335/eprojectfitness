import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Bell } from 'lucide-react';

export default function NotificationBell(){
  const [list,setList]=useState([]);
  const [open,setOpen]=useState(false);

  useEffect(()=>{ api('/api/notifications').then(setList).catch(()=>{}); },[]);
  const unread = list.filter(n=>!n.read).length;

  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="relative p-2 rounded-full hover:bg-gray-100">
        <Bell />
        {unread>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow p-3">
          <p className="font-medium mb-2">Notifications</p>
          <div className="space-y-2 max-h-64 overflow-auto">
            {list.length? list.map(n=>(<div key={n._id} className="text-sm border-b pb-2">{n.message}</div>)) : <p className="text-sm text-gray-500">No notifications</p>}
          </div>
        </div>
      )}
    </div>
  );
}
