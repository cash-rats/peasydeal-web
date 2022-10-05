export type Order = {

}

export const fetchOrder = async (orderUUID: string) => {
  const { PEASY_DEAL_ENDPOINT } = process.env

  return await fetch(`${PEASY_DEAL_ENDPOINT}/v1/orders?order_uuid=${orderUUID}`, {
    method: 'GET',
  })
}