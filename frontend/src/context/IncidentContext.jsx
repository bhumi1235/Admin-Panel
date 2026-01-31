import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { incidentService } from '../services/incidentService';

const IncidentContext = createContext();

export const useIncidents = () => {
    const context = useContext(IncidentContext);
    if (!context) {
        throw new Error('useIncidents must be used within IncidentProvider');
    }
    return context;
};

export const IncidentProvider = ({ children }) => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load incidents on mount
    useEffect(() => {
        loadIncidents();
    }, []);

    const loadIncidents = useCallback(() => {
        setLoading(true);
        incidentService.initializeSampleData();
        const data = incidentService.getIncidents();
        setIncidents(data);
        setLoading(false);
    }, []);

    const createIncident = useCallback((incidentData) => {
        const newIncident = incidentService.createIncident(incidentData);
        setIncidents(prev => [newIncident, ...prev]);
        return newIncident;
    }, []);

    const updateIncident = useCallback((id, updates) => {
        const updated = incidentService.updateIncident(id, updates);
        if (updated) {
            setIncidents(prev => prev.map(inc => inc.id === id ? updated : inc));
        }
        return updated;
    }, []);

    const resolveIncident = useCallback((id, resolvedBy, resolutionNotes) => {
        const resolved = incidentService.resolveIncident(id, resolvedBy, resolutionNotes);
        if (resolved) {
            setIncidents(prev => prev.map(inc => inc.id === id ? resolved : inc));
        }
        return resolved;
    }, []);

    const deleteIncident = useCallback((id) => {
        incidentService.deleteIncident(id);
        setIncidents(prev => prev.filter(inc => inc.id !== id));
    }, []);

    const getActiveIncidentsCount = useCallback(() => {
        return incidents.filter(inc => inc.status === 'active').length;
    }, [incidents]);

    const getIncidentsByStatus = useCallback((status) => {
        return incidents.filter(inc => inc.status === status);
    }, [incidents]);

    const value = {
        incidents,
        loading,
        createIncident,
        updateIncident,
        resolveIncident,
        deleteIncident,
        getActiveIncidentsCount,
        getIncidentsByStatus,
        refreshIncidents: loadIncidents
    };

    return (
        <IncidentContext.Provider value={value}>
            {children}
        </IncidentContext.Provider>
    );
};
