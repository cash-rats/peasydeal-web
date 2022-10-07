export const trackOrder = async (orderUUID: string): Promise<Response> => {
  const { PEASY_DEAL_ENDPOINT } = process.env
  return fetch(`${PEASY_DEAL_ENDPOINT}/v1/tracking?order_uuid=${orderUUID}`, {
    method: 'GET',
  })
}