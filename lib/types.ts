export interface Activity {
  id: string;
  activity_name: string;
  attendees: string;
  activity_date: string;
  activity_time: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  is_today: boolean;
}

export interface Accomplishment {
  id: string;
  accomplishment_name: string;
  description: string;
  action_photo_url: string;
  accomplishment_date: string;
}

export interface Compliance {
  id: string;
  subject: string;
  category: string;
  action_required: string;
  target_date: string;
  date_received: string;
  date_sent: string;
  recipient: string;
  remarks: string;
  duty_pnco: string;
}

export interface DutyPNCO {
  date: string;
  pnco_name: string;
  contact_number: string;
  is_today: boolean;
}

export interface KPIs {
  total_activities: number;
  upcoming_count: number;
  completed_count: number;
  total_accomplishments: number;
  total_compliances: number;
  upcoming_compliances: number;
  complied_count: number;
  not_complied_count: number;
}

export interface DashboardData {
  kpis: KPIs;
  activities: Activity[];
  accomplishments: Accomplishment[];
  compliances: Compliance[];
  duty_pnco: DutyPNCO[];
  fetched_at: string;
}
