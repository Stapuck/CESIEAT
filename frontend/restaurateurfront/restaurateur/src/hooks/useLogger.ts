import axios from "axios";



// Interface for log parameters
export interface LogParams {
    type: string;
    message: string;
    clientId_Zitadel: string;
}

export const useLogger = () => {
    const logEvent = async ({
        type,
        message,
        clientId_Zitadel
    }: LogParams) => {
        try {
            await axios.post("https://cesieat.nathan-lorit.com/api/logs", {
                type,
                message: "Restaurateur => " + message,
                createdAt: new Date(),
                clientId_Zitadel
            });
            console.log("Log entry created successfully", {
                type,
                message,
                clientId_Zitadel,
            });
        } catch (error) {
            console.error("Failed to log entry:", error);
        }
    };

    return logEvent;
};
