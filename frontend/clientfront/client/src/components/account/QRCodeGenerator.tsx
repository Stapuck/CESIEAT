import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeGeneratorProps {
  commandeId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  commandeId: commandeId,
}) => {
  const [showQRCode, setShowQRCode] = useState(false);

  // Données à inclure dans le QR code (ID )
  const qrCodeData = JSON.stringify({
    id: commandeId,
  });

  return (
    <section className="bg-white rounded-lg ">
      <div className="flex flex-col items-center space-y-4">
        {showQRCode ? (
          <>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <QRCodeSVG
                value={qrCodeData}
                size={200}
                level="H" // Niveau de correction d'erreur élevé
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              Présentez ce QR code au livreur pour identifier votre commande
            </p>
            <button
              onClick={() => setShowQRCode(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Masquer le QR code
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowQRCode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Générer mon QR code
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QRCodeGenerator;
