export type Order = {

}

export const fetchOrder = async (orderID: string) => {
  const { PEASY_DEAL_ENDPOINT } = process.env

  return await fetch(`${PEASY_DEAL_ENDPOINT}/v1/orders?order_id=${orderID}`, {
    method: 'GET',
  })
}