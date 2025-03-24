export async function fetchSystemStatus() {
  const response = await fetch('/api/realtime/status');
  if (!response.ok) {
    throw new Error('Failed to fetch system status');
  }
  return response.json();
}

export async function controlIrrigationZone(zoneId: string, action: string) {
  const response = await fetch(`/api/irrigation/zone/${zoneId}/control`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  });
  return response.json();
}