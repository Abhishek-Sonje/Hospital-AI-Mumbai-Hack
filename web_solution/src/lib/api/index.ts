import {
  Alert,
  Appointment,
  InventoryItem,
  Plan,
  Staff,
  Ward,
  WeatherData,
  ForecastData,
} from "../types";

// Mock Data Generators

const generateForecastData = (): ForecastData[] => {
  const data: ForecastData[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    data.push({
      timestamp: time.toISOString(),
      predictedVolume: Math.floor(Math.random() * 50) + 20,
      baselineVolume: 30,
    });
  }
  return data;
};

export const getSurgeForecast = async (): Promise<ForecastData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateForecastData();
};

export const getWeatherData = async (): Promise<WeatherData> => {
  return {
    temp: 28,
    humidity: 65,
    condition: "Haze",
    aqi: 210,
    aqiStatus: "Unhealthy",
  };
};

export const getStaffList = async (): Promise<Staff[]> => {
  return [
    {
      id: "1",
      name: "Dr. Sharma",
      role: "Doctor",
      department: "Emergency",
      shifts: [],
      weeklyHours: 40,
      status: "Active",
    },
    {
      id: "2",
      name: "Nurse Priya",
      role: "Nurse",
      department: "ICU",
      shifts: [],
      weeklyHours: 36,
      status: "Active",
    },
    // Add more mock staff...
  ];
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  return [
    {
      id: "1",
      name: "Oxygen Cylinders",
      category: "Respiratory",
      currentStock: 45,
      unit: "units",
      forecastedUsage: 60,
      reorderLevel: 20,
      status: "At Risk",
      lastRestocked: "2023-10-20",
    },
    {
      id: "2",
      name: "N95 Masks",
      category: "PPE",
      currentStock: 500,
      unit: "boxes",
      forecastedUsage: 200,
      reorderLevel: 100,
      status: "Safe",
      lastRestocked: "2023-10-25",
    },
  ];
};

export const getWards = async (): Promise<Ward[]> => {
  return [
    {
      id: "1",
      name: "General Ward A",
      type: "General",
      capacity: 40,
      occupied: 35,
      predictedPeak: 42,
      aiRecommendation: "Convert 5 beds to semi-ICU",
    },
    {
      id: "2",
      name: "ICU",
      type: "ICU",
      capacity: 15,
      occupied: 12,
      predictedPeak: 15,
    },
  ];
};

export const getAlerts = async (): Promise<Alert[]> => {
  return [
    {
      id: "1",
      title: "High AQI Warning",
      message: "AQI predicted to cross 300. Prepare for respiratory surge.",
      type: "Staff",
      severity: "High",
      status: "Unread",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Diwali Staffing",
      message: "Staffing plan for Diwali night generated.",
      type: "Staff",
      severity: "Medium",
      status: "Read",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
};

export const getAppointments = async (): Promise<Appointment[]> => {
  return [
    {
      id: "1",
      patientName: "Rahul Kumar",
      doctorName: "Dr. Gupta",
      department: "Cardiology",
      time: "10:00 AM",
      status: "Confirmed",
      isSurgeImpacted: false,
    },
    {
      id: "2",
      patientName: "Anita Singh",
      doctorName: "Dr. Sharma",
      department: "Pulmonology",
      time: "02:00 PM",
      status: "Confirmed",
      isSurgeImpacted: true,
      aiSuggestion: "Reschedule to next week due to OPD surge",
    },
  ];
};

export const getPlans = async (): Promise<Plan[]> => {
  return [
    {
      id: "1",
      type: "Staffing",
      status: "Pending Approval",
      createdAt: new Date().toISOString(),
      summary: "Diwali Night Roster",
    },
    {
      id: "2",
      type: "Inventory",
      status: "Active",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      summary: "Winter Stocking Plan",
    },
  ];
};
