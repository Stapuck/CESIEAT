import React, { useEffect, useState } from 'react';

interface Log {
    containerId: string;
    log: string;
}

const DockerLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('/api/docker/logs'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch logs');
                }
                const data: Log[] = await response.json();
                setLogs(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <div>Loading logs...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Docker Container Logs</h1>
            {logs.length === 0 ? (
                <p>No logs available.</p>
            ) : (
                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>
                            <strong>Container ID:</strong> {log.containerId}
                            <pre>{log.log}</pre>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DockerLogsPage;