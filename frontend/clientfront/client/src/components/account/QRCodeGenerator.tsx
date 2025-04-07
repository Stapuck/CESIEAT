import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import LogoQrCode from "../../assets/icons/qrcode.svg";

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
    <section className=" rounded-lg ">
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
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md  shadow-mdhover:cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              Masquer le QR code
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowQRCode(true)}
              className="bg-tertiary text-white hover:bg-gray-100 hover:text-tertiary font-medium py-2 px-4 shadow-md rounded-md hover:cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <img
                src={LogoQrCode}
                alt="Logo QR Code"
                className="w-6 h-6 inline-block mr-2"
              />
              Générer mon QR code
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QRCodeGenerator;
