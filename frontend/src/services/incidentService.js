/**
 * Incident Service
 * Manages incident CRUD operations and localStorage persistence
 */

const INCIDENTS_KEY = 'security_incidents';

// Generate unique ID
const generateId = () => `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Format time ago helper
export const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return past.toLocaleDateString();
};

export const incidentService = {
    // Get all incidents
    getIncidents: () => {
        try {
            const incidents = localStorage.getItem(INCIDENTS_KEY);
            return incidents ? JSON.parse(incidents) : [];
        } catch (error) {
            console.error('Error reading incidents:', error);
            return [];
        }
    },

    // Get incidents by status
    getIncidentsByStatus: (status) => {
        const incidents = incidentService.getIncidents();
        return incidents.filter(incident => incident.status === status);
    },

    // Get incident by ID
    getIncidentById: (id) => {
        const incidents = incidentService.getIncidents();
        return incidents.find(incident => incident.id === id);
    },

    // Create new incident
    createIncident: (incidentData) => {
        const incidents = incidentService.getIncidents();
        const newIncident = {
            id: generateId(),
            ...incidentData,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        incidents.unshift(newIncident);
        localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
        return newIncident;
    },

    // Update incident
    updateIncident: (id, updates) => {
        const incidents = incidentService.getIncidents();
        const index = incidents.findIndex(incident => incident.id === id);

        if (index === -1) return null;

        incidents[index] = {
            ...incidents[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
        return incidents[index];
    },

    // Resolve incident
    resolveIncident: (id, resolvedBy, resolutionNotes) => {
        return incidentService.updateIncident(id, {
            status: 'resolved',
            resolvedBy,
            resolutionNotes,
            resolvedAt: new Date().toISOString()
        });
    },

    // Delete incident
    deleteIncident: (id) => {
        const incidents = incidentService.getIncidents();
        const filtered = incidents.filter(incident => incident.id !== id);
        localStorage.setItem(INCIDENTS_KEY, JSON.stringify(filtered));
        return true;
    },

    // Initialize with sample data if empty
    initializeSampleData: () => {
        const existing = incidentService.getIncidents();
        if (existing.length > 0) return;

        const sampleIncidents = [
            {
                id: generateId(),
                title: "Unauthorized Access Attempt",
                type: "incident",
                severity: "high",
                location: "Main Gate",
                officer: "John Smith",
                description: "Suspicious individual attempted to enter without proper credentials. Security protocol followed.",
                status: "active",
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                updatedAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
                id: generateId(),
                title: "Equipment Malfunction",
                type: "report",
                severity: "medium",
                location: "Parking Lot",
                officer: "Sarah Johnson",
                description: "Camera #3 in parking lot showing intermittent feed. Maintenance requested.",
                status: "active",
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                updatedAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: generateId(),
                title: "Routine Patrol Completed",
                type: "report",
                severity: "low",
                location: "Building Perimeter",
                officer: "Mike Brown",
                description: "All clear. No issues found during routine perimeter check.",
                status: "resolved",
                resolvedBy: "Mike Brown",
                resolutionNotes: "Patrol completed successfully. All areas secure.",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                resolvedAt: new Date(Date.now() - 82800000).toISOString()
            },
            {
                id: generateId(),
                title: "Fire Alarm Test",
                type: "alert",
                severity: "medium",
                location: "Building A",
                officer: "Emily Davis",
                description: "Scheduled fire alarm system test completed successfully.",
                status: "resolved",
                resolvedBy: "Emily Davis",
                resolutionNotes: "All systems functioning properly. Test successful.",
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString(),
                resolvedAt: new Date(Date.now() - 169200000).toISOString()
            }
        ];

        localStorage.setItem(INCIDENTS_KEY, JSON.stringify(sampleIncidents));
    }
};
