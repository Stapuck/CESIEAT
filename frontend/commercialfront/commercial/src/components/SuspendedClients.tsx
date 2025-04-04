import React from 'react';

const SuspendedClients = ({
  clients,
  handleUpdateClient,
  handleCheckboxChange,
  selectedClients,
}) => (
  <ul>
    {clients.map(client => (
      <li key={client._id} className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={selectedClients.includes(client._id)}
          onChange={e => handleCheckboxChange(client._id, e.target.checked)}
          className="mr-2"
        />
        <span className="flex-1">{client.name}</span>
        <button
          onClick={() => handleUpdateClient(client._id, { isPaused: false })}
          className="ml-4 text-green-500"
        >
          Réactiver
        </button>
      </li>
    ))}
  </ul>
);

export default SuspendedClients;
