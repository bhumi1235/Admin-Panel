/**
 * Schedule Service
 * Manages shift schedule CRUD operations and localStorage persistence
 */

const SCHEDULES_KEY = 'shift_schedules';

// Generate unique ID
const generateId = () => `SHIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const scheduleService = {
    // Get all schedules
    getSchedules: () => {
        try {
            const schedules = localStorage.getItem(SCHEDULES_KEY);
            return schedules ? JSON.parse(schedules) : [];
        } catch (error) {
            console.error('Error reading schedules:', error);
            return [];
        }
    },

    // Get schedule by ID
    getScheduleById: (id) => {
        const schedules = scheduleService.getSchedules();
        return schedules.find(schedule => schedule.id === id);
    },

    // Create new schedule
    createSchedule: (scheduleData) => {
        const schedules = scheduleService.getSchedules();
        const newSchedule = {
            id: generateId(),
            ...scheduleData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        schedules.unshift(newSchedule);
        localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
        return newSchedule;
    },

    // Update schedule
    updateSchedule: (id, updates) => {
        const schedules = scheduleService.getSchedules();
        const index = schedules.findIndex(schedule => schedule.id === id);

        if (index === -1) return null;

        schedules[index] = {
            ...schedules[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
        return schedules[index];
    },

    // Delete schedule
    deleteSchedule: (id) => {
        const schedules = scheduleService.getSchedules();
        const filtered = schedules.filter(schedule => schedule.id !== id);
        localStorage.setItem(SCHEDULES_KEY, JSON.stringify(filtered));
        return true;
    },

    // Initialize with sample data if empty
    initializeSampleData: () => {
        const existing = scheduleService.getSchedules();
        if (existing.length > 0) return;

        const sampleSchedules = [
            {
                id: generateId(),
                guard: "Robert Smith",
                date: new Date().toISOString().split('T')[0],
                startTime: "09:00",
                endTime: "17:00",
                location: "Main Gate",
                status: "Upcoming",
                notes: "Regular morning shift",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: generateId(),
                guard: "Sarah Johnson",
                date: new Date().toISOString().split('T')[0],
                startTime: "09:00",
                endTime: "17:00",
                location: "Lobby",
                status: "In Progress",
                notes: "Front desk coverage",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: generateId(),
                guard: "Mike Brown",
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                startTime: "22:00",
                endTime: "06:00",
                location: "Patrol",
                status: "Scheduled",
                notes: "Night patrol duty",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: generateId(),
                guard: "Emily Davis",
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                startTime: "14:00",
                endTime: "22:00",
                location: "Parking Lot",
                status: "Scheduled",
                notes: "Evening shift",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        localStorage.setItem(SCHEDULES_KEY, JSON.stringify(sampleSchedules));
    }
};
