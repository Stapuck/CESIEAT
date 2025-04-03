import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  MediaPermissionsError,
  MediaPermissionsErrorType,
  requestMediaPermissions
} from 'mic-check';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
  onError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, onError }) => {
  const [scanning, setScanning] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [requestingPermission, setRequestingPermission] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef<boolean>(false); // Référence pour suivre l'état du scanner
  const scannerDivId = "qr-reader";

  // Référence pour stocker la fonction onScan pour éviter qu'elle ne change lors des re-renders
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  // Demander automatiquement la permission de la caméra au chargement
  useEffect(() => {
    requestCameraPermission();

    // Nettoyage lors du démontage du composant
    return () => {
      cleanupScanner();
    };
  }, []);

  // Initialiser le scanner une fois que l'élément DOM est disponible et que les permissions sont accordées
  useEffect(() => {
    if (permissionGranted && !scanning) {
      // Petit délai pour s'assurer que le DOM est rendu
      const timer = setTimeout(() => {
        const scannerElement = document.getElementById(scannerDivId);
        if (scannerElement) {
          setScanning(true);
          initializeScanner();
        } else {
          console.error(`Élément avec ID ${scannerDivId} non trouvé dans le DOM`);
          setPermissionError(`Erreur: élément scanner non trouvé dans le DOM`);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [permissionGranted]);
  
  // Fonction pour demander explicitement l'autorisation de la caméra avec mic-check
  const requestCameraPermission = async () => {
    setRequestingPermission(true);
    setPermissionError(null);

    try {
      // Utilisation de mic-check pour demander les permissions
      await requestMediaPermissions({ video: true, audio: false });
      
      // Si l'autorisation est accordée, marquer comme accordée
      setPermissionGranted(true);
    } catch (err) {
      console.error("Erreur lors de la demande d'autorisation de la caméra:", err);
      
      if ('type' in err && 'message' in err) {
        const { type, message } = err;
        
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          setPermissionError(
            "Le navigateur n'a pas l'autorisation d'accéder à la caméra. Vérifiez les paramètres de votre système."
          );
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          setPermissionError(
            "Vous avez refusé l'accès à la caméra. Veuillez autoriser l'accès dans les paramètres de votre navigateur."
          );
        } else if (type === MediaPermissionsErrorType.CouldNotStartVideoSource) {
          setPermissionError(
            "Impossible d'accéder à la caméra. Elle est peut-être utilisée par une autre application (Zoom, Skype) ou un autre onglet."
          );
        } else {
          setPermissionError(`Erreur d'accès à la caméra: ${message}`);
        }
      } else {
        setPermissionError("Une erreur inattendue s'est produite lors de l'accès à la caméra.");
      }
      
      if (onError) {
        onError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setRequestingPermission(false);
    }
  };

  // Fonction sécurisée pour arrêter le scanner
  const cleanupScanner = () => {
    // Vérifier si le scanner existe et est en cours d'exécution
    if (scannerRef.current && isRunningRef.current) {
      try {
        isRunningRef.current = false; // Marquer comme arrêté avant l'arrêt effectif
        return scannerRef.current.stop().catch(error => {
          console.error("Erreur lors de l'arrêt du scanner:", error);
          // Ignorer les erreurs spécifiques "Cannot stop, scanner is not running or paused"
          return Promise.resolve();
        });
      } catch (error) {
        console.error("Exception lors de l'arrêt du scanner:", error);
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  };

  const initializeScanner = () => {
    try {
      // Vérifier que l'élément existe avant d'initialiser le scanner
      const element = document.getElementById(scannerDivId);
      if (!element) {
        throw new Error(`Élément avec ID ${scannerDivId} non trouvé`);
      }
      
      // S'assurer qu'un scanner précédent est nettoyé
      if (scannerRef.current) {
        cleanupScanner();
      }
      
      const html5QrCode = new Html5Qrcode(scannerDivId);
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Marquer le scanner comme en cours d'exécution
          isRunningRef.current = true;
          
          // Stocker la valeur scannée car nous allons perdre le contexte
          const scannedData = decodedText;
          
          // Arrêter le scanner et ensuite traiter les données
          cleanupScanner().then(() => {
            // Utiliser setTimeout pour éviter les conflits d'état
            setTimeout(() => {
              try {
                // Tenter de parser le JSON du QR code
                const parsedData = JSON.parse(scannedData);
                
                // Vérifier si le format attendu est correct (contient un id)
                if (parsedData && parsedData.id) {
                  // Passer l'ID de commande à la fonction onScan
                  onScanRef.current(parsedData.id);
                } else {
                  // Si le JSON n'a pas le format attendu, on passe la chaîne brute
                  onScanRef.current(scannedData);
                  console.warn("QR code scanné ne contient pas d'ID de commande valide");
                }
              } catch (error) {
                // En cas d'erreur de parsing JSON, passer la chaîne brute
                console.warn("Erreur lors du parsing du QR code:", error);
                onScanRef.current(scannedData);
              }
            }, 0);
          });
        },
        (errorMessage) => {
          // Erreur pendant le scan - ignorée à moins qu'elle ne concerne les permissions
          if (errorMessage.toString().includes('permission')) {
            setPermissionError("Erreur d'accès à la caméra. Veuillez autoriser l'accès.");
            if (onError) onError(errorMessage);
            stopScanning();
          }
        }
      ).then(() => {
        // Scanner démarré avec succès
        isRunningRef.current = true;
      }).catch(err => {
        // Erreur lors du démarrage du scanner
        console.error("Erreur d'initialisation du scanner:", err);
        setPermissionError("Impossible d'accéder à la caméra. " + err.toString());
        if (onError) onError(String(err));
        setScanning(false);
        setPermissionGranted(false);
        isRunningRef.current = false;
      });
    } catch (err) {
      console.error("Erreur lors de la création du scanner:", err);
      setPermissionError("Erreur technique lors de l'initialisation du scanner.");
      if (onError) onError(String(err));
      setScanning(false);
      setPermissionGranted(false);
      isRunningRef.current = false;
    }
  };

  const stopScanning = () => {
    cleanupScanner().then(() => {
      setScanning(false);
      setPermissionGranted(false);
      if (onClose) onClose();
    });
  };



  // Interface utilisateur améliorée pour la gestion des permissions
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Scanner un QR Code</h2>
      
      {!permissionGranted && !requestingPermission && permissionError ? (
        <div className="w-full flex flex-col items-center">
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            <p className="font-medium mb-1">Erreur de permission</p>
            <p className="text-center">{permissionError}</p>
            <button 
              onClick={requestCameraPermission}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : requestingPermission ? (
        <div className="w-full flex flex-col items-center">
          <div className="animate-pulse text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Demande d'accès à la caméra en cours...</p>
            <p className="text-sm text-gray-600 mt-2">
              Veuillez autoriser l'accès à la caméra lorsque le navigateur vous le demande.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="relative mb-4">
            <div 
              id={scannerDivId} 
              className="w-full h-64 rounded-lg overflow-hidden border-2 border-green-500"
              style={{ width: '100%', minHeight: '300px' }}
            ></div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={stopScanning}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Annuler
            </button>
          </div>
          
          <p className="text-center mt-4 text-gray-600">
            Centrez le QR code dans le cadre pour le scanner automatiquement
          </p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
