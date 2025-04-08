import { useState, useCallback } from "react";
import axios from "axios";
import QRScanner from "../components/QRScanner";
import { toast } from "react-toastify";

const ScanPage = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // Fonction pour gérer la mise à jour du statut de la commande
  const handleCommande = useCallback(async (commandeId: string) => {
    setProcessing(true);
    try {
      // Appel à l'API pour marquer la commande comme "Livrée"
      await axios.put(`https://cesieat.nathan-lorit.com/api/commandes/${commandeId}`, { status: "Livrée" });
      toast.success("Commande marquée comme livrée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error);
      toast.error("Erreur lors de la mise à jour de la commande");
    } finally {
      setProcessing(false);
    }
  }, []);
  
  // Utiliser useCallback pour stabiliser la fonction de gestion
  const handleQrScan = useCallback((data: string) => {
    console.log("QR Code scanné:", data);
    
    // Différer la mise à jour de l'état
    setTimeout(() => {
      setScannedData(data);
      // Mettre à jour le statut de la commande
      handleCommande(data);
    }, 100);
  }, [handleCommande]);
  
  const resetScanner = useCallback(() => {
    setScannedData(null);
  }, []);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Scanner un code de commande</h1>
      
      {scannedData ? (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="font-medium">QR Code scanné avec succès!</p>
          <p className="break-all mt-2">ID de commande: {scannedData}</p>
          {processing ? (
            <div className="mt-4 flex items-center">
              <div className="mr-3 w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
              Mise à jour du statut...
            </div>
          ) : (
            <p className="text-green-600 font-medium mt-2">
              La commande a été marquée comme livrée
            </p>
          )}
          <button 
            onClick={resetScanner}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            disabled={processing}
          >
            Scanner un autre code
          </button>
        </div>
      ) : (
        <QRScanner 
          onScan={handleQrScan} 
          onError={(err) => console.error('Erreur:', err)}
        />
      )}
    </div>
  );
};

export default ScanPage;
