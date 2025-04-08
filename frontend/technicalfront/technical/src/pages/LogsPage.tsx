import { useState, useEffect } from "react";
import axios from "axios";
import { useLogger } from "../hooks/useLogger";

interface ILog {
  type?: string; // Rendre type optionnel
  message: string;
  createdAt: Date;
  clientId_Zitadel?: string;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const logger = useLogger();

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/logs");
      logger({
        type: "info",
        message: "Logs fetched successfully",
        clientId_Zitadel: "system",
      });
      // Transformer les données pour s'assurer que createdAt est bien une Date
      const formattedLogs = response.data.map((log: any) => ({
        ...log,
        createdAt: new Date(log.createdAt),
      }));
      setLogs(formattedLogs);
    } catch (error: any) {
      logger({
        type: "error",
        message: "Failed to fetch logs: " + error.message,
        clientId_Zitadel: "system",
      });

      setError(
        "Impossible de récupérer les logs. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div
      className="logs-container"
      style={{
        padding: "20px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Logs du système</h1>
        <button
          onClick={fetchLogs}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Rafraîchir
        </button>
      </div>

      {loading && <p>Chargement des logs...</p>}

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && logs.length === 0 && <p>Aucun log à afficher.</p>}

      {!loading && logs.length > 0 && (
        <div
          style={{
            overflowX: "auto",
            overflowY: "auto",
            flexGrow: 1,
            maxHeight: "calc(100% - 100px)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th style={tableHeaderStyle}>Type</th>
                <th style={tableHeaderStyle}>Message</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>ID Client</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                  }}
                >
                  <td style={tableCellStyle}>
                    <span style={getTypeStyle(log.type)}>
                      {log.type || "N/A"}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{log.message}</td>
                  <td style={tableCellStyle}>{formatDate(log.createdAt)}</td>
                  <td style={tableCellStyle}>
                    {log.clientId_Zitadel || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Styles pour le tableau
const tableHeaderStyle = {
  backgroundColor: "#f1f3f4",
  padding: "12px",
  textAlign: "left" as const,
  borderBottom: "2px solid #ddd",
  position: "sticky" as const,
  top: 0,
  zIndex: 1,
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

// Fonction pour déterminer le style du type de log
const getTypeStyle = (type?: string) => {
  let style = {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold" as const,
    backgroundColor: "#e0e0e0",
    color: "#616161",
  };

  switch (type?.toLowerCase()) {
    case "error":
      return { ...style, backgroundColor: "#ffebee", color: "#c62828" };
    case "warning":
      return { ...style, backgroundColor: "#fff8e1", color: "#ff8f00" };
    case "info":
      return { ...style, backgroundColor: "#e3f2fd", color: "#1565c0" };
    case "success":
      return { ...style, backgroundColor: "#e8f5e9", color: "#2e7d32" };
    default:
      return style;
  }
};

export default LogsPage;
